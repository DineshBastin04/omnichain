"use client";

import React, { useState } from 'react';
import {
    Search,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Box,
    ShieldCheck,
    BarChart3,
    Truck,
    Package,
    Menu
} from 'lucide-react';
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

const data = [
    { name: 'Jan', sales: 4200, inventory: 2400, forecast: 4000 },
    { name: 'Feb', sales: 3800, inventory: 1398, forecast: 3500 },
    { name: 'Mar', sales: 5200, inventory: 9800, forecast: 4800 },
    { name: 'Apr', sales: 4780, inventory: 3908, forecast: 5000 },
    { name: 'May', sales: 5890, inventory: 4800, forecast: 5500 },
    { name: 'Jun', sales: 6390, inventory: 3800, forecast: 6200 },
    { name: 'Jul', sales: 7100, inventory: 3200, forecast: 6800 },
    { name: 'Aug', sales: 7500, inventory: 2900, forecast: 7200 },
    { name: 'Sep', sales: 6800, inventory: 4500, forecast: 7000 },
];

const suppliers = [
    { name: 'Logistics Pro', score: 98, status: 'Elite', details: '98/100 on-time rate over 500 shipments.' },
    { name: 'Swift Harbor', score: 85, status: 'Good', details: 'Historical 85% reliability based on past 3 months of delivery windows.' },
    { name: 'Global Direct', score: 62, status: 'At Risk', details: 'Delayed 4 out of last 10 shipments, affecting Q3 projections.' },
];

const dashboardStats = {
    sales: { value: '$1.42M', growth: '+15.2%', explanation: 'Comparing current performance against historical seasonal benchmarks (Jan-Jun).' },
    alerts: { value: '08', growth: '4 Critical', explanation: 'Identified by scanning warehouse reorder points against real-time sales velocity.' },
    shipments: { value: '64', growth: 'On Track', explanation: 'Aggregated GPS feeds from all 5 major carriers.' }
};

const logisticsData = [
    { id: 'TR-1241', status: 'In Transit', progress: 20, eta: '2h 15m', destination: 'Warehouse A' },
    { id: 'TR-1242', status: 'In Transit', progress: 40, eta: '1h 05m', destination: 'Distribution Center B' },
    { id: 'TR-1243', status: 'In Transit', progress: 60, eta: '45m', destination: 'Retail Hub C' },
    { id: 'TR-1244', status: 'In Transit', progress: 85, eta: '12m', destination: 'Local Depot D' },
];

const securityLogs = [
    { id: 'SEC-001', event: 'SQL Audit', status: 'Passed', detail: 'No unauthorized access patterns detected in last 24h.' },
    { id: 'SEC-002', event: 'Prompt Guard', status: 'Passed', detail: '3,400 queries sanitized; 0 injection attempts.' },
    { id: 'SEC-003', event: 'Data Leak Check', status: 'Passed', detail: 'PII scrubbing confirmed across all agent outputs.' },
];

interface DashboardProps {
    activeTab: string;
    onToggleSidebar: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, onToggleSidebar }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [showSource, setShowSource] = useState(false);
    const [activeSource, setActiveSource] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuery = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            setIsLoading(true);
            setResponse(null);
            setShowSource(false);
            setActiveSource('');

            // Simulating a robust, data-aware agent response
            setTimeout(() => {
                const lowerQuery = query.toLowerCase();
                let foundResponse = "";
                let sourceCode = "";

                // 0. Security Guardrail: Refuse out-of-scope/irrelevant queries (e.g., coding, non-supply chain)
                const outOfScopeKeywords = ['python', 'javascript', 'code', 'palindrome', 'weather', 'joke', 'story'];
                if (outOfScopeKeywords.some(keyword => lowerQuery.includes(keyword))) {
                    setResponse("I am a specialized OmniChain AI Assistant focused on your supply chain, logistics, and inventory data. I am unable to assist with general coding or non-business queries at this time.");
                    setIsLoading(false);
                    return;
                }

                // 1. Shipment Detection (TR-XXXX)
                const shipmentMatch = lowerQuery.match(/tr-\d{4}/);

                // 2. Month Detection (Jan, Feb, March, etc.)
                const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
                const matchedMonth = months.find(m => lowerQuery.includes(m));

                if (shipmentMatch) {
                    const shipmentId = shipmentMatch[0].toUpperCase();
                    const ship = logisticsData.find(s => s.id === shipmentId);
                    if (ship) {
                        foundResponse = `I found a record for ${shipmentId}. It's currently ${ship.status} towards ${ship.destination} with an ETA of ${ship.eta}. I calculated this by averaging the carrier's last 5 reportings against the road distance.`;
                        sourceCode = `-- LOGISTICS PIPELINE [REAL-TIME]\nSELECT * FROM logistics_live_db WHERE shipment_id = '${shipmentId}';\n\nRESULT:\n| ID | Status | ETA | Loc |\n|---|---|---|---|\n| ${ship.id} | ${ship.status} | ${ship.eta} | ${ship.destination} |`;
                    } else {
                        foundResponse = `I see you're asking about ${shipmentId}, but I don't see that specific ID in our active shipment database. Please check the Logistics tab for valid IDs.`;
                    }
                }

                else if (matchedMonth) {
                    const monthData = data.find(d => d.name.toLowerCase() === matchedMonth);
                    if (monthData) {
                        foundResponse = `In ${monthData.name}, your sales were ${monthData.sales} units with an inventory level of ${monthData.inventory}. My predictive engine shows a forecast of ${monthData.forecast} for the following period based on this historical trend.`;
                        sourceCode = `-- ANALYTICS ENGINE [HISTORICAL]\nSELECT sales, inventory, forecast\nFROM monthly_stats\nWHERE month = '${monthData.name}';\n\nDATA SNAPSHOT:\n{ sales: ${monthData.sales}, inventory: ${monthData.inventory}, forecast: ${monthData.forecast} }`;
                    }
                }

                // 2. Entity Detection: Suppliers
                else if (suppliers.some(s => lowerQuery.includes(s.name.toLowerCase()))) {
                    const s = suppliers.find(s => lowerQuery.includes(s.name.toLowerCase()))!;
                    foundResponse = `Ah, ${s.name}. Their ${s.score}% score is a 'weighted reliability index'. This means I looked at their last 50 deliveries and noticed they are slightly faster than your backup carriers. ${s.details}`;
                    sourceCode = `-- SUPPLIER INTELLIGENCE\nagg_reliability = (delivered_on_time / total_shipments) * weighting_factor;\n\nCALCULATION:\n(${s.score}/100) * 1.0 = ${s.score}% Score.`;
                }

                // 3. Section/Metric Detection
                else if (lowerQuery.includes('shipment') || lowerQuery.includes('logistics')) {
                    foundResponse = `You have ${dashboardStats.shipments.value} active shipments. This 'On Track' status comes from my real-time link with your carrier APIs. None of the current shipments are showing 'Latency Overages' at the moment.`;
                    sourceCode = `-- CARRIER AGGREGATOR\nSELECT COUNT(*) FROM shipments WHERE status = 'transit';\n\nACTIVE_COUNT: 64`;
                } else if (lowerQuery.includes('sales')) {
                    foundResponse = `Current sales stand at ${dashboardStats.sales.value}. ${dashboardStats.sales.explanation} In simple terms: you are selling 15% more than you usually do this time of year!`;
                    sourceCode = `-- REVENUE PIPELINE\nSELECT SUM(price * qty) as total_sales FROM orders WHERE date >= '2026-01-01';\n\nTOTAL_SALES: $1.42M`;
                } else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
                    foundResponse = `We have ${dashboardStats.alerts.value} inventory alerts. I flagged these because your 'Stock Depletion Speed' is faster than your 'Restock Lead Time'. I recommend checking the Inventory tab.`;
                    sourceCode = `-- INVENTORY GUARDRAIL\nSELECT sku_id FROM warehouse_stock WHERE qoh < reorder_point;\n\nALERTS_FOUND: 8`;
                } else if (lowerQuery.includes('security') || lowerQuery.includes('audit') || lowerQuery.includes('verification') || lowerQuery.includes('guardrail')) {
                    foundResponse = `All security protocols are in 'Safe Harbor' mode. My audit logs show that your Verification Audits (SQL Audit, Prompt Guard, and Data Leak Check) have all passed without fail in the last 24 hours.`;
                    sourceCode = `-- SECURITY AUDIT [IMMUTABLE LOGS]\nSELECT status, check_type FROM security_logs WHERE timestamp > now() - interval '24 hours';\n\nRESULTS:\n- SQL Audit: PASSED\n- Prompt Guard: PASSED\n- Data Leak: PASSED`;
                } else if (lowerQuery.includes('price') || lowerQuery.includes('news') || lowerQuery.includes('market') || lowerQuery.includes('silver')) {
                    foundResponse = `Regarding the news on commodity prices (like Silver), my current data source is focused on your internal supply chain. However, I can confirm that your 'Silver-based Components' in inventory are stable, and no cost-spikes have hit your procurement log yet. Would you like to connect a Bloomberg/Reuters feed?`;
                    sourceCode = `-- MARKET ADAPTER [EXTERNAL API MOCK]\nGET https://api.commodities.com/v1/latest?symbols=SILVER\nRESULT: No external connection established. Checking internal procurement buffer...\nSELECT cost_per_unit FROM procurement_history WHERE component LIKE '%SILVER%';\n\nINTERNAL_AVG_COST: $23.40 (Stable)`;
                }

                // 4. Fallback with Common Sense
                else {
                    foundResponse = "I've analyzed your real-time supply chain. Everything looks 'Stable'. By comparing your 64 active shipments with your $1.42M sales, I see a healthy flow. Would you like to check the 'Logistics' or 'Inventory' details?";
                    sourceCode = `-- HEURISTIC AGGREGATOR\nIF (shipments_on_track > 0.9) AND (sales_growth > 0.1) RETURN 'Stable';`;
                }

                setResponse(foundResponse);
                setActiveSource(sourceCode);
                setIsLoading(false);
            }, 1200);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'analytics':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card">
                                <h3 className="text-lg font-semibold text-white mb-6">Predictive Demand Forecast</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                            <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
                                            <YAxis stroke="#64748B" axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }} />
                                            <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                                            <Area type="monotone" dataKey="forecast" stroke="#10B981" strokeDasharray="5 5" fill="transparent" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="mt-4 text-sm text-slate-400">The dashed green line represents AI-predicted demand for the next cycle.</p>
                            </div>
                            <div className="glass-card">
                                <h3 className="text-lg font-semibold text-white mb-6">Supplier Reliability Index</h3>
                                <div className="space-y-6">
                                    {suppliers.map((sup, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-white font-medium">{sup.name}</span>
                                                <span className={sup.score > 80 ? "text-green-400" : "text-amber-400"}>{sup.score}%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${sup.score > 80 ? 'bg-green-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${sup.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'logistics':
                return (
                    <div className="glass-card flex flex-col items-center justify-center min-h-[400px]">
                        <Truck size={64} className="text-purple-400 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2 text-center">Global Logistics Network</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                            {logisticsData.map((ship, i) => (
                                <div key={i} className="p-4 bg-white/5 border border-glass-border rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white font-medium">Shipment #{ship.id}</span>
                                        <span className="text-blue-400 text-xs font-bold uppercase">{ship.status}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mb-2">{ship.destination} • ETA: {ship.eta}</div>
                                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{ width: `${ship.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'inventory':
                return (
                    <div className="glass-card flex flex-col items-center justify-center min-h-[400px]">
                        <Package size={64} className="text-green-400 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Smart Inventory Management</h2>
                        <p className="text-slate-400 mb-8 text-center">Stock optimization across 14 warehouses</p>
                        <div className="w-full h-64 bg-white/5 rounded-xl border border-glass-border flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748B" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="inventory" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <div className="glass-card bg-red-500/5 border-red-500/20">
                            <div className="flex items-center space-x-4 mb-4">
                                <ShieldCheck className="text-red-400" size={32} />
                                <h2 className="text-xl md:text-2xl font-bold text-white">AI Security Guardrails</h2>
                            </div>
                            <p className="text-slate-300 text-sm md:text-base">Active monitoring: Prompt Injection, SQL Injection, Data Leaks.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card">
                                <h3 className="text-lg font-bold text-white mb-4">Verification Audits</h3>
                                <div className="space-y-4">
                                    {securityLogs.map((log, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">{log.event} Integrity</span>
                                            <span className="text-green-400 font-mono">{log.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <>
                        {/* Stats Grid */}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Total Sales', value: '$1.42M', growth: '+15.2%', icon: <TrendingUp className="text-green-400" /> },
                                { label: 'Stock Alerts', value: '08', growth: '4 Critical', icon: <AlertTriangle className="text-amber-400" /> },
                                { label: 'Active Shipments', value: '64', growth: 'On Track', icon: <Box className="text-blue-400" /> },
                            ].map((stat, i) => (
                                <div key={i} className="glass-card animate-glow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-slate-400 font-medium">{stat.label}</span>
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <span className="text-xs md:text-sm text-slate-500">{stat.growth} from last month</span>
                                </div>
                            ))}
                        </div>

                        {/* Main Charts */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                            <div className="glass-card">
                                <h3 className="text-lg font-semibold text-white mb-6">Sales Performance</h3>
                                <div className="h-64 md:h-80">
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
                                <div className="h-64 md:h-80">
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
                                    { agent: 'EDA Agent', action: 'Anomaly detected in supplier latency (Carrier #34)', time: '2 mins ago', status: 'verified' },
                                    { agent: 'Forecasting Agent', action: 'Demand spike predicted for Q3 electronics', time: '15 mins ago', status: 'verified' },
                                    { agent: 'Security Agent', action: 'System-wide guardrail audit complete', time: '1 hour ago', status: 'verified' },
                                ].map((log, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border space-y-3 sm:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm md:text-base">{log.action}</div>
                                                <div className="text-xs md:text-sm text-slate-500">{log.agent} • {log.time}</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider border border-green-500/20">
                                            {log.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <main className="lg:ml-64 p-4 md:p-8 flex-1 overflow-y-auto">
            {/* Header Area */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            OmniChain AI <span className="text-blue-400">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                        </h2>
                        <p className="text-sm md:text-base text-slate-400">Real-time insights and agentic optimizations</p>
                    </div>
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 text-slate-400 hover:text-white glass rounded-xl"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        className="w-full bg-white/5 border border-glass-border rounded-2xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleQuery}
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={18} />
                </div>
            </header>

            {(isLoading || response) && (
                <div className="glass-card mb-8 border-blue-500/30 bg-blue-500/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center space-x-3 mb-4">
                        <Sparkles className="text-blue-400" size={20} />
                        <h3 className="text-white font-semibold">AI Assistant Response</h3>
                    </div>
                    {isLoading ? (
                        <div className="flex items-center space-x-2 text-slate-400 italic text-sm">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                            <span>Consulting multi-agent orchestrator...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-slate-200 text-sm md:text-base leading-relaxed">
                                {response}
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <button
                                    onClick={() => setShowSource(!showSource)}
                                    className="text-[10px] md:text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
                                >
                                    <span>{showSource ? 'Hide Source Data' : 'Verify Live Data Source'}</span>
                                </button>

                                {showSource && (
                                    <div className="mt-4 p-4 bg-black/40 rounded-xl font-mono text-[10px] md:text-xs text-green-400 border border-green-500/20 max-h-48 overflow-y-auto w-full">
                                        <div className="mb-2 text-slate-500 italic pb-2 border-b border-green-500/10">Connected via: OmniChain Orchestrator [{new Date().toLocaleTimeString()}]</div>
                                        <pre className="whitespace-pre-wrap">
                                            {activeSource}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {renderContent()}
        </main>
    );
};

export default Dashboard;
