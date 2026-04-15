import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useInViewAnimation(options?: { once?: boolean; margin?: `${number}px` }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: options?.margin ?? '-50px' as `${number}px`,
  });
  return { ref, isInView };
}
