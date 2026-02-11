"use client";

import React from 'react';
import {
    LayoutDashboard,
    BarChart3,
    Truck,
    Package,
    Settings,
    ShieldCheck,
    LogOut
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', id: 'overview' },
        { icon: <BarChart3 size={20} />, label: 'Analytics', id: 'analytics' },
        { icon: <Truck size={20} />, label: 'Logistics', id: 'logistics' },
        { icon: <Package size={20} />, label: 'Inventory', id: 'inventory' },
        { icon: <ShieldCheck size={20} />, label: 'Security', id: 'security' },
    ];

    return (
        <aside className="w-64 h-screen glass border-r border-glass-border flex flex-col fixed left-0 top-0">
            <div className="p-8 flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                    <img src="/logo.png" alt="OmniChain AI Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    OmniChain AI
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-glass-border">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

