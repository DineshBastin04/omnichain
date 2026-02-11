# OmniChain AI Platform

OmniChain AI is a production-ready AI-powered platform for e-commerce and supply chain analytics, featuring multi-agent systems, real-time insights, and secure-by-design architecture.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker & Docker Compose
- OpenAI API Key (or equivalent for agents)

### Installation
1. Clone the repository
2. Run the setup script:
   ```bash
   make install
   ```
3. Configure your environment:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```
4. Start the platform:
   ```bash
   make up
   ```
5. Initialize the database:
   ```bash
   # If using Docker, run inside the container:
   docker exec -i <db_container_id> psql -U admin -d supply_chain < scripts/init_db.sql
   ```

## 🏗️ Architecture
- **Frontend**: Next.js, Tailwind CSS, Recharts
- **Backend**: FastAPI, LangGraph, DuckDB, PostgreSQL
- **Security**: OAuth2/JWT, RBAC, AI Guardrails

## 🤖 Agent System
The platform utilizes a multi-agent orchestration layer:
- **EDA Agent**: Automated data profiling and anomaly detection using DuckDB.
- **Forecasting Agent**: Demand and sales prediction models.
- **Optimization Agent**: Inventory and pricing recommendations.
- **Verification Agent**: Security and hallucination checks.


## 🔐 Security & Compliance
- Enterprise-grade Authentication (OAuth2/JWT)
- Role-Based Access Control (RBAC)
- Data encryption at rest and in transit
- AI Firewalls to prevent prompt injection and model misuse

## 📜 License
Internal Enterprise License
