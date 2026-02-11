from typing import Dict, Any, Optional
from agents.base import BaseAgent, AgentResponse
from ml.forecasting import DemandForecaster
import pandas as pd

class ForecastingAgent(BaseAgent):
    """
    Agent responsible for demand planning and sales forecasting.
    """
    
    def __init__(self):
        super().__init__(name="Forecasting Agent", role="Supply Chain Planner")

    async def execute(self, task: str, context: Optional[Dict[str, Any]] = None) -> AgentResponse:
        history = context.get("history") if context else None
        
        if history is None or not isinstance(history, pd.DataFrame):
            return AgentResponse(
                agent_name=self.name,
                content="Historical data not found for forecasting.",
                confidence_score=0.0
            )

        results = DemandForecaster.predict_sales(history)
        
        if "error" in results:
            return AgentResponse(
                agent_name=self.name,
                content=f"Forecasting failed: {results['error']}",
                confidence_score=0.0
            )

        summary_text = (
            f"I have projected your future requirements based on a seasonal trend analysis of your sales history. "
            f"My algorithms detected a clear '{results['trend']}' trend. While your previous average was {results['historical_mean']:.2f} units, "
            f"I expect this to shift to {results['predicted_mean']:.2f} in the next period. "
            "This result was calculated by weighting recent performance more heavily to account for current market volatility."
        )

        return AgentResponse(
            agent_name=self.name,
            content=summary_text,
            metadata=results,
            confidence_score=0.9
        )
