import { Nav } from '@/components/nav';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Nav>{children}</Nav>;
};

export default MainLayout;
