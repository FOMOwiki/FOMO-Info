#!/usr/bin/env python3
"""
FOMO Platform - Database Initialization Script
This script initializes the MongoDB database with default data.
Run this after deploying to a new environment.

Usage: python init_database.py
"""

import json
import os
import httpx
import asyncio
from pathlib import Path

# Configuration
API_URL = os.environ.get("API_URL", "http://localhost:8001/api")
INIT_DATA_DIR = Path(__file__).parent / "init_data"

async def load_json(filename):
    """Load JSON data from file"""
    filepath = INIT_DATA_DIR / filename
    if filepath.exists():
        with open(filepath, 'r') as f:
            return json.load(f)
    return []

async def init_collection(client, endpoint, data, id_field='id'):
    """Initialize a collection with data"""
    print(f"\n📦 Initializing {endpoint}...")
    
    # Check if data already exists
    response = await client.get(f"{API_URL}/{endpoint}")
    existing = response.json() if response.status_code == 200 else []
    
    if isinstance(existing, list) and len(existing) > 0:
        print(f"   ⏭️  Skipping - {len(existing)} items already exist")
        return
    
    # Insert new data
    count = 0
    for item in data:
        # Remove id to let server generate new one
        item_copy = {k: v for k, v in item.items() if k != id_field and not k.endswith('_at')}
        
        try:
            response = await client.post(f"{API_URL}/{endpoint}", json=item_copy)
            if response.status_code in [200, 201]:
                count += 1
            else:
                print(f"   ⚠️  Error: {response.text[:100]}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"   ✅ Created {count} items")

async def main():
    print("=" * 60)
    print("🚀 FOMO Platform - Database Initialization")
    print("=" * 60)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Check API is running
        try:
            response = await client.get(f"{API_URL}/")
            print(f"\n✅ API is running: {API_URL}")
        except Exception as e:
            print(f"\n❌ API not available at {API_URL}")
            print(f"   Error: {e}")
            return
        
        # Initialize collections
        
        # 1. Team Members
        team_data = await load_json("team_members.json")
        await init_collection(client, "team-members", team_data)
        
        # 2. FAQ
        faq_data = await load_json("faq.json")
        await init_collection(client, "faq", faq_data)
        
        # 3. Partners
        partners_data = await load_json("partners.json")
        await init_collection(client, "partners", partners_data)
        
        # 4. Utilities (Crypto Trading Tools)
        utilities_data = await load_json("utilities.json")
        await init_collection(client, "utilities", utilities_data)
        
        # 5. Evolution Levels
        levels_data = await load_json("evolution_levels.json")
        await init_collection(client, "evolution-levels", levels_data)
        
        # 6. Evolution Badges
        badges_data = await load_json("evolution_badges.json")
        await init_collection(client, "evolution-badges", badges_data)
        
        # 7. Utility Nav Buttons (Crypto/Core/Utility)
        nav_buttons_data = await load_json("utility_nav_buttons.json")
        await init_collection(client, "utility-nav-buttons", nav_buttons_data)
        
        # 8. Drawer Cards (Projects)
        drawer_data = await load_json("drawer_cards.json")
        await init_collection(client, "drawer-cards", drawer_data)
        
        print("\n" + "=" * 60)
        print("✅ Database initialization complete!")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
