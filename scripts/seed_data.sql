-- Demo Seeding Script for OmniChain AI
-- This script populates the database with realistic sample data for demo purposes.

-- 1. Insert Sample Products
INSERT INTO products (name, category, sku, price) VALUES
('Quantum Lens Pro', 'Electronics', 'ELEC-QLP-001', 1299.99),
('Nebula Smartwatch', 'Electronics', 'ELEC-NSW-002', 249.50),
('AeroFlow Mesh Runner', 'Apparel', 'APPS-AMR-003', 85.00),
('Titanium EDC Pen', 'Stationery', 'STAT-TEP-004', 45.00),
('Bio-Organic Fertilizer', 'Home & Garden', 'HG-BOF-005', 29.99),
('Solar Power Bank 20k', 'Electronics', 'ELEC-SPB-006', 59.00),
('Ergo-Chair Graphite', 'Furniture', 'FURN-ECG-007', 350.00),
('Lumina Smart Bulb', 'Home & Garden', 'HG-LSB-008', 19.99),
('Vortex Blender', 'Kitchen', 'KITCH-VB-009', 149.00),
('Alpine Trail Pack', 'Outdoor', 'OUT-ATP-010', 110.00),
('Onyx Wireless Buds', 'Electronics', 'ELEC-OWB-011', 129.00),
('Hydro-Flask 32oz', 'Outdoor', 'OUT-HF-012', 39.95),
('Bamboo Standing Desk', 'Furniture', 'FURN-BSD-013', 499.00),
('Gourmet Coffee Blend', 'Food & Beverage', 'FB-GCB-014', 18.50),
('Silk Sleep Mask', 'Wellness', 'WELL-SSM-015', 25.00)
ON CONFLICT (sku) DO NOTHING;

-- 2. Insert Inventory Data
-- Note: Some items are set below reorder points for optimization demo
INSERT INTO inventory (product_id, stock_level, reorder_point)
SELECT id, 
       CASE 
         WHEN id % 3 = 0 THEN 5  -- Low stock
         ELSE 50 + (id % 100) 
       END as stock,
       CASE 
         WHEN id % 3 = 0 THEN 15 -- High reorder point for bottleneck demo
         ELSE 10 
       END as reorder
FROM products
ON CONFLICT (product_id) DO UPDATE SET 
    stock_level = EXCLUDED.stock_level,
    reorder_point = EXCLUDED.reorder_point,
    last_updated = CURRENT_TIMESTAMP;

-- 3. Insert Historical Sales Data (Last 30 days)
-- We'll generate a few records per product to show trends
INSERT INTO sales (product_id, quantity, amount, sale_date)
SELECT 
    p.id,
    (random() * 5 + 1)::int as qty,
    (random() * 5 + 1)::int * p.price as total,
    CURRENT_DATE - (generate_series(0, 20) || ' days')::interval as s_date
FROM products p
WHERE p.id <= 10; -- Limit to first 10 products for a dense demo set

-- 4. Sample Agent Logs
INSERT INTO agent_logs (agent_name, task_id, query, response, is_verified) VALUES
('Forecasting Agent', 'TASK-001', 'Predict sales for next quarter', 'Sales are expected to grow by 15% due to seasonal trends in Apparel.', TRUE),
('EDA Agent', 'TASK-002', 'Analyze Lumina Smart Bulb anomalies', 'Found 3 outlier sales dates with volume > 500% mean.', TRUE),
('Optimization Agent', 'TASK-003', 'Inventory rebalancing recommendations', 'Move 20 units of Solar Power Bank from Warehouse A to B.', FALSE);
