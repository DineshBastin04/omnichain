from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import duckdb
from backend.core.config import settings

# PostgreSQL Setup
engine = create_engine(settings.get_db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DuckDB Setup (for fast analytical queries / EDA)
def get_duckdb_conn():
    """
    Returns a connection to a DuckDB instance.
    For production, this could point to a persistent file or S3.
    """
    return duckdb.connect(database=':memory:')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
