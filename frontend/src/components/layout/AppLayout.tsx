import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-bg-subtle">
      <Sidebar />
      <main className="lg:pl-64">{children}</main>
    </div>
  );
};
