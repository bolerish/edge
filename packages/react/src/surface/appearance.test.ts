// @vitest-environment jsdom
import { expect, it } from 'vitest';
import { getSurfaceProps } from '@bolerish/edge-styles';
import { bindSurfaceAppearance } from './appearance.js';

it('preserves existing classes, inline styles and priorities when released', () => {
  const host = document.createElement('div');
  const props = getSurfaceProps({ color: 'red', intensity: 0.5 });
  const sharedClass = props.className!.split(' ')[0]!;
  host.className = `own ${sharedClass}`;
  host.style.padding = '12px';
  host.style.setProperty('--edge-highlight', 'blue', 'important');
  host.style.setProperty('--edge-angle', '42deg');
  const binding = bindSurfaceAppearance(host, props);
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('red');
  expect(host.style.getPropertyPriority('--edge-highlight')).toBe('');
  binding.destroy();
  expect(host.className).toBe(`own ${sharedClass}`);
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('blue');
  expect(host.style.getPropertyPriority('--edge-highlight')).toBe('important');
  expect(host.style.getPropertyValue('--edge-intensity')).toBe('');
  expect(host.style.getPropertyValue('--edge-angle')).toBe('42deg');
  expect(host.style.padding).toBe('12px');
});
it('retains the latest consumer variable through option changes and restores it on release', () => {
  const host = document.createElement('div');
  const binding = bindSurfaceAppearance(host, getSurfaceProps({ color: 'red' }));
  host.style.setProperty('--edge-highlight', 'green', 'important');
  binding.update(getSurfaceProps({ color: 'blue' }));
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('blue');
  binding.update(getSurfaceProps());
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('green');
  expect(host.style.getPropertyPriority('--edge-highlight')).toBe('important');
  binding.update(getSurfaceProps({ color: 'red' }));
  host.style.setProperty('--edge-highlight', 'purple');
  binding.destroy();
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('purple');
});
it('updates decoration slots, reapplies classes after child changes and disconnects on release', async () => {
  const host = document.createElement('div');
  const after = getSurfaceProps();
  const before = getSurfaceProps({ pseudoElement: 'before' });
  const binding = bindSurfaceAppearance(host, after);
  binding.update(before);
  expect(host.className).toBe(before.className);
  host.className = 'child-updated';
  await Promise.resolve();
  expect(host.classList.contains('child-updated')).toBe(true);
  for (const token of before.className!.split(' '))
    expect(host.classList.contains(token)).toBe(true);
  binding.destroy();
  expect(host.className).toBe('child-updated');
  host.className = 'later';
  await Promise.resolve();
  expect(host.className).toBe('later');
});

it('captures a new caller baseline even when Edge was not writing a variable', () => {
  const host = document.createElement('div');
  const binding = bindSurfaceAppearance(host, getSurfaceProps());
  host.style.setProperty('--edge-highlight', 'green');
  binding.update(getSurfaceProps({ color: 'red' }));
  binding.update(getSurfaceProps());
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('green');
  binding.destroy();
});
it('restores caller changes with ordinary priority or only a changed priority', () => {
  const host = document.createElement('div');
  const binding = bindSurfaceAppearance(host, getSurfaceProps({ color: 'red' }));
  host.style.setProperty('--edge-highlight', 'green');
  binding.update(getSurfaceProps({ color: 'blue' }));
  expect(host.style.getPropertyPriority('--edge-highlight')).toBe('');
  binding.update(getSurfaceProps());
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('green');
  binding.update(getSurfaceProps({ color: 'red' }));
  host.style.setProperty('--edge-highlight', 'red', 'important');
  binding.update(getSurfaceProps({ color: 'red' }));
  expect(host.style.getPropertyPriority('--edge-highlight')).toBe('');
  binding.destroy();
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('red');
  expect(host.style.getPropertyPriority('--edge-highlight')).toBe('important');
});
it('preserves a caller priority change made immediately before detaching', () => {
  const host = document.createElement('div');
  const binding = bindSurfaceAppearance(host, getSurfaceProps({ color: 'red' }));
  host.style.setProperty('--edge-highlight', 'red', 'important');
  binding.destroy();
  expect(host.style.getPropertyValue('--edge-highlight')).toBe('red');
  expect(host.style.getPropertyPriority('--edge-highlight')).toBe('important');
});

it('preserves an atomic class explicitly supplied by a later caller render', () => {
  const host = document.createElement('div');
  host.className = 'first';
  const props = getSurfaceProps();
  const shared = props.className!.split(' ')[0]!;
  const binding = bindSurfaceAppearance(host, props);
  host.className = `second ${shared}`;
  binding.update(props);
  binding.destroy();
  expect(host.className).toBe(`second ${shared}`);
});
