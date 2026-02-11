from typing import Dict, Any, Optional
from agents.base import BaseAgent, AgentResponse
from pipelines.eda import AutomatedEDA
import pandas as pd

class EDAAgent(BaseAgent):
    """
    Agent responsible for data profiling, anomaly detection, and insights.
    """
    
    def __init__(self):
        super().__init__(name="EDA Agent", role="Data Analyst")

    async def execute(self, task: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        # In a real scenario, this would determine which dataset to load
        # For demo, we use a sample or the one provided in context
        df = context.get("dataframe") if context else None
        
        if df is None:
            return AgentResponse(
                agent_name=self.name,
                content="No dataset provided for analysis.",
                confidence_score=0.0
            )

        eda_engine = AutomatedEDA(df)
        report = eda_engine.run_full_profile()
        
        summary_text = (
            f"Analysis complete for dataset with {len(df)} rows. "
            f"Found {len(report['anomalies'])} potential anomalies. "
            "Summary statistics generated."
        )

        return AgentResponse(
            agent_name=self.name,
            content=summary_text,
            metadata=report,
            confidence_score=0.95
        )
