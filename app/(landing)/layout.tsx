import LandingNavbar from '@/components/landing/navbar';
import { LandingFooter } from '@/components/landing/footer';
import LandingNavbarMobile from '@/components/landing/navbar-mobile';

const LandingLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <LandingNavbar />
      <LandingNavbarMobile />
      {children}
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
