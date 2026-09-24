import { Suspense } from 'react';

export function withSuspense(Component, props = {}) {
  return (
    <Suspense fallback={<div aria-busy="true" />}>
      <Component {...props} />
    </Suspense>
  );
}
