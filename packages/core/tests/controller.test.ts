// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createLight } from '../src/index.js';

let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let queries: MediaQueryList[];
let observers: Array<{ fire(): void; disconnected: boolean }>;
function flush() {
  const batch = [...frames.values()]; frames.clear();
  for (const callback of batch) callback(0);
}
function element() {
  const node = document.createElement('button'); document.body.append(node);
  const measure = vi.spyOn(node, 'getBoundingClientRect').mockReturnValue({ left:100, top:100, width:100, height:100, right:200, bottom:200, x:100, y:100, toJSON() {} });
  return {node,measure};
}
function point(x = 250, y = 150, pointerType = 'mouse') {
  document.dispatchEvent(Object.assign(new Event('pointermove'),{clientX:x,clientY:y,pointerType}));
}
beforeEach(() => {
  document.body.replaceChildren(); frames = new Map(); frameId = 0; queries = []; observers = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.set(++frameId,callback); return frameId; });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {frames.delete(id);});
  vi.stubGlobal('matchMedia',(query: string) => {
    const result = Object.assign(new EventTarget(),{media:query,matches:query.includes('pointer: fine'),onchange:null,addListener(){},removeListener(){}});
    queries.push(result); return result;
  });
  vi.stubGlobal('ResizeObserver',class {
    state: {fire():void;disconnected:boolean};
    constructor(callback: ResizeObserverCallback) { this.state={fire:()=>callback([],this),disconnected:false}; observers.push(this.state); }
    observe() {} unobserve() {} disconnect(){this.state.disconnected=true;}
  });
});
afterEach(() => {vi.restoreAllMocks();vi.unstubAllGlobals();});

it('queues child registrations, coalesces pointer frames and reuses geometry', () => {
  const light=createLight(); const {node,measure}=element(); const entry=light.register(node,'raised');
  expect(frames.size).toBe(0);
  const stop=light.mount(document); flush();
  point();point();point(); expect(frames.size).toBe(1);flush();
  expect(node.style.getPropertyValue('--wisp-angle')).toBe('90.0deg');
  expect(measure).toHaveBeenCalledOnce(); expect(frames.size).toBe(0);
  point(50,150);flush();expect(node.style.getPropertyValue('--wisp-angle')).toBe('270.0deg');
  expect(measure).toHaveBeenCalledOnce(); entry.destroy();stop();
});
it('restores values and rewrites static output after stop and restart', () => {
  const light=createLight({mode:'static'});const {node}=element();
  node.style.setProperty('--wisp-angle','22deg','important');
  const entry=light.register(node,'raised');let stop=light.mount(document);flush();
  expect(node.style.getPropertyValue('--wisp-angle')).toBe('315.0deg');
  stop();stop();expect(node.style.getPropertyValue('--wisp-angle')).toBe('22deg');
  expect(node.style.getPropertyPriority('--wisp-angle')).toBe('important');
  stop=light.mount(document);flush();expect(node.style.getPropertyValue('--wisp-angle')).toBe('315.0deg');
  entry.destroy();stop();expect(node.style.getPropertyValue('--wisp-angle')).toBe('22deg');
  expect(observers.every(observer=>observer.disconnected)).toBe(true);
});
it('updates material and options without a new pointer and attaches late surfaces', () => {
  const light=createLight({mode:'static'}); const stop=light.mount(document); const {node}=element();
  const entry=light.register(node,'raised');expect(frames.size).toBe(1);flush();
  entry.update('recessed');flush();expect(node.style.getPropertyValue('--wisp-angle')).toBe('135.0deg');
  light.configure({mode:'static',intensity:0.4});flush();expect(node.style.getPropertyValue('--wisp-strength')).toBe('0.280');
  entry.destroy();stop();
});
it('separates visual and geometry invalidation and refreshes stationary pointers', () => {
  const light=createLight();const {node,measure}=element();light.register(node,'raised');const stop=light.mount(document);point();flush();
  node.dispatchEvent(new Event('scroll'));flush();expect(measure).toHaveBeenCalledTimes(2);
  light.refresh();flush();expect(measure).toHaveBeenCalledTimes(3);
  stop();expect(frames.size).toBe(0);
});
it('rejects duplicate ownership and other documents even before mounting', () => {
  const first=createLight();const second=createLight();const {node}=element();const entry=first.register(node,'raised');
  expect(()=>second.register(node,'raised')).toThrow('owner');
  const another=document.implementation.createHTMLDocument();
  expect(()=>first.register(another.createElement('div'),'raised')).toThrow('document');
  expect(()=>first.mount(another)).toThrow('document');
  entry.destroy();entry.destroy();const replacement=second.register(node,'matte');replacement.destroy();
});
it('accepts mouse events on hybrid devices and keeps auto reduced-motion static', () => {
  const light=createLight();const {node}=element();light.register(node,'raised');const stop=light.mount(document);flush();
  const fine=queries[1]; if (!fine) throw new Error('no media query');
  Object.defineProperty(fine,'matches',{value:false});fine.dispatchEvent(new Event('change'));flush();
  point();flush();expect(node.style.getPropertyValue('--wisp-angle')).toBe('90.0deg');
  const reduced=queries[0];if (!reduced) throw new Error('no media query');
  Object.defineProperty(reduced,'matches',{value:true});reduced.dispatchEvent(new Event('change'));point();flush();
  expect(node.style.getPropertyValue('--wisp-angle')).toBe('315.0deg');
  light.configure({mode:'pointer'});point();flush();expect(node.style.getPropertyValue('--wisp-angle')).toBe('90.0deg');stop();
});
it('cancels frames and ignores late observer callbacks after stopping', () => {
  const light=createLight();const {node}=element();const entry=light.register(node,'raised');const stop=light.mount(document);point();
  stop();expect(frames.size).toBe(0);point();expect(frames.size).toBe(0);
  for (const observer of observers) observer.fire();
  light.refresh();expect(frames.size).toBe(0);entry.destroy();expect(node.style.getPropertyValue('--wisp-strength')).toBe('');
});
it('clears pointer output on window blur and never handles touch as a light', () => {
  const light=createLight();const {node}=element();light.register(node,'raised');const stop=light.mount(document);
  point(250,150,'touch');flush();expect(node.style.getPropertyValue('--wisp-strength')).toBe('0.000');
  point();flush();window.dispatchEvent(new Event('blur'));flush();expect(node.style.getPropertyValue('--wisp-strength')).toBe('0.000');stop();
});
it('validates options atomically', () => {
  expect(()=>createLight({radius:0})).toThrow(RangeError);
  expect(()=>createLight({intensity:Infinity})).toThrow(RangeError);
  const light=createLight({mode:'static'});expect(()=>light.configure({radius:NaN})).toThrow(RangeError);
});

it('reads all dirty rectangles before writing and skips unchanged output', () => {
  const light=createLight({mode:'static'}); const first=element();const second=element();
  const events:string[]=[];
  first.measure.mockImplementation(()=>{events.push('read');return new DOMRect(0,0,100,100);});
  second.measure.mockImplementation(()=>{events.push('read');return new DOMRect(100,0,100,100);});
  const firstWrite=vi.spyOn(first.node.style,'setProperty');
  firstWrite.mockImplementation(()=>{events.push('write');});
  vi.spyOn(second.node.style,'setProperty').mockImplementation(()=>{events.push('write');});
  const a=light.register(first.node,'raised');const b=light.register(second.node,'matte');const stop=light.mount(document);flush();
  expect(events.slice(0,2)).toEqual(['read','read']);
  expect(events.slice(2).every(value=>value==='write')).toBe(true);
  const count=firstWrite.mock.calls.length;light.configure({mode:'static'});flush();
  expect(firstWrite).toHaveBeenCalledTimes(count);a.destroy();b.destroy();stop();
});
