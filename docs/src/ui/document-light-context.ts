import { createContext } from 'react';
import type { Light } from '@bolerish/edge';

export const DocumentLightContext = createContext<Light | null>(null);
