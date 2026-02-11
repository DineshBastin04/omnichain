"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden text-slate-100 font-sans">
      {/* Sidebar - Fixed */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <Dashboard activeTab={activeTab} />
    </div>
  );
}

