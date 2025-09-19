'use client';

import { Provider } from 'jotai';
import { SimplePermissionProvider } from '@/lib/simple-permission-context';
import { CareTeamProvider } from '@/lib/careTeamContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SimplePermissionProvider>
        <CareTeamProvider>
          {children}
        </CareTeamProvider>
      </SimplePermissionProvider>
    </Provider>
  );
};
