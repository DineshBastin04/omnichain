import pandas as pd
from sqlalchemy.orm import Session
from backend.core.db import engine, get_duckdb_conn
from typing import Optional

class ETLPipeline:
    """
    Handles data ingestion from external sources into PostgreSQL and DuckDB.
    """
    
    def __init__(self, db_session: Optional[Session] = None):
        self.db = db_session
        self.duck_conn = get_duckdb_conn()

    def ingest_csv(self, file_path: str, table_name: str, target: str = "both"):
        """
        Ingests a CSV file into PostgreSQL and/or DuckDB.
        """
        df = pd.read_csv(file_path)
        
        if target in ["postgres", "both"]:
            df.to_sql(table_name, con=engine, if_exists='append', index=False)
        
        if target in ["duckdb", "both"]:
            # DuckDB can query dataframes directly
            self.duck_conn.execute(f"CREATE TABLE {table_name} AS SELECT * FROM df")

    def ingest_dataframe(self, df: pd.DataFrame, table_name: str, target: str = "both"):
        """
        Ingests a DataFrame directly.
        """
        if target in ["postgres", "both"]:
            df.to_sql(table_name, con=engine, if_exists='append', index=False)
        
        if target in ["duckdb", "both"]:
            self.duck_conn.execute(f"CREATE OR REPLACE TABLE {table_name} AS SELECT * FROM df")

    def get_analytical_results(self, sql_query: str) -> pd.DataFrame:
        """
        Runs a query against DuckDB for high-speed analysis.
        """
        return self.duck_conn.execute(sql_query).df()
