import LandingNavbar from '@/components/landing/navbar';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LandingNavbar />
      <main className="h-full flex items-center justify-center pt-20">
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
