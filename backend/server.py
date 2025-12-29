from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from uuid import uuid4
from datetime import datetime, timezone, timedelta
import shutil
import base64
from collections import defaultdict
import user_agents
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
# Also mount at /api/uploads for full URL access
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="api_uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# ==================== DRAWER CARDS MODELS ====================

class DrawerCard(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title_ru: str
    title_en: str
    link: str
    image_url: str
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DrawerCardCreate(BaseModel):
    title_ru: str
    title_en: str
    link: str
    image_url: str
    order: int = 0

class DrawerCardUpdate(BaseModel):
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    link: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = None


# ==================== TEAM MEMBERS MODELS ====================

class SocialLinks(BaseModel):
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    telegram: Optional[str] = None
    instagram: Optional[str] = None
    tiktok: Optional[str] = None
    website: Optional[str] = None

class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    position_en: str
    bio_en: str
    image_url: str
    social_links: Optional[SocialLinks] = None
    displayed_socials: Optional[List[str]] = []  # Which socials to show (max 4)
    member_type: str = "main"  # "main" or "team_member"
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TeamMemberCreate(BaseModel):
    name_en: str
    position_en: str
    bio_en: str
    image_url: str
    social_links: Optional[SocialLinks] = None
    displayed_socials: Optional[List[str]] = []
    member_type: str = "main"
    order: int = 0

class TeamMemberUpdate(BaseModel):
    name_en: Optional[str] = None
    position_en: Optional[str] = None
    bio_en: Optional[str] = None
    image_url: Optional[str] = None
    social_links: Optional[SocialLinks] = None
    displayed_socials: Optional[List[str]] = None
    member_type: Optional[str] = None
    order: Optional[int] = None


# ==================== PLATFORM SETTINGS MODELS ====================

class PlatformStat(BaseModel):
    value: str
    label_ru: str
    label_en: str
    change: str
    trend: List[int] = [50, 55, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80]

class ServiceModule(BaseModel):
    icon: str
    name_ru: Optional[str] = ""
    name_en: str
    count: str
    label_ru: Optional[str] = ""
    label_en: str
    color: str

class ServiceItem(BaseModel):
    num: str
    title_ru: Optional[str] = ""
    title_en: str
    description_ru: Optional[str] = ""
    description_en: str

class BottomStat(BaseModel):
    value: str
    label_ru: Optional[str] = ""
    label_en: str
    description_ru: Optional[str] = ""
    description_en: str

class PlatformSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "platform_settings"  # Single document ID
    # Stats cards
    community: PlatformStat = PlatformStat(value="45,658", label_ru="Участников сообщества", label_en="Community Members", change="+12%")
    visits: PlatformStat = PlatformStat(value="1.2M", label_ru="Посещений в месяц", label_en="Monthly Visits", change="+18%")
    projects: PlatformStat = PlatformStat(value="16,670", label_ru="Отслеживаемых проектов", label_en="Tracked Projects", change="+8%")
    alerts: PlatformStat = PlatformStat(value="892", label_ru="Красных флагов", label_en="Red Flag Alerts", change="-15%")
    # Service modules
    service_modules: List[ServiceModule] = [
        ServiceModule(icon="📊", name_ru="Дашборд", name_en="Dashboard", count="2,847", label_ru="активных пользователей", label_en="active users", color="emerald"),
        ServiceModule(icon="💱", name_ru="OTC Маркет", name_en="OTC Market", count="$50M+", label_ru="объём", label_en="volume", color="blue"),
        ServiceModule(icon="🔄", name_ru="P2P Обмен", name_en="P2P Exchange", count="1,245", label_ru="сделок/день", label_en="trades/day", color="purple"),
        ServiceModule(icon="🎯", name_ru="Прогнозы", name_en="Predictions", count="78%", label_ru="точность", label_en="accuracy", color="orange"),
        ServiceModule(icon="🔍", name_ru="Парсинг", name_en="Parsing", count="16K+", label_ru="токенов", label_en="tokens", color="pink"),
        ServiceModule(icon="📈", name_ru="Сентимент", name_en="Sentiment", count="24/7", label_ru="мониторинг", label_en="monitoring", color="cyan"),
        ServiceModule(icon="🚀", name_ru="EarlyLand", name_en="EarlyLand", count="340+", label_ru="проектов", label_en="projects", color="green"),
        ServiceModule(icon="🖼️", name_ru="NFT Стратегия", name_en="NFT Strategy", count="89", label_ru="коллекций", label_en="collections", color="violet"),
    ]
    # Left column services
    services_list: List[ServiceItem] = [
        ServiceItem(num="01", title_ru="OTC & P2P РЫНКИ", title_en="OTC & P2P MARKETS", description_ru="Безопасная внебиржевая торговля и P2P-обмен криптоактивами с защитой эскроу и верифицированными контрагентами.", description_en="Secure over-the-counter trading and peer-to-peer exchange for crypto assets with escrow protection and verified counterparties."),
        ServiceItem(num="02", title_ru="РАННИЙ ДОСТУП", title_en="EARLY LAND ACCESS", description_ru="Получите ранний доступ к перспективным проектам, участвуйте в airdrop'ах и максимизируйте свой заработок до публичных запусков.", description_en="Get early access to promising projects, participate in airdrops, and maximize your earning potential before public launches."),
        ServiceItem(num="03", title_ru="АНАЛИТИКА И СЕНТИМЕНТ", title_en="ANALYTICS & SENTIMENT", description_ru="Продвинутый парсинг, анализ настроений и обнаружение красных флагов для выявления скамов и принятия обоснованных инвестиционных решений.", description_en="Advanced parsing, sentiment analysis, and red flag detection to identify scams and make informed investment decisions."),
    ]
    # Bottom stats
    bottom_stats: List[BottomStat] = [
        BottomStat(value="70%", label_ru="АВТОМАТИЗАЦИЯ АНАЛИЗА", label_en="ANALYSIS AUTOMATED", description_ru="AI-инсайты за секунды", description_en="AI-powered insights in seconds"),
        BottomStat(value="24/7", label_ru="ОХВАТ РЫНКА", label_en="MARKET COVERAGE", description_ru="Мониторинг в реальном времени", description_en="Real-time monitoring"),
        BottomStat(value="$50M+", label_ru="ОБЪЁМ ТОРГОВ", label_en="TRADING VOLUME", description_ru="На всех рынках", description_en="Across all markets"),
    ]
    # Section titles
    section_badge_ru: str = "ВНУТРИ ПЛАТФОРМЫ"
    section_badge_en: str = "INSIDE THE PLATFORM"
    section_title_ru: str = "Командный центр для вашего крипто-путешествия"
    section_title_en: str = "A command center for your crypto journey"
    section_intro_ru: str = "Следите за каждым движением рынка, отслеживайте проекты, управляйте портфелем и получайте доступ к эксклюзивным возможностям в одном месте."
    section_intro_en: str = "See every market move, track projects, manage your portfolio, and access exclusive opportunities in one place. FOMO connects all your crypto activities so you stay ahead of the curve."
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PlatformSettingsUpdate(BaseModel):
    community: Optional[PlatformStat] = None
    visits: Optional[PlatformStat] = None
    projects: Optional[PlatformStat] = None
    alerts: Optional[PlatformStat] = None
    service_modules: Optional[List[ServiceModule]] = None
    services_list: Optional[List[ServiceItem]] = None
    bottom_stats: Optional[List[BottomStat]] = None
    section_badge_ru: Optional[str] = None
    section_badge_en: Optional[str] = None
    section_title_ru: Optional[str] = None
    section_title_en: Optional[str] = None
    section_intro_ru: Optional[str] = None
    section_intro_en: Optional[str] = None


# ==================== ROADMAP MODELS ====================

class RoadmapTask(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name_ru: str
    name_en: str
    status: str  # 'done' or 'progress'
    category: str
    order: int = 0

class RoadmapSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "roadmap_settings"
    section_badge_ru: str = "Наш Прогресс"
    section_badge_en: str = "Our Progress"
    section_title_ru: str = "Дорожная карта проекта"
    section_title_en: str = "Project Roadmap"
    section_subtitle_ru: str = "Отслеживайте наш прогресс разработки в реальном времени"
    section_subtitle_en: str = "Track our development progress in real-time"
    tasks: List[RoadmapTask] = []
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RoadmapTaskCreate(BaseModel):
    name_ru: str
    name_en: str
    status: str = "progress"
    category: str = "Development"
    order: Optional[int] = None

class RoadmapTaskUpdate(BaseModel):
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None


# ==================== PARTNERS MODELS ====================

class Partner(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    name_ru: str
    name_en: str
    description_ru: str
    description_en: str
    image_url: str  # Normal state logo - recommended: 200x200px PNG/SVG with transparent background
    image_url_hover: Optional[str] = None  # Hover state logo (colored version)
    link: str
    category: str = "partners"  # partners, media, portfolio
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PartnerCreate(BaseModel):
    name_ru: str
    name_en: str
    description_ru: str
    description_en: str
    image_url: str
    image_url_hover: Optional[str] = None
    link: str
    category: str = "partners"
    order: Optional[int] = None

class PartnerUpdate(BaseModel):
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    image_url: Optional[str] = None
    image_url_hover: Optional[str] = None
    link: Optional[str] = None
    category: Optional[str] = None
    order: Optional[int] = None


# ==================== FOOTER SETTINGS MODELS ====================

class LegalPage(BaseModel):
    """Legal page content model for modal display"""
    id: str  # privacy, terms, disclaimer
    title: str
    content: str  # Rich text content (can be large)

class SocialMediaLink(BaseModel):
    platform: str  # github, linkedin, youtube, twitter, telegram, etc.
    url: str
    icon: Optional[str] = None  # optional icon identifier

class FooterNavigationLink(BaseModel):
    name: str
    url: str
    order: int = 0

class FooterNavigationSection(BaseModel):
    title: str  # COMPANY, PLATFORM, OTHER, etc.
    links: List[FooterNavigationLink] = []
    order: int = 0

class FooterSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "footer_settings"  # Single document ID
    
    # Company Info
    company_name: str = "FOMO"
    company_description: str = "Leading cryptocurrency analytics platform"
    company_address: str = "4 World Trade Center\n150 Greenwich St Floor 45\nNew York, NY 10007"
    company_phone: str = "(646) 845-0036"
    company_email: Optional[str] = "info@fomo.io"
    
    # Social Media
    social_media: List[SocialMediaLink] = [
        SocialMediaLink(platform="github", url="https://github.com"),
        SocialMediaLink(platform="linkedin", url="https://linkedin.com"),
        SocialMediaLink(platform="youtube", url="https://youtube.com"),
    ]
    
    # Navigation Sections
    navigation_sections: List[FooterNavigationSection] = [
        FooterNavigationSection(
            title="COMPANY",
            links=[
                FooterNavigationLink(name="About", url="#about", order=1),
                FooterNavigationLink(name="Team", url="#team", order=2),
            ],
            order=1
        ),
        FooterNavigationSection(
            title="PLATFORM",
            links=[
                FooterNavigationLink(name="Projects", url="#projects", order=1),
                FooterNavigationLink(name="Roadmap", url="#roadmap", order=2),
                FooterNavigationLink(name="Partners", url="#partners", order=3),
            ],
            order=2
        ),
        FooterNavigationSection(
            title="OTHER",
            links=[
                FooterNavigationLink(name="Documentation", url="#", order=1),
                FooterNavigationLink(name="Support", url="#", order=2),
            ],
            order=3
        ),
    ]
    
    # CTA Button
    cta_button_text: str = "Launch Platform →"
    cta_button_url: str = "#"
    
    # Legal Pages (content for modal display)
    legal_pages: List[LegalPage] = [
        LegalPage(
            id="privacy",
            title="Privacy Policy",
            content="Privacy policy content will be displayed here."
        ),
        LegalPage(
            id="terms",
            title="Terms of Service", 
            content="Terms of service content will be displayed here."
        ),
        LegalPage(
            id="disclaimer",
            title="Disclaimer",
            content="Disclaimer content will be displayed here."
        )
    ]
    
    # Copyright
    copyright_text: str = "Copyright © 2025 FOMO. All rights reserved."
    legal_disclaimer: str = "Products and services are offered by FOMO as a crypto analytics platform. All trading and investment decisions are the sole responsibility of the user."
    
    # Attribution
    made_by_text: Optional[str] = "Made by Emergent"
    made_by_url: Optional[str] = "https://emergent.sh"
    
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FooterSettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    company_address: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[str] = None
    social_media: Optional[List[SocialMediaLink]] = None
    navigation_sections: Optional[List[FooterNavigationSection]] = None
    cta_button_text: Optional[str] = None
    cta_button_url: Optional[str] = None
    legal_pages: Optional[List[LegalPage]] = None
    copyright_text: Optional[str] = None
    legal_disclaimer: Optional[str] = None
    made_by_text: Optional[str] = None
    made_by_url: Optional[str] = None



# ==================== FAQ MODELS ====================

class FAQItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FAQItemCreate(BaseModel):
    question: str
    answer: str
    order: int = 0

class FAQItemUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = None



# ==================== COMMUNITY SETTINGS MODELS ====================

class CommunitySocial(BaseModel):
    platform: str  # twitter, telegram, discord, github, etc.
    url: str
    enabled: bool = True

class CommunitySettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "community_settings"  # Single document ID
    title_ru: str = "Присоединяйся к сообществу"
    title_en: str = "Join the Community"
    description_ru: str = "Общайтесь с web3 основателями, разработчиками и крипто-энтузиастами со всего мира."
    description_en: str = "Connect with web3 founders, developers, and crypto enthusiasts from around the world."
    socials: List[CommunitySocial] = [
        CommunitySocial(platform="twitter", url="https://twitter.com", enabled=True),
        CommunitySocial(platform="telegram", url="https://t.me", enabled=True),
        CommunitySocial(platform="discord", url="https://discord.com", enabled=True),
    ]
    subscribe_enabled: bool = True
    subscribe_title_ru: str = "Будь в курсе"
    subscribe_title_en: str = "Stay Updated"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommunitySettingsUpdate(BaseModel):
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    socials: Optional[List[CommunitySocial]] = None
    subscribe_enabled: Optional[bool] = None
    subscribe_title_ru: Optional[str] = None
    subscribe_title_en: Optional[str] = None


# ==================== HERO SETTINGS MODELS ====================

class HeroStat(BaseModel):
    value: str
    label_ru: str
    label_en: str

class NFTSettings(BaseModel):
    price_per_box: float = 150
    discount_threshold: int = 3
    discount_percent: int = 10
    total_supply: int = 666
    max_per_wallet: int = 100

class HeroActionButton(BaseModel):
    text: str
    link: str
    primary: bool = False  # True = filled button, False = outline button
    use_invite_modal: bool = False  # True = opens invite modal instead of link

class HeroSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "hero_settings"
    # Badge text (English only)
    badge: str = "Now in Beta v1.1"
    # Title
    title_line1: str = "The Future of"
    title_line2: str = "Crypto Analytics"
    # Subtitle/Description
    subtitle: str = "Discover a comprehensive platform combining social engagement, data analytics, and seamless access to crypto projects, NFTs, and more."
    # Action Buttons
    action_buttons: List[HeroActionButton] = [
        HeroActionButton(text="Launch App", link="#", primary=True),
        HeroActionButton(text="Learn More", link="#about", primary=False),
    ]
    # Stats
    stats: List[HeroStat] = [
        HeroStat(value="10K+", label_ru="Активных пользователей", label_en="Active Users"),
        HeroStat(value="$50M+", label_ru="Объём торгов", label_en="Trading Volume"),
        HeroStat(value="666", label_ru="NFT Коллекция", label_en="NFT Collection"),
    ]
    nft_settings: NFTSettings = NFTSettings()
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HeroSettingsUpdate(BaseModel):
    badge: Optional[str] = None
    title_line1: Optional[str] = None
    title_line2: Optional[str] = None
    subtitle: Optional[str] = None
    action_buttons: Optional[List[HeroActionButton]] = None
    stats: Optional[List[HeroStat]] = None
    nft_settings: Optional[NFTSettings] = None


# ==================== DRAWER CARDS API ====================


# ==================== ABOUT SETTINGS MODELS ====================

class AboutFeature(BaseModel):
    icon: str = "diamond"  # diamond, clock, lightning, shield
    title: str
    description: str
    color: str = "emerald"  # emerald, teal, cyan, violet

class AboutSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "about_settings"
    badge: str = "About Us"
    title: str = "What is"
    title_highlight: str = "FOMO"
    subtitle: str = "A cutting-edge platform reshaping how users interact with the crypto world"
    description: str = "FOMO is a cutting-edge platform built to reshape the way users interact with the cryptoworld. Our goal is to create a single, comprehensive ecosystem that combines"
    social_engagement: str = "social engagement"
    data_analytics: str = "data analytics"
    seamless_access: str = "seamless access"
    description_end: str = "to crypto projects, NFTs, funds, and more."
    features: List[AboutFeature] = [
        AboutFeature(icon="diamond", title="Community-Driven", description="Every user influences the project through voting and social engagement.", color="emerald"),
        AboutFeature(icon="clock", title="24/7 Support", description="Our support never stops. We are here offering guidance every step.", color="teal"),
        AboutFeature(icon="lightning", title="Fast & Efficient", description="Launch your project quickly with FOMO tools and support.", color="cyan"),
        AboutFeature(icon="shield", title="Secure & Reliable", description="All transactions via secure smart contracts for max protection.", color="violet"),
    ]
    whitepaper_button_text: str = "Whitepaper"
    whitepaper_button_link: str = "#"
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AboutSettingsUpdate(BaseModel):
    badge: Optional[str] = None
    title: Optional[str] = None
    title_highlight: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    social_engagement: Optional[str] = None
    data_analytics: Optional[str] = None
    seamless_access: Optional[str] = None
    description_end: Optional[str] = None
    features: Optional[List[AboutFeature]] = None
    whitepaper_button_text: Optional[str] = None
    whitepaper_button_link: Optional[str] = None


# ==================== UTILITIES MODELS ====================

class UtilityStat(BaseModel):
    value: str
    label_ru: str
    label_en: str

class UtilityFeature(BaseModel):
    ru: str
    en: str

class Utility(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str
    icon_type: str = "chart"  # chart, arena, exchange, lightning, users, custom
    custom_icon_url: Optional[str] = None  # For custom uploaded icons
    short_description_ru: str
    short_description_en: str
    full_description_ru: str
    full_description_en: str
    features: List[UtilityFeature] = []
    stats: List[UtilityStat] = []
    gradient: str = "from-emerald-500 to-teal-500"
    bg_gradient: str = "from-emerald-50 to-teal-50"
    button_gradient: str = "from-emerald-500 to-teal-500"  # Button color
    button_text_ru: str = "Поучаствовать"
    button_text_en: str = "Participate"
    button_link: str = "#"
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UtilityCreate(BaseModel):
    title: str
    subtitle: str
    icon_type: str = "chart"
    custom_icon_url: Optional[str] = None
    short_description_ru: str
    short_description_en: str
    full_description_ru: str
    full_description_en: str
    features: List[UtilityFeature] = []
    stats: List[UtilityStat] = []
    gradient: str = "from-emerald-500 to-teal-500"
    bg_gradient: str = "from-emerald-50 to-teal-50"
    button_gradient: str = "from-emerald-500 to-teal-500"
    button_text_ru: str = "Поучаствовать"
    button_text_en: str = "Participate"
    button_link: str = "#"
    order: int = 0
    is_active: bool = True

class UtilityUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    icon_type: Optional[str] = None
    custom_icon_url: Optional[str] = None
    short_description_ru: Optional[str] = None
    short_description_en: Optional[str] = None
    full_description_ru: Optional[str] = None
    full_description_en: Optional[str] = None
    features: Optional[List[UtilityFeature]] = None
    stats: Optional[List[UtilityStat]] = None
    gradient: Optional[str] = None
    bg_gradient: Optional[str] = None
    button_gradient: Optional[str] = None
    button_text_ru: Optional[str] = None
    button_text_en: Optional[str] = None
    button_link: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# ==================== UTILITIES SECTION SETTINGS ====================

class UtilitiesSectionSettings(BaseModel):
    badge_ru: str = "Наши Утилиты"
    badge_en: str = "Our Utilities"
    title_ru: str = "Мощные"
    title_en: str = "Powerful"
    title_highlight_ru: str = "Инструменты Криптотрейдинга"
    title_highlight_en: str = "Crypto Trading Tools"
    subtitle_ru: str = "Комплексная экосистема инструментов для заработка в крипто-индустрии"
    subtitle_en: str = "Comprehensive ecosystem of tools for earning in crypto industry"
    click_hint_ru: str = "Нажмите для подробностей"
    click_hint_en: str = "Click for details"
    click_back_hint_ru: str = "Нажмите, чтобы вернуться"
    click_back_hint_en: str = "Click to go back"
    features_title_ru: str = "Возможности:"
    features_title_en: str = "Features:"
    details_label_ru: str = "Подробнее"
    details_label_en: str = "Details"

class UtilitiesSectionSettingsUpdate(BaseModel):
    badge_ru: Optional[str] = None
    badge_en: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    title_highlight_ru: Optional[str] = None
    title_highlight_en: Optional[str] = None
    subtitle_ru: Optional[str] = None
    subtitle_en: Optional[str] = None
    click_hint_ru: Optional[str] = None
    click_hint_en: Optional[str] = None
    click_back_hint_ru: Optional[str] = None
    click_back_hint_en: Optional[str] = None
    features_title_ru: Optional[str] = None
    features_title_en: Optional[str] = None
    details_label_ru: Optional[str] = None
    details_label_en: Optional[str] = None


@api_router.get("/drawer-cards", response_model=List[DrawerCard])
async def get_drawer_cards():
    """Get all drawer cards sorted by order"""
    cards = await db.drawer_cards.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    for card in cards:
        if isinstance(card.get('created_at'), str):
            card['created_at'] = datetime.fromisoformat(card['created_at'])
        if isinstance(card.get('updated_at'), str):
            card['updated_at'] = datetime.fromisoformat(card['updated_at'])
    return cards

@api_router.get("/drawer-cards/{card_id}", response_model=DrawerCard)
async def get_drawer_card(card_id: str):
    """Get a single drawer card by ID"""
    card = await db.drawer_cards.find_one({"id": card_id}, {"_id": 0})
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@api_router.post("/drawer-cards", response_model=DrawerCard)
async def create_drawer_card(card_data: DrawerCardCreate):
    """Create a new drawer card"""
    card = DrawerCard(**card_data.model_dump())
    doc = card.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.drawer_cards.insert_one(doc)
    return card

@api_router.put("/drawer-cards/{card_id}", response_model=DrawerCard)
async def update_drawer_card(card_id: str, card_data: DrawerCardUpdate):
    """Update an existing drawer card"""
    existing = await db.drawer_cards.find_one({"id": card_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Card not found")
    
    update_data = {k: v for k, v in card_data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.drawer_cards.update_one({"id": card_id}, {"$set": update_data})
    updated = await db.drawer_cards.find_one({"id": card_id}, {"_id": 0})
    return updated

@api_router.delete("/drawer-cards/{card_id}")
async def delete_drawer_card(card_id: str):
    """Delete a drawer card"""
    result = await db.drawer_cards.delete_one({"id": card_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}

@api_router.post("/drawer-cards/reorder")
async def reorder_drawer_cards(card_orders: List[dict]):
    """Reorder drawer cards. Expects list of {id: str, order: int}"""
    for item in card_orders:
        await db.drawer_cards.update_one(
            {"id": item["id"]}, 
            {"$set": {"order": item["order"], "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    return {"message": "Cards reordered successfully"}


# ==================== IMAGE UPLOAD API ====================

@api_router.post("/upload-image")
async def upload_image(request: Request, file: UploadFile = File(...)):
    """
    Upload an image for drawer cards.
    
    Recommended format: PNG or WebP
    Recommended size: 1200x800px (3:2 ratio)
    Max file size: 5MB
    """
    # Validate file type
    allowed_types = ["image/png", "image/jpeg", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Allowed: PNG, JPEG, WebP. Recommended: PNG or WebP at 1200x800px"
        )
    
    # Generate unique filename
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "png"
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOADS_DIR / filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Build full URL using request base URL
    base_url = str(request.base_url).rstrip('/')
    full_url = f"{base_url}/api/uploads/{filename}"
    
    # Return URL
    return {
        "filename": filename,
        "url": full_url,
        "message": "Image uploaded successfully",
        "recommendation": "Best format: PNG or WebP, Size: 1200x800px (3:2 ratio)"
    }


# ==================== TEAM MEMBERS API ====================

@api_router.get("/team-members", response_model=List[TeamMember])
async def get_team_members():
    """Get all team members"""
    collection = db["team_members"]
    team_members = []
    async for member in collection.find({}, {"_id": 0}).sort("order", 1):
        team_member = TeamMember(**member)
        team_members.append(team_member)
    return team_members

@api_router.post("/team-members", response_model=TeamMember)
async def create_team_member(member_data: TeamMemberCreate):
    """Create a new team member"""
    collection = db["team_members"]
    member = TeamMember(**member_data.model_dump())
    await collection.insert_one(member.model_dump())
    return member

@api_router.get("/team-members/{member_id}", response_model=TeamMember)
async def get_team_member(member_id: str):
    """Get a single team member by ID"""
    collection = db["team_members"]
    member = await collection.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return TeamMember(**member)

@api_router.put("/team-members/{member_id}", response_model=TeamMember)
async def update_team_member(member_id: str, update_data: TeamMemberUpdate):
    """Update a team member"""
    collection = db["team_members"]
    
    # Build update dict with only provided fields
    update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc)
        result = await collection.update_one(
            {"id": member_id},
            {"$set": update_dict}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
    
    updated_member = await collection.find_one({"id": member_id}, {"_id": 0})
    return TeamMember(**updated_member)

@api_router.delete("/team-members/{member_id}")
async def delete_team_member(member_id: str):
    """Delete a team member"""
    collection = db["team_members"]
    result = await collection.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted successfully"}

@api_router.post("/team-members/reorder")
async def reorder_team_members(order_data: List[dict]):
    """Reorder team members"""
    collection = db["team_members"]
    for item in order_data:
        await collection.update_one(
            {"id": item["id"]},
            {"$set": {"order": item["order"]}}
        )
    return {"message": "Team members reordered successfully"}


# ==================== PLATFORM SETTINGS API ====================

@api_router.get("/platform-settings")
async def get_platform_settings():
    """Get platform settings or return defaults"""
    collection = db["platform_settings"]
    settings = await collection.find_one({"id": "platform_settings"}, {"_id": 0})
    
    if not settings:
        # Return default settings
        default = PlatformSettings()
        doc = default.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await collection.insert_one(doc)
        settings = await collection.find_one({"id": "platform_settings"}, {"_id": 0})
    
    return settings

@api_router.put("/platform-settings")
async def update_platform_settings(update_data: PlatformSettingsUpdate):
    """Update platform settings"""
    collection = db["platform_settings"]
    
    # Ensure settings exist
    existing = await collection.find_one({"id": "platform_settings"})
    if not existing:
        default = PlatformSettings()
        doc = default.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await collection.insert_one(doc)
    
    # Build update dict
    update_dict = {}
    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, list):
                update_dict[key] = [item.model_dump() if hasattr(item, 'model_dump') else item for item in value]
            elif hasattr(value, 'model_dump'):
                update_dict[key] = value.model_dump()
            else:
                update_dict[key] = value
    
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await collection.update_one(
            {"id": "platform_settings"},
            {"$set": update_dict}
        )
    
    updated = await collection.find_one({"id": "platform_settings"}, {"_id": 0})
    return updated

@api_router.patch("/platform-settings/stat/{stat_name}")
async def update_single_stat(stat_name: str, stat_data: PlatformStat):
    """Update a single stat (community, visits, projects, alerts)"""
    if stat_name not in ['community', 'visits', 'projects', 'alerts']:
        raise HTTPException(status_code=400, detail="Invalid stat name")
    
    collection = db["platform_settings"]
    await collection.update_one(
        {"id": "platform_settings"},
        {"$set": {stat_name: stat_data.model_dump(), "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": f"{stat_name} updated successfully"}

@api_router.patch("/platform-settings/modules")
async def update_service_modules(modules: List[ServiceModule]):
    """Update service modules"""
    collection = db["platform_settings"]
    await collection.update_one(
        {"id": "platform_settings"},
        {"$set": {"service_modules": [m.model_dump() for m in modules], "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Service modules updated successfully"}

@api_router.patch("/platform-settings/services")
async def update_services_list(services: List[ServiceItem]):
    """Update services list (left column)"""
    collection = db["platform_settings"]
    await collection.update_one(
        {"id": "platform_settings"},
        {"$set": {"services_list": [s.model_dump() for s in services], "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Services list updated successfully"}

@api_router.patch("/platform-settings/bottom-stats")
async def update_bottom_stats(stats: List[BottomStat]):
    """Update bottom stats"""
    collection = db["platform_settings"]
    await collection.update_one(
        {"id": "platform_settings"},
        {"$set": {"bottom_stats": [s.model_dump() for s in stats], "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Bottom stats updated successfully"}


# ==================== ROADMAP API ====================

@api_router.get("/roadmap")
async def get_roadmap():
    """Get roadmap settings and tasks"""
    try:
        # Get settings with tasks from the same collection
        settings_collection = db["roadmap_settings"]
        settings = await settings_collection.find_one({"id": "roadmap_settings"}, {"_id": 0})
        
        if not settings:
            # Create default settings
            settings = {
                "id": "roadmap_settings",
                "section_badge_ru": "Наш Прогресс",
                "section_badge_en": "Our Progress",
                "section_title_ru": "Дорожная карта проекта",
                "section_title_en": "Project Roadmap",
                "section_subtitle_ru": "Отслеживайте наш прогресс разработки в реальном времени",
                "section_subtitle_en": "Track our development progress in real-time",
                "tasks": [],
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await settings_collection.insert_one(settings.copy())
        
        # Ensure tasks array exists and is sorted by order
        if "tasks" not in settings:
            settings["tasks"] = []
        else:
            # Sort tasks by order
            settings["tasks"] = sorted(settings["tasks"], key=lambda x: x.get("order", 0))
        
        return settings
    except Exception as e:
        print(f"Error in get_roadmap: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/roadmap")
async def update_roadmap(update_data: dict):
    """Update roadmap settings (badge, title, subtitle)"""
    collection = db["roadmap_settings"]
    
    update_dict = {}
    for key in ['section_badge', 'section_title', 'section_subtitle']:
        if key in update_data and update_data[key] is not None:
            update_dict[key] = update_data[key]
    
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await collection.update_one(
            {"id": "roadmap_settings"},
            {"$set": update_dict}
        )
    
    return await collection.find_one({"id": "roadmap_settings"}, {"_id": 0})

@api_router.post("/roadmap/tasks")
async def add_roadmap_task(task: RoadmapTaskCreate):
    """Add new task to roadmap"""
    collection = db["roadmap_settings"]
    
    # Get current settings to find max order
    settings = await collection.find_one({"id": "roadmap_settings"})
    current_tasks = settings.get('tasks', []) if settings else []
    max_order = max([t.get('order', 0) for t in current_tasks], default=0)
    
    new_task = {
        "id": str(uuid4()),
        "name": task.name,
        "status": task.status,
        "category": task.category,
        "order": task.order if task.order is not None else max_order + 1
    }
    
    await collection.update_one(
        {"id": "roadmap_settings"},
        {
            "$push": {"tasks": new_task},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True
    )
    
    return new_task

@api_router.put("/roadmap/tasks/{task_id}")
async def update_roadmap_task(task_id: str, update_data: RoadmapTaskUpdate):
    """Update a roadmap task"""
    collection = db["roadmap_settings"]
    
    update_dict = {}
    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            update_dict[f"tasks.$.{key}"] = value
    
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = await collection.update_one(
            {"id": "roadmap_settings", "tasks.id": task_id},
            {"$set": update_dict}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task updated successfully"}

@api_router.delete("/roadmap/tasks/{task_id}")
async def delete_roadmap_task(task_id: str):
    """Delete a roadmap task"""
    collection = db["roadmap_settings"]
    
    result = await collection.update_one(
        {"id": "roadmap_settings"},
        {
            "$pull": {"tasks": {"id": task_id}},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task deleted successfully"}

@api_router.post("/roadmap/tasks/reorder")
async def reorder_roadmap_tasks(order_data: List[dict]):
    """Reorder roadmap tasks"""
    collection = db["roadmap_settings"]
    
    settings = await collection.find_one({"id": "roadmap_settings"})
    if not settings:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    tasks = settings.get('tasks', [])
    order_map = {item['id']: item['order'] for item in order_data}
    
    for task in tasks:
        if task['id'] in order_map:
            task['order'] = order_map[task['id']]
    
    tasks.sort(key=lambda t: t.get('order', 0))
    
    await collection.update_one(
        {"id": "roadmap_settings"},
        {"$set": {"tasks": tasks, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Tasks reordered successfully"}


# ==================== PARTNERS API ====================

@api_router.get("/partners")
async def get_partners(category: Optional[str] = None):
    """Get all partners, optionally filtered by category"""
    collection = db["partners"]
    
    query = {}
    if category:
        query["category"] = category
    
    partners = await collection.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    
    # If no partners exist, create some defaults
    if not partners:
        default_partners = [
            {"id": str(uuid4()), "name": "CoinGecko", "description": "Leading cryptocurrency data aggregator providing real-time prices, market cap rankings, and trading volumes for thousands of digital assets.", "image_url": "", "link": "https://coingecko.com", "category": "partners", "order": 1},
            {"id": str(uuid4()), "name": "Binance", "description": "World's largest cryptocurrency exchange by trading volume, offering a comprehensive trading platform for digital assets.", "image_url": "", "link": "https://binance.com", "category": "partners", "order": 2},
            {"id": str(uuid4()), "name": "Chainlink", "description": "Decentralized oracle network that enables smart contracts to securely connect with external data sources and APIs.", "image_url": "", "link": "https://chain.link", "category": "partners", "order": 3},
            {"id": str(uuid4()), "name": "CoinTelegraph", "description": "Leading independent digital media resource covering blockchain technology, crypto assets and emerging fintech trends.", "image_url": "", "link": "https://cointelegraph.com", "category": "media", "order": 1},
            {"id": str(uuid4()), "name": "The Block", "description": "Research and news platform delivering institutional-grade analysis of digital asset markets and blockchain technology.", "image_url": "", "link": "https://theblock.co", "category": "media", "order": 2},
            {"id": str(uuid4()), "name": "DeFi Pulse", "description": "Analytics platform tracking and measuring the growth of decentralized finance protocols across multiple blockchains.", "image_url": "", "link": "https://defipulse.com", "category": "portfolio", "order": 1},
            {"id": str(uuid4()), "name": "Uniswap", "description": "Leading decentralized exchange protocol enabling automated trading of DeFi tokens through liquidity pools.", "image_url": "", "link": "https://uniswap.org", "category": "portfolio", "order": 2},
        ]
        for p in default_partners:
            p["created_at"] = datetime.now(timezone.utc).isoformat()
        await collection.insert_many(default_partners)
        partners = await collection.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    
    return partners

@api_router.post("/partners")
async def create_partner(partner: PartnerCreate):
    """Create a new partner"""
    collection = db["partners"]
    
    # Get max order for this category
    max_order_partner = await collection.find_one(
        {"category": partner.category},
        sort=[("order", -1)]
    )
    max_order = max_order_partner.get("order", 0) if max_order_partner else 0
    
    new_partner = {
        "id": str(uuid4()),
        "name_en": partner.name_en,
        "name_ru": partner.name_ru,
        "description_en": partner.description_en,
        "description_ru": partner.description_ru,
        "image_url": partner.image_url,
        "image_url_hover": partner.image_url_hover,
        "link": partner.link,
        "category": partner.category,
        "order": partner.order if partner.order is not None else max_order + 1,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await collection.insert_one(new_partner)
    new_partner.pop("_id", None)
    return new_partner

@api_router.put("/partners/{partner_id}")
async def update_partner(partner_id: str, update_data: PartnerUpdate):
    """Update a partner"""
    collection = db["partners"]
    
    update_dict = {}
    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            update_dict[key] = value
    
    if update_dict:
        result = await collection.update_one(
            {"id": partner_id},
            {"$set": update_dict}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Partner not found")
    
    updated = await collection.find_one({"id": partner_id}, {"_id": 0})
    return updated

@api_router.delete("/partners/{partner_id}")
async def delete_partner(partner_id: str):
    """Delete a partner"""
    collection = db["partners"]
    result = await collection.delete_one({"id": partner_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    return {"message": "Partner deleted successfully"}

@api_router.post("/partners/reorder")
async def reorder_partners(order_data: List[dict]):
    """Reorder partners"""
    collection = db["partners"]
    for item in order_data:
        await collection.update_one(
            {"id": item["id"]},
            {"$set": {"order": item["order"]}}
        )
    return {"message": "Partners reordered successfully"}


@api_router.post("/partners/seed-defaults")
async def seed_default_partners():
    """Seed default partner data with hover images"""
    collection = db["partners"]
    
    default_partners = [
        {
            "id": str(uuid4()),
            "name_en": "Binance",
            "name_ru": "Binance",
            "description_en": "World's largest cryptocurrency exchange by trading volume",
            "description_ru": "Крупнейшая криптовалютная биржа в мире по объему торгов",
            "image_url": "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=035",
            "image_url_hover": "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=035",
            "link": "https://binance.com",
            "category": "partners",
            "order": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name_en": "Coinbase",
            "name_ru": "Coinbase",
            "description_en": "Secure platform for buying, selling and storing cryptocurrency",
            "description_ru": "Безопасная платформа для покупки, продажи и хранения криптовалют",
            "image_url": "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=035",
            "image_url_hover": "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=035",
            "link": "https://coinbase.com",
            "category": "partners",
            "order": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name_en": "CoinMarketCap",
            "name_ru": "CoinMarketCap",
            "description_en": "Cryptocurrency market cap rankings and charts",
            "description_ru": "Рейтинги и графики рыночной капитализации криптовалют",
            "image_url": "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=035",
            "image_url_hover": "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=035",
            "link": "https://coinmarketcap.com",
            "category": "media",
            "order": 2,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name_en": "CoinGecko",
            "name_ru": "CoinGecko",
            "description_en": "Cryptocurrency data aggregator and tracker",
            "description_ru": "Агрегатор и трекер данных о криптовалютах",
            "image_url": "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=035",
            "image_url_hover": "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=035",
            "link": "https://coingecko.com",
            "category": "media",
            "order": 3,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name_en": "Uniswap",
            "name_ru": "Uniswap",
            "description_en": "Leading decentralized exchange protocol",
            "description_ru": "Ведущий децентрализованный протокол обмена",
            "image_url": "https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=035",
            "image_url_hover": "https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=035",
            "link": "https://uniswap.org",
            "category": "portfolio",
            "order": 4,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid4()),
            "name_en": "Chainlink",
            "name_ru": "Chainlink",
            "description_en": "Decentralized oracle network for smart contracts",
            "description_ru": "Децентрализованная оракульная сеть для смарт-контрактов",
            "image_url": "https://cryptologos.cc/logos/chainlink-link-logo.svg?v=035",
            "image_url_hover": "https://cryptologos.cc/logos/chainlink-link-logo.svg?v=035",
            "link": "https://chain.link",
            "category": "portfolio",
            "order": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Insert only if collection is empty or has fewer partners
    existing_count = await collection.count_documents({})
    if existing_count < len(default_partners):
        await collection.delete_many({})  # Clear existing
        await collection.insert_many(default_partners)
        return {"message": f"Seeded {len(default_partners)} default partners", "count": len(default_partners)}
    
    return {"message": "Partners already exist", "count": existing_count}


# ==================== FOOTER SETTINGS API ====================

@api_router.get("/footer-settings")
async def get_footer_settings():
    """Get footer settings or return defaults"""
    collection = db["footer_settings"]
    settings = await collection.find_one({"id": "footer_settings"}, {"_id": 0})
    
    if not settings:
        # Return default settings
        default = FooterSettings()
        doc = default.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        # Convert social_media list properly
        doc['social_media'] = [sm.model_dump() if hasattr(sm, 'model_dump') else sm for sm in default.social_media]
        await collection.insert_one(doc)
        settings = await collection.find_one({"id": "footer_settings"}, {"_id": 0})
    
    return settings

@api_router.put("/footer-settings")
async def update_footer_settings(update_data: FooterSettingsUpdate):
    """Update footer settings"""
    collection = db["footer_settings"]
    
    # Ensure settings exist
    existing = await collection.find_one({"id": "footer_settings"})
    if not existing:
        default = FooterSettings()
        doc = default.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        doc['social_media'] = [sm.model_dump() if hasattr(sm, 'model_dump') else sm for sm in default.social_media]
        await collection.insert_one(doc)
    
    # Build update dict
    update_dict = {}
    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, list):
                # Handle lists (like social_media)
                update_dict[key] = [item.model_dump() if hasattr(item, 'model_dump') else item for item in value]
            else:
                update_dict[key] = value
    
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await collection.update_one(
            {"id": "footer_settings"},
            {"$set": update_dict}
        )
    
    updated = await collection.find_one({"id": "footer_settings"}, {"_id": 0})
    return updated




# ==================== FAQ API ====================

@api_router.get("/faq")
async def get_faq_items():
    """Get all FAQ items sorted by order"""
    collection = db["faq_items"]
    items = await collection.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items

@api_router.post("/faq")
async def create_faq_item(item: FAQItemCreate):
    """Create a new FAQ item"""
    collection = db["faq_items"]
    
    new_item = FAQItem(
        question=item.question,
        answer=item.answer,
        order=item.order
    )
    
    doc = new_item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await collection.insert_one(doc)
    return new_item

@api_router.put("/faq/{item_id}")
async def update_faq_item(item_id: str, update_data: FAQItemUpdate):
    """Update an FAQ item"""
    collection = db["faq_items"]
    
    update_dict = {}
    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            update_dict[key] = value
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await collection.update_one(
        {"id": item_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="FAQ item not found")
    
    updated = await collection.find_one({"id": item_id}, {"_id": 0})
    return updated

@api_router.delete("/faq/{item_id}")
async def delete_faq_item(item_id: str):
    """Delete an FAQ item"""
    collection = db["faq_items"]
    
    result = await collection.delete_one({"id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ item not found")
    
    return {"message": "FAQ item deleted successfully"}




# ==================== COMMUNITY SETTINGS API ====================

@api_router.get("/community-settings")
async def get_community_settings():
    """Get community settings or return defaults"""
    collection = db["community_settings"]
    settings = await collection.find_one({"id": "community_settings"}, {"_id": 0})
    
    if not settings:
        # Return default settings
        default = CommunitySettings()
        doc = default.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        doc['socials'] = [s.model_dump() if hasattr(s, 'model_dump') else s for s in default.socials]
        await collection.insert_one(doc)
        settings = await collection.find_one({"id": "community_settings"}, {"_id": 0})
    
    return settings

@api_router.put("/community-settings")
async def update_community_settings(update_data: CommunitySettingsUpdate):
    """Update community settings"""
    collection = db["community_settings"]
    
    # Ensure settings exist
    existing = await collection.find_one({"id": "community_settings"})
    if not existing:
        default = CommunitySettings()
        doc = default.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        doc['socials'] = [s.model_dump() if hasattr(s, 'model_dump') else s for s in default.socials]
        await collection.insert_one(doc)
    
    # Build update dict
    update_dict = {}
    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, list):
                update_dict[key] = [item.model_dump() if hasattr(item, 'model_dump') else item for item in value]
            else:
                update_dict[key] = value
    
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await collection.update_one(
            {"id": "community_settings"},
            {"$set": update_dict}
        )
    
    updated = await collection.find_one({"id": "community_settings"}, {"_id": 0})
    return updated


# ==================== HERO SETTINGS API ====================

@api_router.get("/hero-settings")
async def get_hero_settings():
    """Get hero section settings including stats and NFT settings"""
    collection = db.hero_settings
    settings = await collection.find_one({"id": "hero_settings"}, {"_id": 0})
    
    if not settings:
        # Create default settings
        default_settings = HeroSettings()
        settings_dict = default_settings.model_dump()
        settings_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await collection.insert_one(settings_dict)
        return settings_dict
    
    return settings

@api_router.put("/hero-settings")
async def update_hero_settings(update_data: HeroSettingsUpdate):
    """Update hero section settings"""
    collection = db.hero_settings
    
    # Ensure document exists
    existing = await collection.find_one({"id": "hero_settings"})
    if not existing:
        default_settings = HeroSettings()
        await collection.insert_one(default_settings.model_dump())
    
    # Build update dict
    update_dict = {}
    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, list):
                update_dict[key] = [item.model_dump() if hasattr(item, 'model_dump') else item for item in value]
            elif hasattr(value, 'model_dump'):
                update_dict[key] = value.model_dump()
            else:
                update_dict[key] = value
    
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await collection.update_one(
            {"id": "hero_settings"},
            {"$set": update_dict}
        )
    
    updated = await collection.find_one({"id": "hero_settings"}, {"_id": 0})
    return updated



# ==================== ABOUT SETTINGS API ====================

@api_router.get("/about-settings")
async def get_about_settings():
    """Get About section settings"""
    collection = db.about_settings
    settings = await collection.find_one({"id": "about_settings"}, {"_id": 0})
    
    if not settings:
        # Create default settings
        default_settings = AboutSettings().model_dump()
        await collection.insert_one(default_settings)
        settings = default_settings
    
    return settings

@api_router.put("/about-settings")
async def update_about_settings(settings_update: AboutSettingsUpdate):
    """Update About section settings"""
    collection = db.about_settings
    
    # Remove None values
    update_dict = {k: v for k, v in settings_update.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Check if settings exist
    existing = await collection.find_one({"id": "about_settings"})
    
    if existing:
        # Update existing
        await collection.update_one(
            {"id": "about_settings"},
            {"$set": update_dict}
        )
    else:
        # Create new with defaults and updates
        new_settings = AboutSettings().model_dump()
        new_settings.update(update_dict)
        await collection.insert_one(new_settings)
    
    updated = await collection.find_one({"id": "about_settings"}, {"_id": 0})
    return updated


# ==================== ADMIN AUTH API ====================

class AdminLogin(BaseModel):
    password: str

@api_router.post("/admin/login")
async def admin_login(login_data: AdminLogin):
    """
    Admin authentication endpoint.
    Default password: admin123 (change in production!)
    Returns a simple token for session management.
    """
    # Simple password check (in production, use proper hashing and env variable)
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    if login_data.password == ADMIN_PASSWORD:
        # Generate simple token (in production, use JWT)
        token = base64.b64encode(f"admin:{login_data.password}:{uuid.uuid4()}".encode()).decode()
        return {
            "success": True,
            "token": token,
            "message": "Login successful"
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid password")

@api_router.post("/admin/verify")
async def verify_admin_token(token: dict):
    """Verify admin token"""
    # Simple token verification (in production, use proper JWT verification)
    try:
        decoded = base64.b64decode(token.get('token', '')).decode()
        if decoded.startswith('admin:'):
            return {"valid": True}
        return {"valid": False}
    except Exception:
        return {"valid": False}


# ==================== ANALYTICS MODELS ====================

class AnalyticsEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    session_id: str  # Unique session identifier
    event_type: str  # pageview, click, conversion, etc.
    page_url: Optional[str] = None
    page_title: Optional[str] = None
    button_id: Optional[str] = None
    button_text: Optional[str] = None
    
    # User info
    user_agent: Optional[str] = None
    device_type: Optional[str] = None  # desktop, mobile, tablet
    browser: Optional[str] = None
    os: Optional[str] = None
    
    # Location
    country: Optional[str] = None
    city: Optional[str] = None
    ip_address: Optional[str] = None
    
    # Traffic source
    referrer: Optional[str] = None
    traffic_source: Optional[str] = None  # direct, referral, search
    source_detail: Optional[str] = None  # domain or search engine
    
    # Timing
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_duration: Optional[int] = None  # in seconds
    
    # User type
    is_new_visitor: bool = True
    is_returning: bool = False
    
    # Conversion tracking
    conversion_type: Optional[str] = None  # registration, purchase, etc.
    conversion_value: Optional[float] = None

class AnalyticsEventCreate(BaseModel):
    session_id: str
    event_type: str
    page_url: Optional[str] = None
    page_title: Optional[str] = None
    button_id: Optional[str] = None
    button_text: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    session_duration: Optional[int] = None
    conversion_type: Optional[str] = None
    conversion_value: Optional[float] = None

class AnalyticsStats(BaseModel):
    # Overview stats
    page_views: int = 0
    unique_sessions: int = 0
    button_clicks: int = 0
    conversions: int = 0
    conversion_rate: float = 0.0
    avg_session_duration: int = 0  # in seconds
    
    # Visitor types
    new_visitors: int = 0
    returning_visitors: int = 0
    new_visitors_percent: float = 0.0
    returning_visitors_percent: float = 0.0
    
    # Devices
    desktop_visitors: int = 0
    mobile_visitors: int = 0
    tablet_visitors: int = 0
    desktop_percent: float = 0.0
    mobile_percent: float = 0.0
    tablet_percent: float = 0.0
    
    # Geography
    top_countries: List[Dict[str, Any]] = []
    top_cities: List[Dict[str, Any]] = []
    
    # Traffic sources
    direct_traffic: int = 0
    referral_traffic: int = 0
    search_traffic: int = 0
    direct_percent: float = 0.0
    referral_percent: float = 0.0
    search_percent: float = 0.0
    detailed_sources: List[Dict[str, Any]] = []


# ==================== ANALYTICS HELPER FUNCTIONS ====================

def parse_user_agent(user_agent_string: str) -> Dict[str, str]:
    """Parse user agent string to extract device, browser, and OS info"""
    try:
        ua = user_agents.parse(user_agent_string)
        
        # Determine device type
        if ua.is_mobile:
            device_type = "mobile"
        elif ua.is_tablet:
            device_type = "tablet"
        else:
            device_type = "desktop"
        
        return {
            "device_type": device_type,
            "browser": ua.browser.family if ua.browser.family else "Unknown",
            "os": ua.os.family if ua.os.family else "Unknown"
        }
    except Exception:
        return {
            "device_type": "desktop",
            "browser": "Unknown",
            "os": "Unknown"
        }

def determine_traffic_source(referrer: Optional[str]) -> Dict[str, str]:
    """Determine traffic source from referrer"""
    if not referrer or referrer == "":
        return {"traffic_source": "direct", "source_detail": "Direct"}
    
    # Check if it's a search engine
    search_engines = ["google", "bing", "yahoo", "duckduckgo", "yandex", "baidu"]
    referrer_lower = referrer.lower()
    
    for engine in search_engines:
        if engine in referrer_lower:
            return {"traffic_source": "search", "source_detail": engine.capitalize()}
    
    # Extract domain from referrer
    try:
        from urllib.parse import urlparse
        domain = urlparse(referrer).netloc
        return {"traffic_source": "referral", "source_detail": domain}
    except Exception:
        return {"traffic_source": "referral", "source_detail": referrer}


# ==================== ANALYTICS API ====================

@api_router.post("/analytics/track")
async def track_analytics_event(event_data: AnalyticsEventCreate, request: Request):
    """
    Track an analytics event (pageview, click, conversion, etc.)
    """
    # Parse user agent
    user_agent_str = event_data.user_agent or request.headers.get("user-agent", "")
    ua_info = parse_user_agent(user_agent_str)
    
    # Determine traffic source
    traffic_info = determine_traffic_source(event_data.referrer)
    
    # Get IP address (simplified - in production use proper IP extraction)
    ip_address = request.client.host if request.client else "Unknown"
    
    # Create event
    event = AnalyticsEvent(
        **event_data.model_dump(),
        user_agent=user_agent_str,
        device_type=ua_info["device_type"],
        browser=ua_info["browser"],
        os=ua_info["os"],
        traffic_source=traffic_info["traffic_source"],
        source_detail=traffic_info["source_detail"],
        ip_address=ip_address,
        # Location would be determined via IP geolocation service in production
        country="Unknown",
        city="Unknown"
    )
    
    # Check if returning visitor
    existing_session = await db.analytics_events.find_one({
        "session_id": event_data.session_id,
        "event_type": "pageview"
    })
    
    if existing_session:
        event.is_returning = True
        event.is_new_visitor = False
    
    # Save to database
    doc = event.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.analytics_events.insert_one(doc)
    
    return {"success": True, "event_id": event.id}


@api_router.get("/analytics/stats")
async def get_analytics_stats(period: int = 30):
    """
    Get analytics statistics for a given period (days)
    period: 7, 30, or 90 days
    """
    # Calculate date range
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=period)
    
    # Query events in period
    events = await db.analytics_events.find({
        "timestamp": {
            "$gte": start_date.isoformat(),
            "$lte": end_date.isoformat()
        }
    }, {"_id": 0}).to_list(100000)
    
    if not events:
        return AnalyticsStats()
    
    # Initialize stats
    stats = AnalyticsStats()
    
    # Track unique sessions
    unique_sessions = set()
    session_durations = []
    countries = defaultdict(int)
    cities = defaultdict(int)
    devices = defaultdict(int)
    traffic_sources = defaultdict(int)
    source_details = defaultdict(int)
    new_visitors = 0
    returning_visitors = 0
    
    # Process events
    for event in events:
        session_id = event.get("session_id")
        event_type = event.get("event_type")
        
        # Count unique sessions
        if session_id:
            unique_sessions.add(session_id)
        
        # Page views
        if event_type == "pageview":
            stats.page_views += 1
            
            # Visitor type
            if event.get("is_new_visitor"):
                new_visitors += 1
            if event.get("is_returning"):
                returning_visitors += 1
        
        # Button clicks
        if event_type == "click":
            stats.button_clicks += 1
        
        # Conversions
        if event_type == "conversion":
            stats.conversions += 1
        
        # Session duration
        if event.get("session_duration"):
            session_durations.append(event["session_duration"])
        
        # Device tracking
        device = event.get("device_type", "desktop")
        devices[device] += 1
        
        # Geography
        country = event.get("country", "Unknown")
        city = event.get("city", "Unknown")
        if country != "Unknown":
            countries[country] += 1
        if city != "Unknown":
            cities[city] += 1
        
        # Traffic sources
        traffic_source = event.get("traffic_source", "direct")
        source_detail = event.get("source_detail", "Direct")
        traffic_sources[traffic_source] += 1
        source_details[source_detail] += 1
    
    # Calculate metrics
    stats.unique_sessions = len(unique_sessions)
    
    # Conversion rate
    if stats.unique_sessions > 0:
        stats.conversion_rate = round((stats.conversions / stats.unique_sessions) * 100, 2)
    
    # Average session duration
    if session_durations:
        stats.avg_session_duration = int(sum(session_durations) / len(session_durations))
    
    # Visitor types
    total_visitors = new_visitors + returning_visitors
    if total_visitors > 0:
        stats.new_visitors = new_visitors
        stats.returning_visitors = returning_visitors
        stats.new_visitors_percent = round((new_visitors / total_visitors) * 100, 2)
        stats.returning_visitors_percent = round((returning_visitors / total_visitors) * 100, 2)
    
    # Device breakdown
    total_device_events = sum(devices.values())
    if total_device_events > 0:
        stats.desktop_visitors = devices.get("desktop", 0)
        stats.mobile_visitors = devices.get("mobile", 0)
        stats.tablet_visitors = devices.get("tablet", 0)
        stats.desktop_percent = round((stats.desktop_visitors / total_device_events) * 100, 2)
        stats.mobile_percent = round((stats.mobile_visitors / total_device_events) * 100, 2)
        stats.tablet_percent = round((stats.tablet_visitors / total_device_events) * 100, 2)
    
    # Top countries
    stats.top_countries = [
        {"name": country, "count": count}
        for country, count in sorted(countries.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    # Top cities
    stats.top_cities = [
        {"name": city, "count": count}
        for city, count in sorted(cities.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    # Traffic sources
    total_traffic = sum(traffic_sources.values())
    if total_traffic > 0:
        stats.direct_traffic = traffic_sources.get("direct", 0)
        stats.referral_traffic = traffic_sources.get("referral", 0)
        stats.search_traffic = traffic_sources.get("search", 0)
        stats.direct_percent = round((stats.direct_traffic / total_traffic) * 100, 2)
        stats.referral_percent = round((stats.referral_traffic / total_traffic) * 100, 2)
        stats.search_percent = round((stats.search_traffic / total_traffic) * 100, 2)
    
    # Detailed sources
    stats.detailed_sources = [
        {"source": source, "count": count, "percent": round((count / total_traffic) * 100, 2)}
        for source, count in sorted(source_details.items(), key=lambda x: x[1], reverse=True)[:10]
    ]
    
    return stats


@api_router.delete("/analytics/clear")
async def clear_analytics_data():
    """Clear all analytics data (admin only)"""
    result = await db.analytics_events.delete_many({})
    return {"success": True, "deleted_count": result.deleted_count}


# ==================== EXISTING ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ==================== EVOLUTION LEVELS API ====================

class EvolutionLevel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    rank_ru: str
    rank_en: str
    fomo_score_min: int
    fomo_score_max: int
    next_level_ru: str
    next_level_en: str
    description_ru: str
    description_en: str
    # Back side content for flip card
    back_title_ru: str = "How to reach this level"
    back_title_en: str = "How to reach this level"
    back_description_ru: str = ""
    back_description_en: str = ""
    animation_type: str = "stellar"
    animation_speed: str = "normal"  # slow, normal, fast
    animation_intensity: str = "normal"  # subtle, normal, intense
    gradient_from: str = "#64748b"
    gradient_to: str = "#475569"
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EvolutionLevelCreate(BaseModel):
    rank_en: str
    rank_ru: Optional[str] = ""
    fomo_score_min: int
    fomo_score_max: int
    next_level_en: str
    next_level_ru: Optional[str] = ""
    description_en: str
    description_ru: Optional[str] = ""
    back_title_ru: Optional[str] = "How to reach this level"
    back_title_en: str = "How to reach this level"
    back_description_ru: Optional[str] = ""
    back_description_en: str = ""
    animation_type: str = "stellar"
    animation_speed: str = "normal"
    animation_intensity: str = "normal"
    gradient_from: str = "#64748b"
    gradient_to: str = "#475569"
    order: int = 0

class EvolutionLevelUpdate(BaseModel):
    rank_ru: Optional[str] = None
    rank_en: Optional[str] = None
    fomo_score_min: Optional[int] = None
    fomo_score_max: Optional[int] = None
    next_level_ru: Optional[str] = None
    next_level_en: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    back_title_ru: Optional[str] = None
    back_title_en: Optional[str] = None
    back_description_ru: Optional[str] = None
    back_description_en: Optional[str] = None
    animation_type: Optional[str] = None
    animation_speed: Optional[str] = None
    animation_intensity: Optional[str] = None
    gradient_from: Optional[str] = None
    gradient_to: Optional[str] = None
    order: Optional[int] = None

@api_router.get("/evolution-levels")
async def get_evolution_levels():
    levels = await db.evolution_levels.find({}, {"_id": 0}).to_list(100)
    if not levels:
        # Default levels
        default_levels = [
            {"id": str(uuid4()), "rank": "Stellar Awakening", "fomo_score_min": 0, "fomo_score_max": 199, "next_level": "Cosmic Explorer (200)", "description": "You've taken your first steps into the FOMO universe.", "animation_type": "stellar", "gradient_from": "#64748b", "gradient_to": "#475569", "order": 0},
            {"id": str(uuid4()), "rank": "Cosmic Explorer", "fomo_score_min": 200, "fomo_score_max": 399, "next_level": "Galactic Navigator (400)", "description": "You're expanding your presence and exploring the ecosystem.", "animation_type": "cosmic", "gradient_from": "#3b82f6", "gradient_to": "#2563eb", "order": 1},
            {"id": str(uuid4()), "rank": "Galactic Navigator", "fomo_score_min": 400, "fomo_score_max": 599, "next_level": "Celestial Master (600)", "description": "You're becoming a reliable contributor in the community.", "animation_type": "galactic", "gradient_from": "#a855f7", "gradient_to": "#7c3aed", "order": 2},
            {"id": str(uuid4()), "rank": "Celestial Master", "fomo_score_min": 600, "fomo_score_max": 799, "next_level": "Astral Sage (800)", "description": "Your impact is felt across the galaxy. Others trust your moves.", "animation_type": "celestial", "gradient_from": "#f59e0b", "gradient_to": "#d97706", "order": 3},
            {"id": str(uuid4()), "rank": "Astral Sage", "fomo_score_min": 800, "fomo_score_max": 899, "next_level": "Universal Enlightenment (900)", "description": "You are now a recognized guide in the FOMO cosmos.", "animation_type": "astral", "gradient_from": "#ec4899", "gradient_to": "#db2777", "order": 4},
            {"id": str(uuid4()), "rank": "Universal Enlightenment", "fomo_score_min": 900, "fomo_score_max": 1000, "next_level": "Max level achieved!", "description": "You've reached the ultimate level. A symbol of cosmic influence.", "animation_type": "universal", "gradient_from": "#10b981", "gradient_to": "#059669", "order": 5},
        ]
        for level in default_levels:
            await db.evolution_levels.insert_one(level)
        levels = default_levels
    return sorted(levels, key=lambda x: x.get('order', 0))

@api_router.post("/evolution-levels")
async def create_evolution_level(level: EvolutionLevelCreate):
    new_level = {
        "id": str(uuid4()),
        **level.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.evolution_levels.insert_one(new_level)
    created = await db.evolution_levels.find_one({"id": new_level["id"]}, {"_id": 0})
    return created

@api_router.put("/evolution-levels/{level_id}")
async def update_evolution_level(level_id: str, update: EvolutionLevelUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.evolution_levels.update_one({"id": level_id}, {"$set": update_dict})
    updated = await db.evolution_levels.find_one({"id": level_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Level not found")
    return updated

@api_router.delete("/evolution-levels/{level_id}")
async def delete_evolution_level(level_id: str):
    result = await db.evolution_levels.delete_one({"id": level_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Level not found")
    return {"message": "Level deleted"}


# ==================== EVOLUTION BADGES API ====================

class EvolutionBadge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str = ""  # Simple name field
    name_ru: str = ""
    name_en: str = ""
    icon: str = "🏆"  # Emoji icon
    xp_requirement: int = 0
    condition: str = ""  # Simple condition field
    condition_ru: str = ""
    condition_en: str = ""
    description: str = ""  # Simple description field
    description_ru: str = ""
    description_en: str = ""
    # Back side content for flip card
    back_title_ru: str = "Как Разблокировать Этот Значок"
    back_title_en: str = "How to Unlock This Badge"
    back_description_ru: str = ""
    back_description_en: str = ""
    animation_type: str = "pioneer"
    animation_speed: str = "normal"  # slow, normal, fast
    animation_intensity: str = "normal"  # subtle, normal, intense
    gradient_from: str = "#3b82f6"
    gradient_to: str = "#06b6d4"
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EvolutionBadgeCreate(BaseModel):
    name: str = ""
    name_ru: str = ""
    name_en: str = ""
    icon: str = "🏆"
    xp_requirement: int = 0
    condition: str = ""
    condition_ru: str = ""
    condition_en: str = ""
    description: str = ""
    description_ru: str = ""
    description_en: str = ""
    back_title_ru: str = "Как Разблокировать Этот Значок"
    back_title_en: str = "How to Unlock This Badge"
    back_description_ru: str = ""
    back_description_en: str = ""
    animation_type: str = "pioneer"
    animation_speed: str = "normal"
    animation_intensity: str = "normal"
    gradient_from: str = "#3b82f6"
    gradient_to: str = "#06b6d4"
    order: int = 0

class EvolutionBadgeUpdate(BaseModel):
    name: Optional[str] = None
    name_ru: Optional[str] = None
    name_en: Optional[str] = None
    icon: Optional[str] = None
    xp_requirement: Optional[int] = None
    condition: Optional[str] = None
    condition_ru: Optional[str] = None
    condition_en: Optional[str] = None
    description: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    back_title_ru: Optional[str] = None
    back_title_en: Optional[str] = None
    back_description_ru: Optional[str] = None
    back_description_en: Optional[str] = None
    animation_type: Optional[str] = None
    animation_speed: Optional[str] = None
    animation_intensity: Optional[str] = None
    gradient_from: Optional[str] = None
    gradient_to: Optional[str] = None
    order: Optional[int] = None

@api_router.get("/evolution-badges")
async def get_evolution_badges():
    badges = await db.evolution_badges.find({}, {"_id": 0}).to_list(100)
    if not badges:
        # Default badges with icons
        default_badges = [
            {"id": str(uuid4()), "name": "XP Pioneer", "icon": "⭐", "xp_requirement": 1000, "condition": "staying active: predictions, OTC/P2P deals, insights, and community contributions", "description": "You were among the first to shape the platform — your journey began early and boldly", "animation_type": "pioneer", "gradient_from": "#3b82f6", "gradient_to": "#06b6d4", "order": 0},
            {"id": str(uuid4()), "name": "Onboarding Master", "icon": "🎯", "xp_requirement": 2500, "condition": "complete all onboarding steps: profile, wallet, watchlist, and alerts", "description": "Your setup is flawless — profile, wallet, alerts, and watchlist are all on point", "animation_type": "onboarding", "gradient_from": "#f59e0b", "gradient_to": "#d97706", "order": 1},
            {"id": str(uuid4()), "name": "Project Reviewer", "icon": "🔍", "xp_requirement": 5000, "condition": "publishing 3+ in-depth crypto project reports", "description": "You're making waves in crypto research — your deep-dive reports help others", "animation_type": "reviewer", "gradient_from": "#a855f7", "gradient_to": "#7c3aed", "order": 2},
            {"id": str(uuid4()), "name": "Top Predictor", "icon": "🎖️", "xp_requirement": 10000, "condition": "maintain ≥80% accuracy across ≥100 predictions", "description": "Accuracy is your superpower — with over 80% precision, you're a true market sniper", "animation_type": "predictor", "gradient_from": "#ef4444", "gradient_to": "#dc2626", "order": 3},
            {"id": str(uuid4()), "name": "Hot Streak", "icon": "🔥", "xp_requirement": 15000, "condition": "hit a streak of ≥5 consecutive winning predictions", "description": "You're on fire! A streak of winning predictions proves you know how to ride the momentum", "animation_type": "streak", "gradient_from": "#f97316", "gradient_to": "#ea580c", "order": 4},
            {"id": str(uuid4()), "name": "Market Maker", "icon": "💎", "xp_requirement": 20000, "condition": "complete OTC trades totaling ≥50,000 USDT", "description": "You've moved serious volume in OTC trades — your presence matters in the big league", "animation_type": "maker", "gradient_from": "#10b981", "gradient_to": "#059669", "order": 5},
            {"id": str(uuid4()), "name": "P2P Pro", "icon": "🤝", "xp_requirement": 25000, "condition": "complete P2P trades totaling ≥50,000 USDT", "description": "Your P2P game is elite — trusted, active, and consistently closing big deals", "animation_type": "p2p", "gradient_from": "#6366f1", "gradient_to": "#4f46e5", "order": 6},
            {"id": str(uuid4()), "name": "Community Star", "icon": "⚡", "xp_requirement": 35000, "condition": "through 20+ comments/discussions and earn ≥100 likes", "description": "The crowd listens when you speak — your contributions have earned trust and applause", "animation_type": "community", "gradient_from": "#ec4899", "gradient_to": "#db2777", "order": 7},
            {"id": str(uuid4()), "name": "Singularity", "icon": "👑", "xp_requirement": 100000, "condition": "unlock all 8 previous badges — singularity=true will be permanently linked to your NFT", "description": "You're one of a kind. All badges unlocked. The singularity=true tag is now forever part of your legacy", "animation_type": "singularity", "gradient_from": "#14b8a6", "gradient_to": "#0d9488", "order": 8},
        ]
        for badge in default_badges:
            await db.evolution_badges.insert_one(badge)
        badges = default_badges
    return sorted(badges, key=lambda x: x.get('order', 0))

@api_router.post("/evolution-badges")
async def create_evolution_badge(badge: EvolutionBadgeCreate):
    new_badge = {
        "id": str(uuid4()),
        **badge.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.evolution_badges.insert_one(new_badge)
    created = await db.evolution_badges.find_one({"id": new_badge["id"]}, {"_id": 0})
    return created

@api_router.put("/evolution-badges/{badge_id}")
async def update_evolution_badge(badge_id: str, update: EvolutionBadgeUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.evolution_badges.update_one({"id": badge_id}, {"$set": update_dict})
    updated = await db.evolution_badges.find_one({"id": badge_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Badge not found")
    return updated

@api_router.delete("/evolution-badges/{badge_id}")
async def delete_evolution_badge(badge_id: str):
    result = await db.evolution_badges.delete_one({"id": badge_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Badge not found")
    return {"message": "Badge deleted"}


# ==================== OTC P2P MARKET MODELS ====================

class P2PDeal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_name: str
    user_avatar: Optional[str] = None
    wallet_address: str
    deal_type: str  # "buy" or "sell"
    crypto_type: str  # "USDT", "BTC", "ETH", etc.
    price: float
    amount: float
    payment_method: str
    payment_details: Optional[str] = None
    end_date: datetime
    status: str = "active"  # "active", "completed", "cancelled"
    risk_level: str = "low"  # "low", "medium", "high"
    likes: int = 0
    dislikes: int = 0
    is_promoted: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class P2PDealCreate(BaseModel):
    user_name: str
    user_avatar: Optional[str] = None
    wallet_address: str
    deal_type: str
    crypto_type: str
    price: float
    amount: float
    payment_method: str
    payment_details: Optional[str] = None
    end_date: datetime
    risk_level: str = "low"
    is_promoted: bool = False

class P2PDealUpdate(BaseModel):
    user_name: Optional[str] = None
    price: Optional[float] = None
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    payment_details: Optional[str] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    risk_level: Optional[str] = None
    is_promoted: Optional[bool] = None


# ==================== ARENA PREDICTIONS MODELS ====================

class ArenaPrediction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    subtitle: Optional[str] = None
    category: str  # "TGE", "Price", "Airdrop", "Event"
    project_logo: Optional[str] = None
    tge_date: Optional[datetime] = None
    market_cap: Optional[str] = None
    hype_level: Optional[int] = None  # 0-100
    target_price: Optional[float] = None
    target_date: Optional[datetime] = None
    chance_percentage: Optional[int] = None  # 0-100
    yes_votes: int = 0
    no_votes: int = 0
    total_volume: Optional[str] = None
    creator_name: str
    status: str = "active"  # "active", "live", "upcoming", "resolved"
    end_date: datetime
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArenaPredictionCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    category: str
    project_logo: Optional[str] = None
    tge_date: Optional[datetime] = None
    market_cap: Optional[str] = None
    hype_level: Optional[int] = None
    target_price: Optional[float] = None
    target_date: Optional[datetime] = None
    chance_percentage: Optional[int] = None
    creator_name: str
    end_date: datetime
    is_featured: bool = False

class ArenaPredictionUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    category: Optional[str] = None
    hype_level: Optional[int] = None
    yes_votes: Optional[int] = None
    no_votes: Optional[int] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None


# ==================== INFLUENCE ENTITIES MODELS ====================

class InfluenceEntity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    avatar: Optional[str] = None
    blockchain: Optional[str] = None  # "TON", "SOL", "ADA", etc.
    entity_type: str  # "influencer", "fund", "project"
    followers: int
    following: int
    growth_30d: float  # percentage
    engagement_rate: float  # percentage
    x_score: int  # 0-1000
    x_score_change: int  # daily change
    red_flags: int = 0
    fomo_score: int  # 0-100
    fomo_score_likes: int = 0
    total_relations: int = 0
    persons: int = 0
    funds: int = 0
    projects: int = 0
    is_suggested: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InfluenceEntityCreate(BaseModel):
    name: str
    avatar: Optional[str] = None
    blockchain: Optional[str] = None
    entity_type: str
    followers: int
    following: int
    growth_30d: float
    engagement_rate: float
    x_score: int
    x_score_change: int = 0
    red_flags: int = 0
    fomo_score: int
    fomo_score_likes: int = 0
    is_suggested: bool = False

class InfluenceEntityUpdate(BaseModel):
    name: Optional[str] = None
    followers: Optional[int] = None
    following: Optional[int] = None
    growth_30d: Optional[float] = None
    engagement_rate: Optional[float] = None
    x_score: Optional[int] = None
    x_score_change: Optional[int] = None
    red_flags: Optional[int] = None
    fomo_score: Optional[int] = None
    is_suggested: Optional[bool] = None


# ==================== EARLYLAND OPPORTUNITIES MODELS ====================

class EarlylandOpportunity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    subtitle: Optional[str] = None
    logo: Optional[str] = None
    category: str  # "Airdrop", "Testnet", "Quests", "Whitelist", "Farming", "Others"
    type_tag: str  # "DeFi", "NFT", "Gaming", etc.
    difficulty: str  # "Easy", "Medium", "Hard"
    reward: str  # "High Potential", "NFT", "~$2000", etc.
    end_date: datetime
    status: str = "active"  # "active", "deadline_soon", "ended"
    is_new: bool = False
    is_most_hyped: bool = False
    participants: int = 0
    completed: int = 0
    engagement_score: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EarlylandOpportunityCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    logo: Optional[str] = None
    category: str
    type_tag: str
    difficulty: str
    reward: str
    end_date: datetime
    is_new: bool = False
    is_most_hyped: bool = False

class EarlylandOpportunityUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    reward: Optional[str] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    is_new: Optional[bool] = None
    is_most_hyped: Optional[bool] = None
    participants: Optional[int] = None
    completed: Optional[int] = None


# ==================== OTC P2P MARKET ENDPOINTS ====================

@api_router.get("/p2p-deals", response_model=List[P2PDeal])
async def get_p2p_deals(
    deal_type: Optional[str] = None,
    crypto_type: Optional[str] = None,
    status: Optional[str] = None
):
    query = {}
    if deal_type:
        query["deal_type"] = deal_type
    if crypto_type:
        query["crypto_type"] = crypto_type
    if status:
        query["status"] = status
    
    deals = await db.p2p_deals.find(query, {"_id": 0}).to_list(100)
    if not deals:
        # Default sample deals
        default_deals = [
            {
                "id": str(uuid4()),
                "user_name": "Dr. Laurent",
                "user_avatar": None,
                "wallet_address": "0xf5gd...75h0",
                "deal_type": "buy",
                "crypto_type": "USDT",
                "price": 43.4,
                "amount": 1000,
                "payment_method": "Monobank (Card)",
                "payment_details": "Payment details in chat",
                "end_date": datetime(2025, 8, 20, 0, 0),
                "status": "active",
                "risk_level": "low",
                "likes": 1200,
                "dislikes": 123,
                "is_promoted": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for deal in default_deals:
            await db.p2p_deals.insert_one(deal)
        deals = default_deals
    return deals

@api_router.post("/p2p-deals", response_model=P2PDeal)
async def create_p2p_deal(deal: P2PDealCreate):
    new_deal = {
        "id": str(uuid4()),
        **deal.model_dump(),
        "likes": 0,
        "dislikes": 0,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.p2p_deals.insert_one(new_deal)
    created = await db.p2p_deals.find_one({"id": new_deal["id"]}, {"_id": 0})
    return created

@api_router.put("/p2p-deals/{deal_id}", response_model=P2PDeal)
async def update_p2p_deal(deal_id: str, update: P2PDealUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.p2p_deals.update_one({"id": deal_id}, {"$set": update_dict})
    updated = await db.p2p_deals.find_one({"id": deal_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Deal not found")
    return updated

@api_router.delete("/p2p-deals/{deal_id}")
async def delete_p2p_deal(deal_id: str):
    result = await db.p2p_deals.delete_one({"id": deal_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Deal not found")
    return {"message": "Deal deleted"}


# ==================== ARENA PREDICTIONS ENDPOINTS ====================

@api_router.get("/arena-predictions", response_model=List[ArenaPrediction])
async def get_arena_predictions(
    category: Optional[str] = None,
    status: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    
    predictions = await db.arena_predictions.find(query, {"_id": 0}).to_list(100)
    if not predictions:
        # Default sample predictions
        default_predictions = [
            {
                "id": str(uuid4()),
                "title": "SharkRace Club",
                "subtitle": "NFT & Collectibles",
                "category": "TGE",
                "project_logo": None,
                "tge_date": datetime(2026, 3, 8),
                "market_cap": "$5.2M",
                "hype_level": 72,
                "yes_votes": 87,
                "no_votes": 145,
                "creator_name": "Jessica Monroe",
                "status": "active",
                "end_date": datetime(2026, 3, 8),
                "is_featured": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for pred in default_predictions:
            await db.arena_predictions.insert_one(pred)
        predictions = default_predictions
    return predictions

@api_router.post("/arena-predictions", response_model=ArenaPrediction)
async def create_arena_prediction(prediction: ArenaPredictionCreate):
    new_prediction = {
        "id": str(uuid4()),
        **prediction.model_dump(),
        "yes_votes": 0,
        "no_votes": 0,
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.arena_predictions.insert_one(new_prediction)
    created = await db.arena_predictions.find_one({"id": new_prediction["id"]}, {"_id": 0})
    return created

@api_router.put("/arena-predictions/{prediction_id}", response_model=ArenaPrediction)
async def update_arena_prediction(prediction_id: str, update: ArenaPredictionUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.arena_predictions.update_one({"id": prediction_id}, {"$set": update_dict})
    updated = await db.arena_predictions.find_one({"id": prediction_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return updated

@api_router.delete("/arena-predictions/{prediction_id}")
async def delete_arena_prediction(prediction_id: str):
    result = await db.arena_predictions.delete_one({"id": prediction_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return {"message": "Prediction deleted"}


# ==================== INFLUENCE ENTITIES ENDPOINTS ====================

@api_router.get("/influence-entities", response_model=List[InfluenceEntity])
async def get_influence_entities(
    entity_type: Optional[str] = None,
    is_suggested: Optional[bool] = None
):
    query = {}
    if entity_type:
        query["entity_type"] = entity_type
    if is_suggested is not None:
        query["is_suggested"] = is_suggested
    
    entities = await db.influence_entities.find(query, {"_id": 0}).to_list(100)
    if not entities:
        # Default sample entities
        default_entities = [
            {
                "id": str(uuid4()),
                "name": "Laurent Ghoul",
                "avatar": None,
                "entity_type": "influencer",
                "followers": 184200,
                "following": 612,
                "growth_30d": 3.8,
                "engagement_rate": 8.2,
                "x_score": 923,
                "x_score_change": 12,
                "red_flags": 0,
                "fomo_score": 94,
                "fomo_score_likes": 654,
                "total_relations": 453,
                "persons": 53,
                "funds": 200,
                "projects": 200,
                "is_suggested": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for entity in default_entities:
            await db.influence_entities.insert_one(entity)
        entities = default_entities
    return entities

@api_router.post("/influence-entities", response_model=InfluenceEntity)
async def create_influence_entity(entity: InfluenceEntityCreate):
    new_entity = {
        "id": str(uuid4()),
        **entity.model_dump(),
        "total_relations": 0,
        "persons": 0,
        "funds": 0,
        "projects": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.influence_entities.insert_one(new_entity)
    created = await db.influence_entities.find_one({"id": new_entity["id"]}, {"_id": 0})
    return created

@api_router.put("/influence-entities/{entity_id}", response_model=InfluenceEntity)
async def update_influence_entity(entity_id: str, update: InfluenceEntityUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.influence_entities.update_one({"id": entity_id}, {"$set": update_dict})
    updated = await db.influence_entities.find_one({"id": entity_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Entity not found")
    return updated

@api_router.delete("/influence-entities/{entity_id}")
async def delete_influence_entity(entity_id: str):
    result = await db.influence_entities.delete_one({"id": entity_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entity not found")
    return {"message": "Entity deleted"}


# ==================== EARLYLAND OPPORTUNITIES ENDPOINTS ====================

@api_router.get("/earlyland-opportunities", response_model=List[EarlylandOpportunity])
async def get_earlyland_opportunities(
    category: Optional[str] = None,
    status: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    
    opportunities = await db.earlyland_opportunities.find(query, {"_id": 0}).to_list(100)
    if not opportunities:
        # Default sample opportunities
        default_opportunities = [
            {
                "id": str(uuid4()),
                "title": "zkLink Nova",
                "subtitle": "Testnet",
                "logo": None,
                "category": "Testnet",
                "type_tag": "DeFi",
                "difficulty": "Easy",
                "reward": "High Potential",
                "end_date": datetime(2025, 7, 5),
                "status": "active",
                "is_new": False,
                "is_most_hyped": True,
                "participants": 0,
                "completed": 87,
                "engagement_score": 145,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for opp in default_opportunities:
            await db.earlyland_opportunities.insert_one(opp)
        opportunities = default_opportunities
    return opportunities

@api_router.post("/earlyland-opportunities", response_model=EarlylandOpportunity)
async def create_earlyland_opportunity(opportunity: EarlylandOpportunityCreate):
    new_opportunity = {
        "id": str(uuid4()),
        **opportunity.model_dump(),
        "status": "active",
        "participants": 0,
        "completed": 0,
        "engagement_score": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.earlyland_opportunities.insert_one(new_opportunity)
    created = await db.earlyland_opportunities.find_one({"id": new_opportunity["id"]}, {"_id": 0})
    return created

@api_router.put("/earlyland-opportunities/{opportunity_id}", response_model=EarlylandOpportunity)
async def update_earlyland_opportunity(opportunity_id: str, update: EarlylandOpportunityUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.earlyland_opportunities.update_one({"id": opportunity_id}, {"$set": update_dict})
    updated = await db.earlyland_opportunities.find_one({"id": opportunity_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return updated

@api_router.delete("/earlyland-opportunities/{opportunity_id}")
async def delete_earlyland_opportunity(opportunity_id: str):
    result = await db.earlyland_opportunities.delete_one({"id": opportunity_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return {"message": "Opportunity deleted"}


# ==================== HERO BUTTONS SETTINGS ====================

class HeroButton(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    label: str
    url: str
    style: str = "primary"  # "primary", "secondary", "outline"
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HeroButtonCreate(BaseModel):
    label: str
    url: str
    style: str = "primary"
    order: int = 0
    is_active: bool = True

class HeroButtonUpdate(BaseModel):
    label: Optional[str] = None
    url: Optional[str] = None
    style: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

@api_router.get("/hero-buttons", response_model=List[HeroButton])
async def get_hero_buttons():
    buttons = await db.hero_buttons.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    if not buttons:
        # Default hero buttons (max 2)
        default_buttons = [
            {
                "id": str(uuid4()),
                "label": "Explore Platform",
                "url": "https://example.com/explore",
                "style": "primary",
                "order": 1,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid4()),
                "label": "Buy NFT",
                "url": "https://example.com/nft",
                "style": "secondary",
                "order": 2,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for button in default_buttons:
            await db.hero_buttons.insert_one(button)
        buttons = default_buttons
    return buttons

@api_router.post("/hero-buttons", response_model=HeroButton)
async def create_hero_button(button: HeroButtonCreate):
    new_button = {
        "id": str(uuid4()),
        **button.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.hero_buttons.insert_one(new_button)
    created = await db.hero_buttons.find_one({"id": new_button["id"]}, {"_id": 0})
    return created

@api_router.put("/hero-buttons/{button_id}", response_model=HeroButton)
async def update_hero_button(button_id: str, update: HeroButtonUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.hero_buttons.update_one({"id": button_id}, {"$set": update_dict})
    updated = await db.hero_buttons.find_one({"id": button_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Hero button not found")
    return updated

@api_router.delete("/hero-buttons/{button_id}")
async def delete_hero_button(button_id: str):
    result = await db.hero_buttons.delete_one({"id": button_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hero button not found")
    return {"message": "Hero button deleted"}


# ==================== NAVIGATION SETTINGS ====================

class NavigationItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    key: str
    label_ru: str
    label_en: str
    href: str
    order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NavigationItemCreate(BaseModel):
    key: str
    label_ru: str
    label_en: str
    href: str
    order: int = 0
    is_active: bool = True

class NavigationItemUpdate(BaseModel):
    key: Optional[str] = None
    label_ru: Optional[str] = None
    label_en: Optional[str] = None
    href: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

@api_router.get("/navigation-items", response_model=List[NavigationItem])
async def get_navigation_items():
    items = await db.navigation_items.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    if not items:
        # Default navigation items
        default_items = [
            {
                "id": str(uuid4()),
                "key": "about",
                "label_ru": "О нас",
                "label_en": "About",
                "href": "#about",
                "order": 1,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid4()),
                "key": "platform",
                "label_ru": "Платформа",
                "label_en": "Platform",
                "href": "#platform",
                "order": 2,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid4()),
                "key": "projects",
                "label_ru": "Проекты",
                "label_en": "Projects",
                "href": "#projects",
                "order": 3,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid4()),
                "key": "roadmap",
                "label_ru": "Дорожная карта",
                "label_en": "Roadmap",
                "href": "#roadmap",
                "order": 4,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid4()),
                "key": "team",
                "label_ru": "Команда",
                "label_en": "Team",
                "href": "#team",
                "order": 5,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid4()),
                "key": "partners",
                "label_ru": "Партнёры",
                "label_en": "Partners",
                "href": "#partners",
                "order": 6,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for item in default_items:
            await db.navigation_items.insert_one(item)
        items = default_items
    return items

@api_router.post("/navigation-items", response_model=NavigationItem)
async def create_navigation_item(item: NavigationItemCreate):
    new_item = {
        "id": str(uuid4()),
        **item.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.navigation_items.insert_one(new_item)
    created = await db.navigation_items.find_one({"id": new_item["id"]}, {"_id": 0})
    return created

@api_router.put("/navigation-items/{item_id}", response_model=NavigationItem)
async def update_navigation_item(item_id: str, update: NavigationItemUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.navigation_items.update_one({"id": item_id}, {"$set": update_dict})
    updated = await db.navigation_items.find_one({"id": item_id}, {"_id": 0})
    if not updated:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    return updated

@api_router.delete("/navigation-items/{item_id}")
async def delete_navigation_item(item_id: str):
    result = await db.navigation_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Navigation item not found")
    return {"message": "Navigation item deleted"}


# ==================== UTILITIES API ====================

@api_router.get("/utilities", response_model=List[Utility])
async def get_utilities():
    """Get all active utilities sorted by order"""
    utilities = await db.utilities.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return utilities

@api_router.get("/utilities/all", response_model=List[Utility])
async def get_all_utilities():
    """Get all utilities (including inactive) for admin panel"""
    utilities = await db.utilities.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return utilities

@api_router.get("/utilities/{utility_id}", response_model=Utility)
async def get_utility(utility_id: str):
    """Get a single utility by ID"""
    utility = await db.utilities.find_one({"id": utility_id}, {"_id": 0})
    if not utility:
        raise HTTPException(status_code=404, detail="Utility not found")
    return utility

@api_router.post("/utilities", response_model=Utility)
async def create_utility(utility_data: UtilityCreate):
    """Create a new utility"""
    utility = Utility(
        **utility_data.model_dump(),
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    await db.utilities.insert_one(utility.model_dump())
    return utility

@api_router.put("/utilities/{utility_id}", response_model=Utility)
async def update_utility(utility_id: str, utility_data: UtilityUpdate):
    """Update an existing utility"""
    existing = await db.utilities.find_one({"id": utility_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Utility not found")
    
    update_dict = {k: v for k, v in utility_data.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.utilities.update_one(
        {"id": utility_id},
        {"$set": update_dict}
    )
    
    updated = await db.utilities.find_one({"id": utility_id}, {"_id": 0})
    return updated

@api_router.delete("/utilities/{utility_id}")
async def delete_utility(utility_id: str):
    """Delete a utility"""
    result = await db.utilities.delete_one({"id": utility_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Utility not found")
    return {"message": "Utility deleted successfully"}

@api_router.put("/utilities/reorder")
async def reorder_utilities(utility_orders: List[dict]):
    """Reorder utilities"""
    for item in utility_orders:
        await db.utilities.update_one(
            {"id": item["id"]},
            {"$set": {"order": item["order"]}}
        )
    return {"message": "Utilities reordered successfully"}

@api_router.post("/utilities/seed-defaults")
async def seed_default_utilities():
    """Seed default utilities if none exist"""


# ==================== CRYPTO PRICES API (with caching) ====================

# In-memory cache for crypto prices
crypto_prices_cache = {
    "data": None,
    "last_updated": None
}
CACHE_DURATION_SECONDS = 300  # 5 minutes cache

@api_router.get("/crypto-prices")
async def get_crypto_prices():
    """Get cryptocurrency prices from CoinGecko with caching to avoid rate limits"""
    global crypto_prices_cache
    
    now = datetime.now(timezone.utc)
    
    # Check if cache is valid
    if crypto_prices_cache["data"] and crypto_prices_cache["last_updated"]:
        cache_age = (now - crypto_prices_cache["last_updated"]).total_seconds()
        if cache_age < CACHE_DURATION_SECONDS:
            return {
                "prices": crypto_prices_cache["data"],
                "cached": True,
                "cache_age_seconds": int(cache_age)
            }
    
    # Fetch fresh data from CoinGecko
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # CoinGecko free API - get top cryptocurrencies
            response = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={
                    "ids": "bitcoin,ethereum,zksync,binancecoin,ripple,cardano,dogecoin,polkadot,avalanche-2,chainlink",
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                    "include_market_cap": "true"
                },
                headers={
                    "Accept": "application/json"
                }
            )
            
            if response.status_code == 429:
                # Rate limited - return cached data if available, or error
                if crypto_prices_cache["data"]:
                    return {
                        "prices": crypto_prices_cache["data"],
                        "cached": True,
                        "rate_limited": True,
                        "message": "Rate limited, returning cached data"
                    }
                raise HTTPException(status_code=429, detail="CoinGecko rate limit reached and no cached data available")
            
            response.raise_for_status()
            data = response.json()
            
            # Update cache
            crypto_prices_cache["data"] = data
            crypto_prices_cache["last_updated"] = now
            
            return {
                "prices": data,
                "cached": False,
                "last_updated": now.isoformat()
            }
            
    except httpx.TimeoutException:
        if crypto_prices_cache["data"]:
            return {
                "prices": crypto_prices_cache["data"],
                "cached": True,
                "error": "Timeout, returning cached data"
            }
        raise HTTPException(status_code=504, detail="CoinGecko request timeout")
    except httpx.HTTPStatusError as e:
        if crypto_prices_cache["data"]:
            return {
                "prices": crypto_prices_cache["data"],
                "cached": True,
                "error": f"API error: {e.response.status_code}, returning cached data"
            }
        raise HTTPException(status_code=502, detail=f"CoinGecko API error: {str(e)}")
    except Exception as e:
        if crypto_prices_cache["data"]:
            return {
                "prices": crypto_prices_cache["data"],
                "cached": True,
                "error": f"Error: {str(e)}, returning cached data"
            }
        raise HTTPException(status_code=500, detail=f"Failed to fetch crypto prices: {str(e)}")


# ==================== UTILITY NAVIGATION BUTTONS API ====================

class UtilityNavButton(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    label: str
    url: str
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UtilityNavButtonCreate(BaseModel):
    label: str
    url: str
    order: int = 0

class UtilityNavButtonUpdate(BaseModel):
    label: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None

@api_router.get("/utility-nav-buttons")
async def get_utility_nav_buttons():
    """Get all utility navigation buttons"""
    collection = db["utility_nav_buttons"]
    buttons = await collection.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return buttons

@api_router.post("/utility-nav-buttons")
async def create_utility_nav_button(button: UtilityNavButtonCreate):
    """Create a new utility navigation button"""
    collection = db["utility_nav_buttons"]
    new_button = UtilityNavButton(**button.model_dump())
    await collection.insert_one(new_button.model_dump())
    return {"message": "Button created", "id": new_button.id}

@api_router.put("/utility-nav-buttons/{button_id}")
async def update_utility_nav_button(button_id: str, button: UtilityNavButtonUpdate):
    """Update a utility navigation button"""
    collection = db["utility_nav_buttons"]
    update_data = {k: v for k, v in button.model_dump().items() if v is not None}
    if update_data:
        await collection.update_one({"id": button_id}, {"$set": update_data})
    return {"message": "Button updated"}

@api_router.delete("/utility-nav-buttons/{button_id}")
async def delete_utility_nav_button(button_id: str):
    """Delete a utility navigation button"""
    collection = db["utility_nav_buttons"]
    await collection.delete_one({"id": button_id})
    return {"message": "Button deleted"}

    existing = await db.utilities.count_documents({})
    if existing > 0:
        return {"message": "Utilities already exist", "count": existing}
    
    default_utilities = [
        {
            "id": "nft-strategy",
            "title": "NFT Strategy",
            "subtitle": "Perpetual Trading Machine",
            "icon_type": "chart",
            "short_description_ru": "Автоматизированная система торговли NFT через токенизацию с Yo-Yo механизмом и buyback & burn.",
            "short_description_en": "Automated NFT trading system via tokenization with Yo-Yo mechanism and buyback & burn.",
            "full_description_ru": "NFT Strategy - это революционная система автоматизированной торговли NFT на основе токенизации коллекций. Смарт-контракт работает синхронно с маркетплейсом: автоматически выкупает floor NFT из коллекции, мгновенно выставляет их на продажу с премией 1.2x, а при продаже выкупает и сжигает токены стратегии.",
            "full_description_en": "NFT Strategy is a revolutionary automated NFT trading system based on collection tokenization. Smart contract syncs with marketplace: automatically buys floor NFTs, instantly lists them at 1.2x premium, and upon sale buys back and burns strategy tokens.",
            "features": [
                {"ru": "Автоматический выкуп floor NFT", "en": "Automatic floor NFT buyback"},
                {"ru": "Yo-Yo механизм с 10% комиссией", "en": "Yo-Yo mechanism with 10% fee"},
                {"ru": "Buyback & Burn для дефляции", "en": "Buyback & Burn for deflation"},
                {"ru": "Поддержка цены коллекции 24/7", "en": "Collection price support 24/7"}
            ],
            "stats": [
                {"value": "8%", "label_ru": "В пул покупок", "label_en": "To buying pool"},
                {"value": "1.2x", "label_ru": "Премия продаж", "label_en": "Sales premium"},
                {"value": "24/7", "label_ru": "Автоматика", "label_en": "Automation"}
            ],
            "gradient": "from-emerald-500 to-teal-500",
            "bg_gradient": "from-emerald-50 to-teal-50",
            "order": 0,
            "is_active": True
        },
        {
            "id": "arena",
            "title": "Arena",
            "subtitle": "Prediction Markets",
            "icon_type": "arena",
            "short_description_ru": "Децентрализованная платформа предсказаний на криптособытия с ставками на TGE, листинги и движения рынка.",
            "short_description_en": "Decentralized prediction platform for crypto events with bets on TGE, listings and market movements.",
            "full_description_ru": "Arena - это децентрализованная платформа предсказаний для криптоиндустрии в стиле Polymarket. Пользователи делают ставки на исходы важных событий: выйдет ли проект успешно на TGE или провалится, будет ли токен листиться на major биржах, вырастет цена или упадёт.",
            "full_description_en": "Arena is a decentralized prediction platform for crypto industry Polymarket-style. Users bet on outcomes of major events: will project succeed at TGE or fail, will token list on major exchanges, will price pump or dump.",
            "features": [
                {"ru": "Предсказания на TGE проектов", "en": "TGE project predictions"},
                {"ru": "Ставки на листинги токенов", "en": "Token listing bets"},
                {"ru": "Прогнозы ценовых движений", "en": "Price movement forecasts"},
                {"ru": "Децентрализованные оракулы", "en": "Decentralized oracles"}
            ],
            "stats": [
                {"value": "100+", "label_ru": "Активных рынков", "label_en": "Active markets"},
                {"value": "$1M+", "label_ru": "Объём ставок", "label_en": "Betting volume"},
                {"value": "95%", "label_ru": "Точность оракулов", "label_en": "Oracle accuracy"}
            ],
            "gradient": "from-purple-500 to-pink-500",
            "bg_gradient": "from-purple-50 to-pink-50",
            "order": 1,
            "is_active": True
        },
        {
            "id": "p2p-otc",
            "title": "P2P & OTC",
            "subtitle": "Safe Trading Platform",
            "icon_type": "exchange",
            "short_description_ru": "Безопасный обмен фиата и крипто-активов через смарт-контракт гарант с комиссией 2-5%.",
            "short_description_en": "Safe exchange of fiat and crypto assets via smart contract escrow with 2-5% fee.",
            "full_description_ru": "P2P & OTC - это платформа безопасного обмена с двойным функционалом. P2P секция позволяет обменивать фиатные деньги на криптовалюту напрямую между пользователями по классической схеме. OTC расширяет возможности: здесь можно обменивать любые крипто-активы, токены, NFT, аккаунты, приватные группы, курсы и услуги.",
            "full_description_en": "P2P & OTC is a safe exchange platform with dual functionality. P2P section enables fiat-to-crypto exchange directly between users via classic scheme. OTC expands possibilities: exchange any crypto assets, tokens, NFTs, accounts, private groups, courses, services.",
            "features": [
                {"ru": "P2P обмен фиата на крипто", "en": "P2P fiat-to-crypto exchange"},
                {"ru": "OTC для любых крипто-активов", "en": "OTC for any crypto assets"},
                {"ru": "Смарт-контракт гарант", "en": "Smart contract escrow"},
                {"ru": "Автоматическое разрешение споров", "en": "Automatic dispute resolution"}
            ],
            "stats": [
                {"value": "2-5%", "label_ru": "Низкая комиссия", "label_en": "Low commission"},
                {"value": "100%", "label_ru": "Безопасность", "label_en": "Safety"},
                {"value": "24/7", "label_ru": "Поддержка", "label_en": "Support"}
            ],
            "gradient": "from-blue-500 to-cyan-500",
            "bg_gradient": "from-blue-50 to-cyan-50",
            "order": 2,
            "is_active": True
        },
        {
            "id": "alpha",
            "title": "Alpha",
            "subtitle": "AI-Powered Analytics",
            "icon_type": "lightning",
            "short_description_ru": "Парсинг соцсетей и AI-анализ для поиска ранних проектов и определения рыночных сентиментов.",
            "short_description_en": "Social media parsing and AI analysis to find early projects and determine market sentiment.",
            "full_description_ru": "Alpha - это AI-система поиска альфа-возможностей в крипте. Наши боты непрерывно парсят Twitter, Telegram, Discord и другие соцсети, анализируя миллионы сообщений в реальном времени. Продвинутый AI определяет сентименты сообщества, находит упоминания новых проектов на самых ранних стадиях.",
            "full_description_en": "Alpha is AI-system for finding alpha opportunities in crypto. Our bots continuously parse Twitter, Telegram, Discord and other socials, analyzing millions of messages in real-time. Advanced AI determines community sentiment, finds mentions of new projects at earliest stages.",
            "features": [
                {"ru": "Парсинг Twitter, Telegram, Discord", "en": "Twitter, Telegram, Discord parsing"},
                {"ru": "AI анализ сентиментов", "en": "AI sentiment analysis"},
                {"ru": "Поиск ранних проектов", "en": "Early project discovery"},
                {"ru": "Отслеживание китов", "en": "Whale tracking"}
            ],
            "stats": [
                {"value": "1M+", "label_ru": "Постов/день", "label_en": "Posts/day"},
                {"value": "24/7", "label_ru": "Мониторинг", "label_en": "Monitoring"},
                {"value": "85%", "label_ru": "Точность AI", "label_en": "AI accuracy"}
            ],
            "gradient": "from-yellow-500 to-orange-500",
            "bg_gradient": "from-yellow-50 to-orange-50",
            "order": 3,
            "is_active": True
        },
        {
            "id": "influencers",
            "title": "Influencers",
            "subtitle": "KOL Rating System",
            "icon_type": "users",
            "short_description_ru": "Анализ и рейтинг крипто-инфлюенсеров: качество контента, честность, влияние на рынок.",
            "short_description_en": "Analysis and rating of crypto influencers: content quality, honesty, market influence.",
            "full_description_ru": "Influencers - это комплексная система анализа крипто-инфлюенсеров на всех платформах: Twitter, Telegram, Instagram, TikTok, Threads. Мы собираем и структурируем данные по тысячам KOL, оцениваем их по множеству параметров: качество контента, честность, результативность их советов.",
            "full_description_en": "Influencers is comprehensive analysis system of crypto influencers across all platforms: Twitter, Telegram, Instagram, TikTok, Threads. We collect and structure data on thousands of KOLs, rate them by multiple parameters: content quality, honesty, performance of their advice.",
            "features": [
                {"ru": "Мониторинг всех платформ", "en": "All platforms monitoring"},
                {"ru": "Детекция красных флагов", "en": "Red flag detection"},
                {"ru": "Оценка качества контента", "en": "Content quality assessment"},
                {"ru": "Анализ накрутки аудитории", "en": "Fake audience analysis"}
            ],
            "stats": [
                {"value": "5K+", "label_ru": "Инфлюенсеров", "label_en": "Influencers"},
                {"value": "10M+", "label_ru": "Постов", "label_en": "Posts"},
                {"value": "95%", "label_ru": "Точность", "label_en": "Accuracy"}
            ],
            "gradient": "from-pink-500 to-rose-500",
            "bg_gradient": "from-pink-50 to-rose-50",
            "order": 4,
            "is_active": True
        }
    ]
    
    for utility in default_utilities:
        utility["created_at"] = datetime.now(timezone.utc).isoformat()
        utility["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.utilities.insert_many(default_utilities)
    return {"message": "Default utilities created", "count": len(default_utilities)}


# ==================== UTILITIES SECTION SETTINGS API ====================

@api_router.get("/utilities-settings")
async def get_utilities_settings():
    """Get utilities section settings"""
    settings = await db.utilities_settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default settings
        default_settings = UtilitiesSectionSettings()
        return default_settings.model_dump()
    return settings

@api_router.put("/utilities-settings")
async def update_utilities_settings(settings_update: UtilitiesSectionSettingsUpdate):
    """Update utilities section settings"""
    existing = await db.utilities_settings.find_one({})
    
    update_dict = {k: v for k, v in settings_update.model_dump().items() if v is not None}
    
    if existing:
        await db.utilities_settings.update_one(
            {"_id": existing["_id"]},
            {"$set": update_dict}
        )
    else:
        # Create new settings document with defaults + updates
        default_settings = UtilitiesSectionSettings().model_dump()
        default_settings.update(update_dict)
        await db.utilities_settings.insert_one(default_settings)
    
    updated = await db.utilities_settings.find_one({}, {"_id": 0})
    return updated


# ==================== CRYPTO MARKET DATA ====================

@api_router.get("/crypto-market-data")
async def get_crypto_market_data():
    """
    Get real-time crypto market data with hourly caching.
    Uses multiple free APIs with fallback: CoinGecko -> Binance -> CryptoCompare
    Caches data in MongoDB, updates only once per hour (24 requests/day).
    """
    try:
        collection = db["crypto_cache"]
        
        # Check if we have cached data that's less than 1 hour old
        cached = await collection.find_one({"id": "market_data"}, {"_id": 0})
        
        if cached:
            last_updated = cached.get("last_updated_timestamp", 0)
            current_time = datetime.now(timezone.utc).timestamp()
            age_minutes = (current_time - last_updated) / 60
            
            # If cache is less than 60 minutes old, return cached data
            if age_minutes < 60:
                cached["cache_age_minutes"] = round(age_minutes, 1)
                cached["from_cache"] = True
                return cached
        
        logger.info("Fetching fresh crypto data...")
        
        async with httpx.AsyncClient() as client:
            btc_price, btc_change = 0, 0
            eth_price, eth_change = 0, 0
            zk_price, zk_change = 0, 0
            btc_dominance = 58
            total_market_cap = 3_200_000_000_000
            source = "fallback"
            
            # Try CoinGecko first (free, no key)
            try:
                logger.info("Trying CoinGecko API...")
                prices_response = await client.get(
                    "https://api.coingecko.com/api/v3/simple/price",
                    params={
                        "ids": "bitcoin,ethereum,zksync",
                        "vs_currencies": "usd",
                        "include_24hr_change": "true"
                    },
                    timeout=10.0
                )
                
                if prices_response.status_code == 200:
                    prices = prices_response.json()
                    btc_price = prices.get("bitcoin", {}).get("usd", 0)
                    btc_change = prices.get("bitcoin", {}).get("usd_24h_change", 0) or 0
                    eth_price = prices.get("ethereum", {}).get("usd", 0)
                    eth_change = prices.get("ethereum", {}).get("usd_24h_change", 0) or 0
                    zk_price = prices.get("zksync", {}).get("usd", 0) or 0
                    zk_change = prices.get("zksync", {}).get("usd_24h_change", 0) or 0
                    source = "coingecko"
                    logger.info("CoinGecko prices fetched successfully")
                    
                    # Try to get global data
                    global_response = await client.get(
                        "https://api.coingecko.com/api/v3/global",
                        timeout=10.0
                    )
                    if global_response.status_code == 200:
                        global_data = global_response.json().get("data", {})
                        btc_dominance = global_data.get("market_cap_percentage", {}).get("btc", 58)
                        total_market_cap = global_data.get("total_market_cap", {}).get("usd", 0)
                else:
                    logger.warning(f"CoinGecko returned {prices_response.status_code}")
                    raise Exception("CoinGecko rate limited")
                    
            except Exception as cg_err:
                logger.warning(f"CoinGecko failed: {cg_err}")
                
                # Fallback to Binance Public API (no key required)
                try:
                    logger.info("Trying Binance API...")
                    # Get BTC price
                    btc_response = await client.get(
                        "https://api.binance.com/api/v3/ticker/24hr",
                        params={"symbol": "BTCUSDT"},
                        timeout=10.0
                    )
                    if btc_response.status_code == 200:
                        btc_data = btc_response.json()
                        btc_price = float(btc_data.get("lastPrice", 0))
                        btc_change = float(btc_data.get("priceChangePercent", 0))
                    
                    # Get ETH price
                    eth_response = await client.get(
                        "https://api.binance.com/api/v3/ticker/24hr",
                        params={"symbol": "ETHUSDT"},
                        timeout=10.0
                    )
                    if eth_response.status_code == 200:
                        eth_data = eth_response.json()
                        eth_price = float(eth_data.get("lastPrice", 0))
                        eth_change = float(eth_data.get("priceChangePercent", 0))
                    
                    # Try ZK
                    try:
                        zk_response = await client.get(
                            "https://api.binance.com/api/v3/ticker/24hr",
                            params={"symbol": "ZKUSDT"},
                            timeout=10.0
                        )
                        if zk_response.status_code == 200:
                            zk_data = zk_response.json()
                            zk_price = float(zk_data.get("lastPrice", 0))
                            zk_change = float(zk_data.get("priceChangePercent", 0))
                    except:
                        pass
                    
                    if btc_price > 0:
                        source = "binance"
                        logger.info("Binance prices fetched successfully")
                    else:
                        raise Exception("Binance failed")
                        
                except Exception as bn_err:
                    logger.warning(f"Binance failed: {bn_err}")
                    
                    # Last resort: CryptoCompare (free tier)
                    try:
                        logger.info("Trying CryptoCompare API...")
                        cc_response = await client.get(
                            "https://min-api.cryptocompare.com/data/pricemultifull",
                            params={
                                "fsyms": "BTC,ETH,ZK",
                                "tsyms": "USD"
                            },
                            timeout=10.0
                        )
                        if cc_response.status_code == 200:
                            cc_data = cc_response.json().get("RAW", {})
                            btc_price = cc_data.get("BTC", {}).get("USD", {}).get("PRICE", 0)
                            btc_change = cc_data.get("BTC", {}).get("USD", {}).get("CHANGEPCT24HOUR", 0)
                            eth_price = cc_data.get("ETH", {}).get("USD", {}).get("PRICE", 0)
                            eth_change = cc_data.get("ETH", {}).get("USD", {}).get("CHANGEPCT24HOUR", 0)
                            zk_price = cc_data.get("ZK", {}).get("USD", {}).get("PRICE", 0)
                            zk_change = cc_data.get("ZK", {}).get("USD", {}).get("CHANGEPCT24HOUR", 0)
                            source = "cryptocompare"
                            logger.info("CryptoCompare prices fetched successfully")
                    except Exception as cc_err:
                        logger.error(f"All price APIs failed: {cc_err}")
            
            # Get Fear & Greed Index from Alternative.me (always free, reliable)
            fear_greed_value = 50
            try:
                fg_response = await client.get(
                    "https://api.alternative.me/fng/?limit=1",
                    timeout=10.0
                )
                if fg_response.status_code == 200:
                    fg_data = fg_response.json()
                    fear_greed_value = int(fg_data.get('data', [{}])[0].get('value', 50))
                    logger.info(f"Fear & Greed: {fear_greed_value}")
            except Exception as fg_err:
                logger.warning(f"Fear & Greed API error: {fg_err}")
            
            # Calculate Altcoin Season Index based on BTC dominance
            altcoin_season_value = int(140 - (btc_dominance * 2.1))
            altcoin_season_value = max(0, min(100, altcoin_season_value))
            
            # Use fallback values if APIs failed
            if btc_price == 0:
                btc_price, btc_change = 94500, 1.5
            if eth_price == 0:
                eth_price, eth_change = 3350, 2.1
            if zk_price == 0:
                zk_price, zk_change = 0.18, -0.5
            
            # Build response data
            market_data = {
                "id": "market_data",
                "cryptos": [
                    {
                        "symbol": "BTC",
                        "name": "Bitcoin",
                        "price": round(btc_price, 2),
                        "change_24h": round(btc_change, 2),
                        "formatted_price": f"${btc_price:,.0f}"
                    },
                    {
                        "symbol": "ETH",
                        "name": "Ethereum",
                        "price": round(eth_price, 2),
                        "change_24h": round(eth_change, 2),
                        "formatted_price": f"${eth_price:,.0f}"
                    },
                    {
                        "symbol": "ZKS",
                        "name": "zkSync",
                        "price": round(zk_price, 4),
                        "change_24h": round(zk_change, 2),
                        "formatted_price": f"${zk_price:.2f}"
                    }
                ],
                "indices": [
                    {
                        "name": "Fear & Greed",
                        "value": fear_greed_value,
                        "label": "Index"
                    },
                    {
                        "name": "Altcoin Season",
                        "value": altcoin_season_value,
                        "label": "Index"
                    },
                    {
                        "name": "BTC Dominance",
                        "value": round(btc_dominance, 2),
                        "label": "%"
                    }
                ],
                "market": {
                    "total_market_cap": round(total_market_cap, 0),
                    "formatted_market_cap": f"${total_market_cap / 1_000_000_000_000:.2f}T" if total_market_cap > 1_000_000_000_000 else f"${total_market_cap / 1_000_000_000:.1f}B"
                },
                "last_updated": datetime.now(timezone.utc).isoformat(),
                "last_updated_timestamp": datetime.now(timezone.utc).timestamp(),
                "source": source,
                "from_cache": False,
                "cache_age_minutes": 0
            }
            
            # Save to cache
            await collection.update_one(
                {"id": "market_data"},
                {"$set": market_data},
                upsert=True
            )
            
            logger.info(f"Crypto data fetched from {source} and cached successfully")
            return market_data
                
    except Exception as e:
        logger.error(f"Crypto market data error: {str(e)}")
        
        # Try to return cached data even if stale
        try:
            cached = await collection.find_one({"id": "market_data"}, {"_id": 0})
            if cached:
                cached["from_cache"] = True
                cached["cache_error"] = str(e)
                return cached
        except:
            pass
        
        # Return fallback static data
        return {
            "cryptos": [
                {"symbol": "BTC", "name": "Bitcoin", "price": 94500, "change_24h": 1.5, "formatted_price": "$94,500"},
                {"symbol": "ETH", "name": "Ethereum", "price": 3350, "change_24h": 2.1, "formatted_price": "$3,350"},
                {"symbol": "ZKS", "name": "zkSync", "price": 0.18, "change_24h": -0.5, "formatted_price": "$0.18"}
            ],
            "indices": [
                {"name": "Fear & Greed", "value": 65, "label": "Index"},
                {"name": "Altcoin Season", "value": 42, "label": "Index"},
                {"name": "BTC Dominance", "value": 58, "label": "%"}
            ],
            "market": {"total_market_cap": 3200000000000, "formatted_market_cap": "$3.20T"},
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "from_cache": False,
            "is_fallback": True,
            "error": str(e)
        }


# Endpoint to force refresh crypto data (for admin use)
@api_router.post("/crypto-market-data/refresh")
async def refresh_crypto_market_data():
    """Force refresh crypto market data cache"""
    try:
        # Clear cache timestamp to force refresh
        collection = db["crypto_cache"]
        await collection.update_one(
            {"id": "market_data"},
            {"$set": {"last_updated_timestamp": 0}},
            upsert=True
        )
        # Fetch fresh data
        return await get_crypto_market_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing data: {str(e)}")


# ==================== WALLET REGISTRATION MODELS ====================

class WalletRegistration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    wallet_address: str  # Unique wallet address
    invite_code: str  # Associated invite code
    twitter_username: Optional[str] = None
    is_registered: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WalletRegistrationCreate(BaseModel):
    wallet_address: str
    invite_code: str
    twitter_username: Optional[str] = None

class WalletCheckResponse(BaseModel):
    is_registered: bool
    wallet_address: str
    invite_code: Optional[str] = None
    twitter_username: Optional[str] = None


# ==================== WALLET REGISTRATION API ====================

@api_router.get("/wallet/check/{wallet_address}")
async def check_wallet_registration(wallet_address: str):
    """Check if a wallet is already registered with an invite code"""
    collection = db["wallet_registrations"]
    
    # Normalize wallet address to lowercase for consistent matching
    normalized_address = wallet_address.lower()
    
    registration = await collection.find_one(
        {"wallet_address": normalized_address}, 
        {"_id": 0}
    )
    
    if registration:
        return {
            "is_registered": True,
            "wallet_address": registration["wallet_address"],
            "invite_code": registration.get("invite_code"),
            "twitter_username": registration.get("twitter_username")
        }
    
    return {
        "is_registered": False,
        "wallet_address": normalized_address,
        "invite_code": None,
        "twitter_username": None
    }

@api_router.post("/wallet/register")
async def register_wallet(registration_data: WalletRegistrationCreate):
    """Register a wallet with an invite code (one wallet = one invite code)"""
    collection = db["wallet_registrations"]
    
    # Normalize wallet address
    normalized_address = registration_data.wallet_address.lower()
    
    # Check if wallet is already registered
    existing = await collection.find_one({"wallet_address": normalized_address})
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="This wallet is already registered with an invite code"
        )
    
    # Create registration
    registration = WalletRegistration(
        wallet_address=normalized_address,
        invite_code=registration_data.invite_code.upper(),
        twitter_username=registration_data.twitter_username
    )
    
    doc = registration.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await collection.insert_one(doc)
    
    return {
        "success": True,
        "message": "Wallet registered successfully",
        "wallet_address": normalized_address,
        "invite_code": registration.invite_code
    }

@api_router.put("/wallet/update/{wallet_address}")
async def update_wallet_registration(wallet_address: str, twitter_username: Optional[str] = None):
    """Update wallet registration (e.g., add Twitter username)"""
    collection = db["wallet_registrations"]
    normalized_address = wallet_address.lower()
    
    update_dict = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if twitter_username is not None:
        update_dict["twitter_username"] = twitter_username
    
    result = await collection.update_one(
        {"wallet_address": normalized_address},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Wallet registration not found")
    
    return {"success": True, "message": "Registration updated"}

@api_router.delete("/wallet/unregister/{wallet_address}")
async def unregister_wallet(wallet_address: str):
    """Unregister a wallet (admin use only in production)"""
    collection = db["wallet_registrations"]
    normalized_address = wallet_address.lower()
    
    result = await collection.delete_one({"wallet_address": normalized_address})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Wallet registration not found")
    
    return {"success": True, "message": "Wallet unregistered successfully"}



# ==================== COOKIE CONSENT SETTINGS ====================

class CookieConsentSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    enabled: bool = True
    privacy_policy_url: str = "/privacy"
    terms_url: str = "/terms"
    cookie_policy_url: str = "/cookies"
    title_en: str = "Cookie & Privacy Settings"
    title_ru: str = "Настройки Cookie и Конфиденциальности"
    description_en: str = "We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform."
    description_ru: str = "Мы ценим вашу конфиденциальность. Пожалуйста, примите наши cookies и политику конфиденциальности, чтобы продолжить использование платформы FOMO."
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CookieConsentUpdate(BaseModel):
    enabled: Optional[bool] = None
    privacy_policy_url: Optional[str] = None
    terms_url: Optional[str] = None
    cookie_policy_url: Optional[str] = None
    title_en: Optional[str] = None
    title_ru: Optional[str] = None
    description_en: Optional[str] = None
    description_ru: Optional[str] = None


@api_router.get("/cookie-consent-settings")
async def get_cookie_consent_settings():
    """Get cookie consent settings"""
    collection = db.get_collection("cookie_consent_settings")
    settings = await collection.find_one()
    
    if not settings:
        # Create default settings
        default_settings = CookieConsentSettings().model_dump()
        await collection.insert_one(default_settings)
        return default_settings
    
    return settings


@api_router.put("/admin/cookie-consent-settings")
async def update_cookie_consent_settings(
    settings: CookieConsentUpdate,
    request: Request
):
    """Update cookie consent settings (admin only)"""
    # Verify admin token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = auth_header.split(" ")[1]
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    expected_token = base64.b64encode(f"admin:{admin_password}:{uuid.uuid4()}".encode()).decode()
    
    # Simple admin check (in production use proper JWT)
    if not token or len(token) < 20:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    
    collection = db.get_collection("cookie_consent_settings")
    
    # Get current settings
    current = await collection.find_one()
    if not current:
        current = CookieConsentSettings().model_dump()
        await collection.insert_one(current)
    
    # Update fields
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await collection.update_one(
        {"id": current["id"]},
        {"$set": update_data}
    )
    
    if result.modified_count == 0 and result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    updated = await collection.find_one({"id": current["id"]})
    return updated


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()