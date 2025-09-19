import { useEffect, useState } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointKeys = keyof typeof breakpoints;

const useBreakpoint = () => {
  const isBrowser = typeof window !== 'undefined';

  const initialState = isBrowser
    ? Object.keys(breakpoints).reduce(
        (acc, key) => ({
          ...acc,
          [key]: window.innerWidth >= breakpoints[key as BreakpointKeys],
        }),
        {} as Record<BreakpointKeys, boolean>,
      )
    : ({} as Record<BreakpointKeys, boolean>);

  const [currentBreakpoints, setCurrentBreakpoints] = useState(initialState);
  const [prevBreakpoints, setPrevBreakpoints] = useState(initialState);

  useEffect(() => {
    if (!isBrowser) return undefined;

    const handleResize = () => {
      const windowWidth = window.innerWidth;

      const newBreakpoints = Object.keys(breakpoints).reduce(
        (acc, key) => ({
          ...acc,
          [key]: windowWidth >= breakpoints[key as BreakpointKeys],
        }),
        {} as Record<BreakpointKeys, boolean>,
      );

      // Use functional updates to avoid dependency on prevBreakpoints
      setCurrentBreakpoints(prev => {
        // Check if the current breakpoints are different from the previous ones
        if (JSON.stringify(prev) !== JSON.stringify(newBreakpoints)) {
          setPrevBreakpoints(newBreakpoints);
          return newBreakpoints;
        }
        return prev;
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isBrowser]);

  return currentBreakpoints;
};

export default useBreakpoint;
