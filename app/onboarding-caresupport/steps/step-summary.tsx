'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import Link from 'next/link';

import * as Button from '@/components/ui/button';

import { 
  activeStepAtom, 
  prevStepAtom,
  onboardingDataAtom 
} from './store';

export default function OnboardingStepSummary() {
  const [activeStep] = useAtom(activeStepAtom);
  const [, prevStep] = useAtom(prevStepAtom);
  const [onboardingData] = useAtom(onboardingDataAtom);

  return (
    <div className='mx-auto w-full max-w-4xl'>
      <div className='mb-8 text-center'>
        <h1 className='text-title-h4 lg:text-title-h3 mb-2'>
          Review Your Care Setup
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          Review all the information you've provided and complete your CareSupport setup.
        </p>
      </div>

      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 lg:p-8 shadow-regular-xs'>
        <div className='space-y-6'>
          {/* Account Information */}
          <div className='border-b border-stroke-soft-200 pb-6'>
            <h3 className='text-title-h6 mb-4'>Account Information</h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <span className='text-paragraph-sm font-medium text-text-sub-600'>Account Type:</span>
                <p className='text-paragraph-md'>{onboardingData.accountType}</p>
              </div>
              <div>
                <span className='text-paragraph-sm font-medium text-text-sub-600'>Timezone:</span>
                <p className='text-paragraph-md'>{onboardingData.timeZone}</p>
              </div>
              {onboardingData.organizationName && (
                <div className='md:col-span-2'>
                  <span className='text-paragraph-sm font-medium text-text-sub-600'>Organization:</span>
                  <p className='text-paragraph-md'>{onboardingData.organizationName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Care Recipient */}
          <div className='border-b border-stroke-soft-200 pb-6'>
            <h3 className='text-title-h6 mb-4'>Care Recipient</h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <span className='text-paragraph-sm font-medium text-text-sub-600'>Name:</span>
                <p className='text-paragraph-md'>{onboardingData.careRecipient.name}</p>
              </div>
              <div>
                <span className='text-paragraph-sm font-medium text-text-sub-600'>Date of Birth:</span>
                <p className='text-paragraph-md'>{onboardingData.careRecipient.dateOfBirth}</p>
              </div>
              <div className='md:col-span-2'>
                <span className='text-paragraph-sm font-medium text-text-sub-600'>Emergency Contacts:</span>
                <p className='text-paragraph-md'>{onboardingData.careRecipient.emergencyContacts.length} contact(s) added</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className='bg-bg-soft-50 rounded-lg p-6'>
            <h3 className='text-title-h6 mb-4'>Setup Summary</h3>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='text-center'>
                <div className='text-title-h4 text-purple-600 font-semibold'>
                  {onboardingData.careRecipient.emergencyContacts.length}
                </div>
                <div className='text-paragraph-sm text-text-sub-600'>Emergency Contacts</div>
              </div>
              <div className='text-center'>
                <div className='text-title-h4 text-purple-600 font-semibold'>
                  {onboardingData.careRecipient.medicalConditions.length}
                </div>
                <div className='text-paragraph-sm text-text-sub-600'>Medical Conditions</div>
              </div>
              <div className='text-center'>
                <div className='text-title-h4 text-purple-600 font-semibold'>
                  {onboardingData.careRecipient.medications.length}
                </div>
                <div className='text-paragraph-sm text-text-sub-600'>Current Medications</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className='mt-8 flex justify-between'>
          <Button.Root 
            variant='neutral' 
            mode='ghost'
            onClick={prevStep}
          >
            ← Back
          </Button.Root>
          <Button.Root 
            variant='primary' 
            size='medium'
            asChild
          >
            <Link href='/calendar'>
              Complete Setup & Start Coordinating
            </Link>
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
