import Link, { LinkProps } from 'next/link';
import React, { forwardRef } from 'react';

type SafeLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
};

/**
 * SafeLink es un componente que envuelve el componente Link de Next.js
 * y deshabilita el prefetching por defecto para evitar errores de 'Fetch failed loading'
 * en producción.
 */
export const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(
  ({ children, prefetch = false, ...props }, ref) => {
    return (
      <Link prefetch={prefetch} {...props} ref={ref}>
        {children}
      </Link>
    );
  }
);

SafeLink.displayName = 'SafeLink';