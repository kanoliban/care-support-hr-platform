'use client';

import WidgetSubscription from '@/components/widgets/widget-subscription';

export default function CurrentSubscription() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Current Subscription</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Manage your CareSupport subscription and billing preferences
        </p>
      </div>

      <WidgetSubscription />
    </div>
  );
}
