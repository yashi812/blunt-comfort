import { useEffect, useRef } from 'react';

const useAutoTypeDemo = (setSearchQuery, active) => {
  const words = ['void', 'oversized', 'black', 'rust', 'washed', 'graphic', 'blank', 'dusk'];
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const directionRef = useRef(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!active) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const demo = () => {
      const word = words[indexRef.current];
      
      if (directionRef.current === 1) {
        charRef.current++;
        if (charRef.current > word.length) {
          directionRef.current = -1;
          timeoutRef.current = setTimeout(demo, 1500);
          return;
        }
      } else {
        charRef.current--;
        if (charRef.current < 0) {
          indexRef.current = (indexRef.current + 1) % words.length;
          charRef.current = 0;
          directionRef.current = 1;
          timeoutRef.current = setTimeout(demo, 400);
          return;
        }
      }

      const val = word.slice(0, charRef.current);
      setSearchQuery(val);
      timeoutRef.current = setTimeout(demo, directionRef.current === 1 ? 115 : 55);
    };

    // Initial delay
    timeoutRef.current = setTimeout(demo, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, setSearchQuery]);
};

export default useAutoTypeDemo;
