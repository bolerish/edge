import { createContext } from 'react';
import type { Light } from '../hooks/useLight.js';

export const LightContext = createContext<Light | null>(null);
