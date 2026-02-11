import sys
import os
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.core.db import engine
from backend.models import Product, Sale, Inventory

def seed_data():
    print("Seeding demo data...")
    with Session(engine) as session:
        # 1. Create Sample Products
        categories = ["Electronics", "Home & Kitchen", "Fashion", "Beauty", "Sports"]
        products = []
        for i in range(20):
            p = Product(
                name=f"Product {i+1}",
                category=random.choice(categories),
                sku=f"SKU-{1000+i}",
                price=round(random.uniform(10.0, 500.0), 2)
            )
            session.add(p)
            products.append(p)
        
        session.flush() # Populate IDs
        
        # 2. Add Inventory
        for p in products:
            inv = Inventory(
                product_id=p.id,
                stock_level=random.randint(5, 100),
                reorder_point=15
            )
            session.add(inv)
            
        # 3. Add Historical Sales (Last 30 days)
        for p in products:
            for d in range(30):
                if random.random() > 0.5: # 50% chance of a sale each day
                    qty = random.randint(1, 10)
                    sale = Sale(
                        product_id=p.id,
                        quantity=qty,
                        amount=round(qty * p.price, 2),
                        sale_date=datetime.now() - timedelta(days=d)
                    )
                    session.add(sale)
                    
        session.commit()
        print("Data seeding completed successfully.")

if __name__ == "__main__":
    seed_data()
