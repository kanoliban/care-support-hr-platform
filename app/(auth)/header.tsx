'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import * as Button from '@/components/ui/button';

type PathConfig = {
  message: string;
  linkText: string;
  linkHref: string;
};

const pathConfig: Record<string, PathConfig> = {
  '/login': {
    message: "Don't have an account?",
    linkText: 'Register',
    linkHref: '/register',
  },
  '/register': {
    message: 'Already have an account?',
    linkText: 'Login',
    linkHref: '/login',
  },
  '/reset-password': {
    message: 'Changed your mind?',
    linkText: 'Go back',
    linkHref: '/',
  },
};

const defaultConfig: PathConfig = {
  message: 'Changed your mind?',
  linkText: 'Go back',
  linkHref: '/',
};

function DynamicContent({ pathname }: { pathname: string }) {
  const { message, linkText, linkHref } = pathConfig[pathname] || defaultConfig;

  return (
    <>
      <span className='text-right text-paragraph-sm text-text-sub-600'>
        {message}
      </span>
      <Button.Root variant='neutral' mode='stroke' size='xsmall' asChild>
        <Link href={linkHref}>{linkText}</Link>
      </Button.Root>
    </>
  );
}

export default function AuthHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // Dev mode bypass - click logo to go to command center
  const handleLogoClick = (e: React.MouseEvent) => {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      e.preventDefault();
      // Navigate to main page with dev mode parameter
      router.push('/?dev=true');
    }
  };

  return (
    <div className='mx-auto flex w-full items-center justify-between gap-6 pb-3.5 pt-2.5 lg:py-0'>
      <Link 
        href='/' 
        className='shrink-0 flex items-center gap-3'
        onClick={handleLogoClick}
        title={process.env.NODE_ENV === 'development' ? 'Dev Mode: Click to bypass auth' : ''}
      >
        <div className='flex size-10 items-center justify-center rounded-full bg-purple-600'>
          <span className='text-sm font-semibold text-white'>CS</span>
        </div>
        <span className='text-lg font-semibold text-text-strong-950'>
          CareSupport
          {process.env.NODE_ENV === 'development' && (
            <span className='ml-2 text-xs text-purple-600'>[DEV]</span>
          )}
        </span>
      </Link>
      <div className='flex items-center gap-3'>
        <DynamicContent pathname={pathname} />
      </div>
    </div>
  );
}
