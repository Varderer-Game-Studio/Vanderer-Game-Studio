import { useEffect, useState } from 'react';

/** True when the user requests reduced motion OR the device is low-power (coarse pointer + low cores). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 && window.matchMedia('(pointer: coarse)').matches;
    const update = () => setReduced(mq.matches || lowPower);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}
