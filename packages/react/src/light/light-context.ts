import { createContext } from 'react';
import type { Light } from './useLight.js';

export const LightContext = createContext<Light | null>(null);
