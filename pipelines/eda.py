import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, List

class AutomatedEDA:
    """
    Module for automated Exploratory Data Analysis.
    Performs profiling, anomaly detection, and correlation analysis.
    """
    
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def get_summary_statistics(self) -> pd.DataFrame:
        """Returns standard descriptive statistics."""
        return self.df.describe(include='all')

    def analyze_missing_values(self) -> Dict[str, Any]:
        """Returns missing value counts and percentages."""
        missing_count = self.df.isnull().sum()
        missing_percent = (missing_count / len(self.df)) * 100
        return {
            "counts": missing_count.to_dict(),
            "percentages": missing_percent.to_dict()
        }

    def detect_outliers(self, column: str) -> pd.Series:
        """Detects outliers using the IQR method."""
        if not np.issubdtype(self.df[column].dtype, np.number):
            return pd.Series([], dtype=bool)
        
        Q1 = self.df[column].quantile(0.25)
        Q3 = self.df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        return (self.df[column] < lower_bound) | (self.df[column] > upper_bound)

    def correlation_analysis(self) -> pd.DataFrame:
        """Returns the correlation matrix for numerical columns."""
        return self.df.corr(numeric_only=True)

    def detect_anomalies(self) -> Dict[str, List[int]]:
        """
        Simple anomaly detection based on Z-score.
        Returns indices of anomalous rows.
        """
        anomalies = {}
        for col in self.df.select_dtypes(include=[np.number]).columns:
            z_scores = (self.df[col] - self.df[col].mean()) / self.df[col].std()
            anomalies[col] = self.df.index[np.abs(z_scores) > 3].tolist()
        return anomalies

    def run_full_profile(self) -> Dict[str, Any]:
        """Runs a complete EDA cycle and returns a report."""
        return {
            "summary": self.get_summary_statistics().to_dict(),
            "missing_values": self.analyze_missing_values(),
            "correlation": self.correlation_analysis().to_dict(),
            "anomalies": self.detect_anomalies()
        }
