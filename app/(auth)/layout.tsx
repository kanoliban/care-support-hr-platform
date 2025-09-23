import dynamic from 'next/dynamic';

import AuthFooter from './footer';
import AuthHeader from './header';

const DynamicAuthCarousel = dynamic(() => import('./auth-slider'), {
  ssr: false,
});

const slides = [
  {
    image: {
      default: '/images/auth-slide-img-1.png',
      dark: '/images/auth-slide-img-1-dark.png',
    },
    title: 'Coordinate Care Seamlessly',
    description:
      'Manage your loved one\'s care schedule with ease, ensuring continuous coverage and peace of mind.',
  },
  {
    image: {
      default: '/images/auth-slide-img-2.png',
      dark: '/images/auth-slide-img-2-dark.png',
    },
    title: 'Connect Your Care Team',
    description:
      'Bring together family, caregivers, and healthcare providers in one secure platform.',
  },
  {
    image: {
      default: '/images/auth-slide-img-3.png',
      dark: '/images/auth-slide-img-3-dark.png',
    },
    title: 'Stay Informed & Secure',
    description:
      'Get real-time updates and maintain HIPAA-compliant communication with your entire care network.',
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='grid min-h-screen lg:grid-cols-[minmax(0,608fr),minmax(0,832fr)] xl:grid-cols-[608px,minmax(0,1fr)] min-[1440px]:grid-cols-[minmax(0,608fr),minmax(0,832fr)]'>
      <div className='flex h-full flex-col px-6 lg:px-11 lg:py-6'>
        <AuthHeader />
        <div className='flex flex-1 flex-col py-6 lg:py-24 [@media_(min-height:901px)]:justify-center'>
          <div className='mx-auto flex w-full max-w-[392px] flex-col gap-6 md:translate-x-1.5'>
            {children}
          </div>
        </div>
        <AuthFooter />
      </div>
      <div className='hidden p-2 pl-0 lg:block'>
        <div className='relative size-full rounded-2xl bg-bg-weak-50'>
          <DynamicAuthCarousel slides={slides} />
        </div>
      </div>
    </div>
  );
}
