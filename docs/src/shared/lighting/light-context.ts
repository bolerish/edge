import { createContext } from 'react';
import type { Light } from '@bolerish/edge';

export const SurfaceLightContext = createContext<Light | null>(null);
