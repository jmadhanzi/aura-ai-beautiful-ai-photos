import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useInViewAnimation(options?: { once?: boolean; margin?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: options?.margin ?? '-50px',
  });
  return { ref, isInView };
}
