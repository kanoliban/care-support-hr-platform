export default function CareSupportOnboardingFooter() {
  return (
    <div className='border-t border-stroke-soft-200 bg-bg-white-0 px-6 py-4 lg:px-5'>
      <div className='mx-auto flex w-full max-w-[1392px] flex-col items-center justify-between gap-4 lg:flex-row'>
        <div className='text-center lg:text-left'>
          <div className='text-paragraph-sm text-text-sub-600'>
            © 2024 CareSupport. All rights reserved.
          </div>
          <div className='text-paragraph-xs text-text-sub-500'>
            HIPAA compliant • SOC 2 certified • Enterprise security
          </div>
        </div>
        
        <div className='flex items-center gap-6 text-paragraph-xs text-text-sub-500'>
          <a href='/privacy' className='hover:text-text-sub-700'>
            Privacy Policy
          </a>
          <a href='/terms' className='hover:text-text-sub-700'>
            Terms of Service
          </a>
          <a href='/security' className='hover:text-text-sub-700'>
            Security
          </a>
          <a href='/support' className='hover:text-text-sub-700'>
            Support
          </a>
        </div>
      </div>
    </div>
  );
}
