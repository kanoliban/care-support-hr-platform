'use client';

import PricingPlansGrid from '@/components/widgets/pricing-plans-grid';

export default function CurrentSubscription() {
  return (
    <div className='flex w-full flex-col gap-6'>
      <div>
        <div className='text-label-md'>Subscription Plans</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Choose the perfect plan for your care coordination needs
        </p>
      </div>

      <PricingPlansGrid />
    </div>
  );
}
