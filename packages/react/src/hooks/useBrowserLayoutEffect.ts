import { useEffect, useLayoutEffect } from 'react';

/** Layout timing in the browser without React 18 server-render warnings. */
export const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
