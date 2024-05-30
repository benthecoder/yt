import { Nav } from '@/components/nav';
import { Toaster } from '@/components/ui/toaster';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Nav>
      {children}
      <Toaster />
    </Nav>
  );
};

export default MainLayout;
