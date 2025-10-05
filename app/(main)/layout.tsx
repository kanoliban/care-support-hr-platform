import { redirect } from 'next/navigation';

import { SearchMenu } from '@/components/search';
import { CareSupportProvider } from '@/lib/careContext';
import saasConfig from '@/lib/saas/saas-config';
import { getServerSession, authOptions } from '@/lib/saas/next-auth';

import HeaderMobile from './header-mobile';
import Sidebar from './sidebar';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // In development mode, allow bypassing auth for dev testing
  if (!session && process.env.NODE_ENV !== 'development') {
    const callbackUrl = encodeURIComponent(saasConfig.auth.callbackUrl || '/');
    redirect(`${saasConfig.auth.loginUrl}?callbackUrl=${callbackUrl}`);
  }

  return (
    <CareSupportProvider>
      {/* Clean iPod-inspired off-white gradient background */}
      <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50/50 to-stone-100/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800'>
        <div className='grid min-h-screen grid-cols-1 content-start items-start lg:grid-cols-[auto,minmax(0,1fr)]'>
          <Sidebar />
          <HeaderMobile />
          <div className='mx-auto flex w-full max-w-[1360px] flex-1 flex-col'>
            {children}
          </div>
        </div>
      </div>

      <SearchMenu />
    </CareSupportProvider>
  );
}
