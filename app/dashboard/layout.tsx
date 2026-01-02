import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#030014]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto relative z-10">
                {children}
            </main>
        </div>
    );
}
