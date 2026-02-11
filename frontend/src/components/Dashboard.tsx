"use client";

import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { Search, Sparkles, TrendingUp, AlertTriangle, Box, ShieldCheck } from 'lucide-react';

const data = [
    { name: 'Jan', sales: 4000, inventory: 2400 },
    { name: 'Feb', sales: 3000, inventory: 1398 },
    { name: 'Mar', sales: 2000, inventory: 9800 },
    { name: 'Apr', sales: 2780, inventory: 3908 },
    { name: 'May', sales: 1890, inventory: 4800 },
    { name: 'Jun', sales: 2390, inventory: 3800 },
];

const Dashboard = () => {
    const [query, setQuery] = useState('');

    return (
        <main className="ml-64 p-8 flex-1 overflow-y-auto">
            {/* Header Area */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">OmniChain AI Operations</h2>
                    <p className="text-slate-400">Real-time insights and agentic optimizations</p>
                </div>

                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Ask anything (e.g., 'Forecast sales for Q3')"
                        className="w-full bg-white/5 border border-glass-border rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={18} />
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Total Sales', value: '$1.2M', growth: '+12.5%', icon: <TrendingUp className="text-green-400" /> },
                    { label: 'Stock Alerts', value: '14', growth: 'Low Priority', icon: <AlertTriangle className="text-amber-400" /> },
                    { label: 'Active Shipments', value: '42', growth: 'On Track', icon: <Box className="text-blue-400" /> },
                ].map((stat, i) => (
                    <div key={i} className="glass-card animate-glow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-slate-400 font-medium">{stat.label}</span>
                            {stat.icon}
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <span className="text-sm text-slate-500">{stat.growth} from last month</span>
                    </div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <div className="glass-card">
                    <h3 className="text-lg font-semibold text-white mb-6">Sales Performance</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748B" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="text-lg font-semibold text-white mb-6">Inventory Levels</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748B" axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                                />
                                <Bar dataKey="inventory" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Agent Activity Section */}
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-white mb-4">Agent Verification Logs</h3>
                <div className="space-y-4">
                    {[
                        { agent: 'EDA Agent', action: 'Anomaly detected in supplier latency', time: '2 mins ago', status: 'verified' },
                        { agent: 'Forecasting Agent', action: 'Demand spike predicted for Q3 electronics', time: '15 mins ago', status: 'verified' },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="text-white font-medium">{log.action}</div>
                                    <div className="text-sm text-slate-500">{log.agent} • {log.time}</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider border border-green-500/20">
                                {log.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
