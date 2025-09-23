import { LanguageSelect } from '@/components/language-select';

export default function AuthFooter() {
  return (
    <div className='-mx-2 mt-auto flex items-center justify-between gap-4 pb-4 lg:mx-0 lg:pb-0'>
      <div className='flex flex-col gap-1'>
        <div className='text-paragraph-sm text-text-sub-600'>
          © 2024 CareSupport
        </div>
        <div className='text-paragraph-xs text-text-sub-500'>
          HIPAA compliant • SOC 2 certified • Enterprise security
        </div>
      </div>

      <LanguageSelect />
    </div>
  );
}
