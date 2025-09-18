'use client';

import { Provider } from 'jotai';
import { SimplePermissionProvider } from '@/lib/simple-permission-context';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SimplePermissionProvider>
        {children}
      </SimplePermissionProvider>
    </Provider>
  );
};
