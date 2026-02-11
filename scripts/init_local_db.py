import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.core.config import settings
from backend.core.db import Base, engine
from backend.core.security import get_password_hash
# Import models to register them with Base.metadata
from backend.models import User, Product, Sale, Inventory

def init_db():
    print(f"Connecting to {settings.get_db_url}...")
    
    # Check if database exists, if not create it (requires connecting to default 'postgres' db first)
    # Note: This part assumes the user has permissions to create databases.
    
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully.")
        
        # Add default admin user if not exists
        from sqlalchemy.orm import Session
        with Session(engine) as session:
            admin_email = "admin@example.com"
            existing_user = session.query(User).filter(User.email == admin_email).first()
            if not existing_user:
                admin_user = User(
                    email=admin_email,
                    hashed_password=get_password_hash("password"),
                    full_name="Admin User",
                    is_superuser=True
                )
                session.add(admin_user)
                session.commit()
                print(f"Admin user created: {admin_email}")
            else:
                print(f"Admin user already exists: {admin_email}")
                
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db()
