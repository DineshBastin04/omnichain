import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content Area */}
      <Dashboard />
    </div>
  );
}
