import { DashboardShell } from '@/components/seller/dashboard/DashboardShell';
import { SellerSidebar } from '@/components/seller/dashboard/SellerSidebar';
import { SellerTopbar } from '@/components/seller/dashboard/SellerTopbar';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <SellerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative z-10 w-full">
        <SellerTopbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          <div className="mx-auto p-4 md:p-6 lg:p-8 max-w-[1500px] w-full">
            {children}
          </div>
        </main>
      </div>
    </DashboardShell>
  );
}