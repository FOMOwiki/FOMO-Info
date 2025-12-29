#!/usr/bin/env python3
"""
FOMO Platform - Complete Database Initialization Script
=========================================================

This script initializes all MongoDB collections with seed data for the FOMO platform.
Run this script after setting up MongoDB to populate all required collections.

Collections initialized:
- team_members
- partners
- faq_items
- evolution_levels
- evolution_badges
- utility_nav_buttons
- cookie_consent_settings
- hero_settings
- about_settings
- footer_settings
- platform_settings
- community_settings
- roadmap_settings
- utilities
- drawer_cards
- navigation_items

Usage:
    python scripts/init_full_database.py [--reset] [--seed-only]

Options:
    --reset      Clear all collections before seeding
    --seed-only  Only seed collections that are empty (default)

Environment Variables:
    MONGO_URL - MongoDB connection string (default: mongodb://localhost:27017)
    DB_NAME   - Database name (default: fomo_db)
"""

import asyncio
import os
import sys
import json
from datetime import datetime, timezone
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient

# Get the script directory
SCRIPT_DIR = Path(__file__).parent
SEED_FILE = SCRIPT_DIR / 'database_seed.json'


async def load_seed_data():
    """Load seed data from JSON file."""
    if not SEED_FILE.exists():
        print(f"⚠️  Seed file not found: {SEED_FILE}")
        print("   Using default minimal data...")
        return get_default_data()
    
    with open(SEED_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_default_data():
    """Return default minimal data if seed file doesn't exist."""
    return {
        "cookie_consent_settings": [{
            "id": "default-cookie-settings",
            "enabled": True,
            "title_en": "Cookie & Privacy Settings",
            "description_en": "We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform.",
            "cookie_policy_content": "COOKIE POLICY\n\nPlease configure this in the admin panel.",
            "privacy_policy_content": "PRIVACY POLICY\n\nPlease configure this in the admin panel.",
            "terms_content": "TERMS OF USE\n\nPlease configure this in the admin panel.",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }],
        "hero_settings": [{
            "id": "default-hero",
            "title_en": "Welcome to FOMO",
            "subtitle_en": "The Future of Crypto Analytics",
            "created_at": datetime.now(timezone.utc).isoformat()
        }]
    }


async def init_collection(db, collection_name, data, reset=False):
    """Initialize a single collection with data."""
    collection = db[collection_name]
    
    # Check if collection exists and has data
    existing_count = await collection.count_documents({})
    
    if existing_count > 0 and not reset:
        print(f"  ⏭️  {collection_name}: {existing_count} docs exist (skipping)")
        return False
    
    if reset and existing_count > 0:
        await collection.delete_many({})
        print(f"  🗑️  {collection_name}: Cleared {existing_count} docs")
    
    if data:
        # Convert ISO date strings back to datetime objects
        for doc in data:
            for key in ['created_at', 'updated_at']:
                if key in doc and isinstance(doc[key], str):
                    try:
                        doc[key] = datetime.fromisoformat(doc[key].replace('Z', '+00:00'))
                    except:
                        doc[key] = datetime.now(timezone.utc)
        
        await collection.insert_many(data)
        print(f"  ✅ {collection_name}: Inserted {len(data)} docs")
        return True
    else:
        print(f"  ⚠️  {collection_name}: No data to insert")
        return False


async def init_database(reset=False):
    """Initialize all database collections."""
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'fomo_db')
    
    print("=" * 60)
    print("FOMO Platform - Database Initialization")
    print("=" * 60)
    print(f"\nMongoDB URL: {mongo_url}")
    print(f"Database: {db_name}")
    print(f"Reset mode: {'Yes' if reset else 'No (seed empty only)'}")
    print()
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Load seed data
    seed_data = await load_seed_data()
    
    print("Initializing collections:")
    print("-" * 40)
    
    # Define collection order (important ones first)
    collection_order = [
        'cookie_consent_settings',
        'hero_settings',
        'about_settings',
        'team_members',
        'partners',
        'evolution_levels',
        'evolution_badges',
        'faq_items',
        'utility_nav_buttons',
        'footer_settings',
        'platform_settings',
        'community_settings',
        'roadmap_settings',
        'utilities',
        'drawer_cards',
        'navigation_items'
    ]
    
    initialized = 0
    skipped = 0
    
    for coll_name in collection_order:
        data = seed_data.get(coll_name, [])
        result = await init_collection(db, coll_name, data, reset)
        if result:
            initialized += 1
        else:
            skipped += 1
    
    print("-" * 40)
    print(f"\n📊 Summary:")
    print(f"   Initialized: {initialized} collections")
    print(f"   Skipped: {skipped} collections")
    
    # Create indexes
    print("\n📇 Creating indexes...")
    await db.team_members.create_index("order")
    await db.partners.create_index([("category", 1), ("order", 1)])
    await db.evolution_levels.create_index("order")
    await db.evolution_badges.create_index("order")
    await db.faq_items.create_index("order")
    await db.utility_nav_buttons.create_index("order")
    print("   ✅ Indexes created")
    
    print("\n" + "=" * 60)
    print("🎉 Database initialization complete!")
    print("=" * 60)
    
    # Print quick verification
    print("\nQuick verification:")
    for coll_name in ['team_members', 'partners', 'evolution_levels', 'cookie_consent_settings']:
        count = await db[coll_name].count_documents({})
        print(f"  {coll_name}: {count} documents")


async def main():
    reset = '--reset' in sys.argv
    
    if reset:
        print("\n⚠️  WARNING: Reset mode will DELETE all existing data!")
        try:
            confirm = input("Type 'yes' to confirm: ").strip()
            if confirm != 'yes':
                print("Aborted.")
                return
        except EOFError:
            pass
    
    await init_database(reset)


if __name__ == "__main__":
    asyncio.run(main())
