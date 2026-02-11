import pandas as pd
import numpy as np
from typing import Dict, Any

class DemandForecaster:
    """
    ML module for demand and sales forecasting.
    Includes simple time-series forecasting (Linear Regression/Moving Average).
    """

    @classmethod
    def predict_sales(cls, history: pd.DataFrame, periods: int = 12) -> Dict[str, Any]:
        """
        Predicts future sales based on historical data.
        """
        if history.empty or 'sales' not in history.columns:
            return {"error": "Insufficient data"}

        # Simplified forecasting logic (Linear Trend)
        y = history['sales'].values
        x = np.arange(len(y)).reshape(-1, 1)
        
        # Simple Linear Fit
        slope, intercept = np.polyfit(x.flatten(), y, 1)
        
        future_x = np.arange(len(y), len(y) + periods)
        predictions = slope * future_x + intercept
        
        return {
            "historical_mean": y.mean(),
            "predicted_mean": predictions.mean(),
            "trend": "upward" if slope > 0 else "downward",
            "forecast_values": predictions.tolist()
        }

    @classmethod
    def detect_stockouts(cls, inventory: pd.DataFrame, forecast: list) -> List[int]:
        """Detects potential stockouts based on forecast."""
        # Mock logic
        return [i for i, v in enumerate(inventory.get('stock', [])) if v < 10]
