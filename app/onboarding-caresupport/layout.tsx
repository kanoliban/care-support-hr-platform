import CareSupportOnboardingFooter from './components/onboarding-footer';

export default function CareSupportOnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col bg-bg-soft-50'>
      <div className='relative isolate mx-auto flex w-full max-w-[1392px] flex-1 flex-col'>
        <div className='w-full px-6 lg:px-5'>{children}</div>
        <CareSupportOnboardingFooter />
      </div>
    </div>
  );
}
