'use client';

import { RiHeartLine } from '@remixicon/react';

import ButtonSignin from '@/components/saas/ButtonSignin';
import { cn } from '@/utils/cn';

export default function PageLogin() {
  return (
    <>
      <div className='flex flex-col items-center gap-2'>
        {/* icon */}
        <div
          className={cn(
            'relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24',
            // bg
            'before:absolute before:inset-0 before:rounded-full',
            'before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10',
            // stroke
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-gradient-to-b after:from-neutral-500 after:to-transparent after:opacity-[.16]',
            'after:mask-exclude after:p-px',
          )}
        >
          <div className='relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 lg:size-16'>
            <RiHeartLine className='size-6 text-purple-600 lg:size-8' />
          </div>
        </div>

        <div className='space-y-1 text-center'>
          <div className='text-title-h6 lg:text-title-h5'>
            Welcome back to CareSupport
          </div>
          <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
            Sign in to continue coordinating care for your loved ones.
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center gap-4'>
        <ButtonSignin
          text='Sign in with Google'
          extraStyle='btn-primary w-full justify-center'
        />
        <p className='text-sm text-text-sub-600'>
          Sign in securely with your CareSupport Google account.
        </p>
      </div>
    </>
  );
}
