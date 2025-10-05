'use client';

import * as React from 'react';
import SubscriptionStatus from '@/components/billing/subscription-status';

// Mock API hook - replace with real API call later
function useSubscriptionData() {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with real API call
        const mockData = {
          hasSubscription: true,
          plan: {
            name: 'CareGiver OS',
            price: 29,
            description: 'Professional care management for caregivers',
            priceId: 'price_caregiver_os_prod'
          },
          status: 'active',
          nextBillingDate: '2024-02-15',
          billingCycle: 'monthly',
          trialEndsAt: null,
          customerId: 'cus_mock_customer_id'
        };
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load subscription data');
        console.error('Subscription fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}

export default function CurrentSubscription() {
  const { data, isLoading, error } = useSubscriptionData();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Current Subscription</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Manage your CareSupport subscription and billing preferences
        </p>
      </div>

      {error ? (
        <div className='rounded-lg border border-error-base bg-error-lighter p-4'>
          <p className='text-paragraph-sm text-error-base'>
            {error}. Please try refreshing the page.
          </p>
        </div>
      ) : (
        <SubscriptionStatus subscriptionData={data} isLoading={isLoading} />
      )}
    </div>
  );
}
