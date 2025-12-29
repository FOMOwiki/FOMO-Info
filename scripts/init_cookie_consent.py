#!/usr/bin/env python3
"""
Cookie Consent Settings Initialization Script
This script initializes the cookie consent settings with default policy content.
Run this script after database setup for proper deployment.

Usage:
    python scripts/init_cookie_consent.py

Environment Variables:
    MONGO_URL - MongoDB connection string (default: mongodb://localhost:27017)
    DB_NAME - Database name (default: fomo_db)
"""

import asyncio
import os
import uuid
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Default policy content based on FOMO.cx
COOKIE_POLICY = """COOKIE POLICY

Effective Date: March 15, 2025

1. WHAT ARE COOKIES?

Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain features.

2. TYPES OF COOKIES WE USE

Essential Cookies
These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
• Authentication cookies (keeping you logged in)
• Security cookies (protecting against fraud)
• Session cookies (maintaining your browsing session)

Analytics Cookies
These cookies collect data about your interactions with the site (e.g., number of visitors, behavior on specific pages). We use this information to improve the interface, identify and fix bugs, and determine the popularity of different FOMO sections.

Advertising Cookies
These are used to display advertisements that are more relevant to you and to measure their effectiveness. They may track whether you have viewed a particular ad and how you interacted with it.

3. MANAGING COOKIES

Browser Settings
Most browsers are set to automatically accept cookies. However, you can adjust your browser settings to block or delete cookies. Keep in mind that some features of FOMO may not function properly if you disable cookies entirely.

Third-Party Services
We may integrate third-party tools (such as Google Analytics, Facebook Pixel), which also use their own cookies or similar technologies to analyze traffic or deliver targeted ads. Each of these services has its own privacy policy.

4. DO NOT TRACK (DNT) SIGNALS

FOMO currently does not support the DNT protocol. This means that if your browser sends a "Do Not Track" signal, we cannot guarantee that data collection will be stopped.

Alternative Options: If you wish to minimize tracking, you may:
• Disable cookies in your browser settings
• Use browser extensions that block tracking scripts (e.g., Privacy Badger, uBlock Origin)
• Regularly clear your browser history and cookies

5. CONTACT US

If you have questions about our cookie practices, please contact us at the information provided on our website.

© FOMO, 2025"""

PRIVACY_POLICY = """PRIVACY POLICY

Effective Date: March 15, 2025

1. INTRODUCTION

Welcome to FOMO. We respect and value your privacy and are committed to protecting any personal information you provide to us or that we collect through your interaction with the platform.

This Policy applies to all individuals and entities interacting with FOMO, including registered users, unregistered visitors, partners, sponsors, and advertisers.

2. WHAT INFORMATION WE COLLECT

Personal Information You Provide Directly
• Account Registration: When creating an account, we may request your full name, username, email address, and password.
• User-Generated Content: You may add new crypto projects, update existing ones, leave reviews, post comments, or participate in community spaces.
• Communication Records: Emails, live chats, or other types of communication with our support team.

Automatically Collected Data
• Device Information: IP address, device type, browser type, operating system, time zone settings.
• Usage Information: Pages visited, link clicks, time spent on specific sections, referral URLs.
• Geolocation Data: Approximate location determined using your IP address.

3. HOW WE USE YOUR INFORMATION

• To ensure proper authentication and account management
• To communicate with you regarding updates or service-related messages
• To provide access to personalized content
• To build a dynamic database of crypto projects
• To improve user experience based on behavioral patterns
• To prevent fraudulent activity

4. DATA STORAGE AND SECURITY

We retain your information only for as long as it is necessary to fulfill the purposes outlined in this Policy.

Security Measures:
• Encryption: We use secure protocols (HTTPS) to transmit data
• Access control: Personal data is accessible only to authorized personnel
• Auditing and testing: We regularly assess the security of our infrastructure

5. YOUR RIGHTS AND CHOICES

• Access and Correction: Request a copy of your personal data or update it
• Deletion and Restriction: Request deletion or restrict processing of your data
• Opt-Out from Marketing: Unsubscribe from promotional emails at any time
• Data Portability: Request your data in a machine-readable format

6. COOKIES

We use cookies and similar technologies. Please see our Cookie Policy for more details.

7. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. If changes are significant, we will notify you through the website or email.

8. CONTACT US

If you have questions about this Privacy Policy, please contact us through the information provided on our website.

© FOMO, 2025"""

TERMS_CONTENT = """TERMS OF USE

Effective Date: March 15, 2025

1. INTRODUCTION

Welcome to FOMO ("Site", "we", "our"). These Terms of Use ("Terms") constitute a legal agreement between you ("you", "user") and FOMO. Please read these Terms carefully.

2. DEFINITIONS

• FOMO: An online platform providing information about cryptocurrency projects, funds, investors, and related content.
• User: Any natural person or legal entity accessing or interacting with the Site.
• Content: All information published or accessible on the Site.
• Services: All functionalities provided by FOMO.

3. ACCEPTANCE OF TERMS

By using FOMO and its services, you confirm that you have read these Terms and agree to comply with them. If you disagree with any part of these Terms, immediately stop using the site.

4. USE OF THE SITE

Available Features:
• Browsing and searching for crypto projects
• Adding your own projects
• Rating or commenting on existing projects
• Viewing fund and person profiles
• Analytics tools and statistics

Age Restrictions:
Most sections of FOMO are intended for individuals who have reached the age of majority in their jurisdiction (typically 18 years old).

5. USER RESPONSIBILITIES

• Providing accurate and up-to-date information
• Respect for intellectual property rights
• Compliance with legal standards and avoidance of fraudulent activities

6. REGISTRATION AND ACCOUNT

• You are responsible for keeping your password secure
• All actions performed under your login are deemed to have been carried out by you
• FOMO reserves the right to suspend or delete your account if you violate these Terms

7. USER CONTENT SUBMISSION

By submitting content to FOMO, you grant the platform a non-exclusive, royalty-free, worldwide license to use, reproduce, distribute, and publicly display your material.

8. DISCLAIMER

The content published on FOMO is for informational purposes only and does not constitute legal, financial, or investment advice. Cryptocurrencies are high-risk assets. FOMO shall not be liable for any losses arising from the use of information provided on the site.

9. LIMITATION OF LIABILITY

FOMO is not responsible for:
• Losses from cryptocurrency investments
• Technical errors or downtime
• User-generated content accuracy
• Third-party websites linked from our platform
• Hacking attacks or security breaches

10. CHANGES TO TERMS

FOMO reserves the right to modify these Terms at any time. Continued use constitutes acceptance of updated Terms.

11. GOVERNING LAW

These Terms are governed by the laws of the European Union.

12. CONTACT US

If you have questions about these Terms, please contact us through the information provided on our website.

© FOMO, 2025"""


async def init_cookie_consent_settings(force_update: bool = False):
    """
    Initialize cookie consent settings with default policies.
    
    Args:
        force_update: If True, update existing settings without asking
    """
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'fomo_db')
    
    print("=" * 60)
    print("FOMO Cookie Consent Initialization Script")
    print("=" * 60)
    print(f"\nConnecting to MongoDB: {mongo_url}")
    print(f"Database: {db_name}")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    collection = db.cookie_consent_settings
    
    # Check if settings already exist
    existing = await collection.find_one({}, {"_id": 0})
    
    if existing:
        print("\n⚠️  Cookie consent settings already exist:")
        print(f"   ID: {existing.get('id')}")
        print(f"   Enabled: {existing.get('enabled')}")
        print(f"   Title: {existing.get('title_en')}")
        print(f"   Cookie Policy: {len(existing.get('cookie_policy_content', ''))} chars")
        print(f"   Privacy Policy: {len(existing.get('privacy_policy_content', ''))} chars")
        print(f"   Terms: {len(existing.get('terms_content', ''))} chars")
        
        if not force_update:
            try:
                update = input("\nDo you want to update the policy content? (y/n): ").lower().strip()
            except EOFError:
                update = 'n'
        else:
            update = 'y'
            
        if update == 'y':
            result = await collection.update_one(
                {"id": existing["id"]},
                {
                    "$set": {
                        "cookie_policy_content": COOKIE_POLICY,
                        "privacy_policy_content": PRIVACY_POLICY,
                        "terms_content": TERMS_CONTENT,
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )
            print(f"\n✅ Updated {result.modified_count} document(s)")
        else:
            print("\n⏭️  Skipping update")
        return
    
    # Create new settings
    new_settings = {
        "id": str(uuid.uuid4()),
        "enabled": True,
        "title_en": "Cookie & Privacy Settings",
        "description_en": "We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform.",
        "cookie_policy_content": COOKIE_POLICY,
        "privacy_policy_content": PRIVACY_POLICY,
        "terms_content": TERMS_CONTENT,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await collection.insert_one(new_settings)
    
    print("\n" + "=" * 60)
    print("✅ Cookie consent settings initialized successfully!")
    print("=" * 60)
    print(f"\n📋 Settings created:")
    print(f"   ID: {new_settings['id']}")
    print(f"   Title: {new_settings['title_en']}")
    print(f"   Enabled: {new_settings['enabled']}")
    print(f"\n📄 Policy content:")
    print(f"   Cookie Policy: {len(COOKIE_POLICY)} characters")
    print(f"   Privacy Policy: {len(PRIVACY_POLICY)} characters")
    print(f"   Terms of Use: {len(TERMS_CONTENT)} characters")
    print("\n🎉 Deployment ready!")


async def reset_cookie_consent_settings():
    """Delete and recreate cookie consent settings."""
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'fomo_db')
    
    print("⚠️  This will DELETE all existing cookie consent settings!")
    try:
        confirm = input("Are you sure? (type 'yes' to confirm): ").strip()
    except EOFError:
        confirm = 'no'
        
    if confirm != 'yes':
        print("Aborted.")
        return
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Delete existing
    result = await db.cookie_consent_settings.delete_many({})
    print(f"Deleted {result.deleted_count} document(s)")
    
    # Recreate
    await init_cookie_consent_settings(force_update=True)


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        asyncio.run(reset_cookie_consent_settings())
    elif len(sys.argv) > 1 and sys.argv[1] == '--force':
        asyncio.run(init_cookie_consent_settings(force_update=True))
    else:
        asyncio.run(init_cookie_consent_settings())
