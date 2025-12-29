# FOMO Platform - Документация изменений и инструкция по развёртыванию

**Версия:** 1.0  
**Дата:** 29 декабря 2025  
**Автор:** Emergent AI Agent

---

## Содержание

1. [Обзор изменений](#1-обзор-изменений)
2. [Исправления мобильной адаптивности (20 багов)](#2-исправления-мобильной-адаптивности)
3. [Cookie Consent система](#3-cookie-consent-система)
4. [Структура базы данных](#4-структура-базы-данных)
5. [Инструкция по развёртыванию](#5-инструкция-по-развёртыванию)
6. [Инициализация данных](#6-инициализация-данных)
7. [Конфигурация админ-панели](#7-конфигурация-админ-панели)

---

## 1. Обзор изменений

### Основные компоненты, изменённые в этой сессии:

| Компонент | Файл | Описание |
|-----------|------|----------|
| Mobile Bug Fixes | `/frontend/src/styles/mobile-bug-fixes.css` | CSS исправления для 20 мобильных багов |
| Cookie Consent Banner | `/frontend/src/components/CookieConsent.js` | Баннер согласия с cookies и политиками |
| Cookie Admin Section | `/frontend/src/components/admin/sections/CookieConsentSection.js` | Админ-панель для управления Cookie Consent |
| Backend API | `/backend/server.py` | API endpoints для Cookie Consent настроек |
| App.css | `/frontend/src/App.css` | Импорт CSS файлов с фиксами |

---

## 2. Исправления мобильной адаптивности

### 2.1 Файл: `/frontend/src/styles/mobile-bug-fixes.css`

Этот файл содержит CSS исправления для всех 20 багов из `MOBILE_BUGS.md`.

### 2.2 Список исправленных багов

#### Критические баги (BUG-001 — BUG-006)

| ID | Проблема | Решение |
|----|----------|---------|
| BUG-001 | Crypto prices overflow на мобильных | Скрытие тикера на экранах < 480px, компактный вид на 481-768px |
| BUG-002 | Utility Nav Buttons не адаптированы | Скрытие кнопок на экранах < 768px |
| BUG-003 | Evolution Cards фиксированный размер 288px | Адаптивные размеры: 260px для 375px, 240px для 320px |
| BUG-004 | Utilities Section grid не адаптивный | Flex column на < 480px, 2 колонки на 481-768px |
| BUG-005 | Team Section grid остаётся 3 колонки | Flex column на < 480px, 2 колонки на 481-768px |
| BUG-006 | Footer columns не стекуются | Вертикальное расположение с центрированием |

#### Средние баги (BUG-007 — BUG-014)

| ID | Проблема | Решение |
|----|----------|---------|
| BUG-007 | Hero buttons перекрываются | Flex column на < 375px, полная ширина кнопок |
| BUG-008 | Blob animations слишком большие | Scale 0.5, уменьшенные размеры, opacity 0.3 |
| BUG-009 | Partners tabs слишком маленькие | Min-height 44px, горизонтальный скролл |
| BUG-010 | FAQ section большие отступы | Уменьшенные padding: 16px для < 480px |
| BUG-011 | Roadmap горизонтальный timeline | Вертикальный flex layout |
| BUG-012 | Ecosystem grid не адаптирован | Flex column с gap 1rem |
| BUG-013 | Platform images overflow | Max-width 100%, object-fit contain |
| BUG-014 | Mobile menu некорректное закрытие | Fixed positioning, proper z-index |

#### Низкоприоритетные баги (BUG-015 — BUG-020)

| ID | Проблема | Решение |
|----|----------|---------|
| BUG-015 | Typography фиксированные px | Clamp() для адаптивных шрифтов |
| BUG-016 | Отсутствуют breakpoints 320px/375px | Добавлены специфичные стили |
| BUG-017 | Touch targets слишком маленькие | Min-height/width 44px для всех интерактивных элементов |
| BUG-018 | Evolution cards внутренние отступы | Padding 12px на мобильных |
| BUG-019 | Social icons размер для touch | 24px размер, gap 12px |
| BUG-020 | Overflow hidden злоупотребление | Горизонтальный скролл где нужно, overflow-x hidden для секций |

### 2.3 Подключение CSS файла

В файле `/frontend/src/App.css` добавлен импорт:

```css
/* Import mobile responsive styles */
@import './styles/mobile.css';
@import './styles/mobile-bug-fixes.css';
```

---

## 3. Cookie Consent система

### 3.1 Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                     COOKIE CONSENT FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │   Frontend  │───▶│   Backend    │───▶│   MongoDB     │  │
│  │  Component  │    │     API      │    │   Database    │  │
│  └─────────────┘    └──────────────┘    └───────────────┘  │
│        │                   │                    │          │
│        │                   │                    │          │
│        ▼                   ▼                    ▼          │
│  CookieConsent.js    /api/cookie-       cookie_consent_   │
│  (Banner + Modals)   consent-settings   settings collection│
│                                                             │
│  ┌─────────────┐                                           │
│  │ Admin Panel │───▶ PUT /api/admin/cookie-consent-settings│
│  │   Section   │                                           │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Frontend компонент: CookieConsent.js

**Путь:** `/frontend/src/components/CookieConsent.js`

**Функциональность:**
- Отображение баннера согласия при первом посещении
- Два обязательных чекбокса: Essential Cookies и Privacy Policy & Terms
- Ссылки на политики открывают модальные окна (не внешние URL)
- Текст политик загружается из API
- Блокировка сайта до принятия согласия
- Сохранение согласия в localStorage

**Ключевые состояния:**
```javascript
const [isVisible, setIsVisible] = useState(false);      // Видимость баннера
const [acceptedCookies, setAcceptedCookies] = useState(false);  // Чекбокс cookies
const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);  // Чекбокс privacy
const [showDetails, setShowDetails] = useState(false);  // Развернуть детали
const [settings, setSettings] = useState(null);         // Настройки из API
const [legalModal, setLegalModal] = useState({ isOpen: false, title: '', content: '' });
```

**Модальные окна:**
- Cookie Policy (`settings.cookie_policy_content`)
- Privacy Policy (`settings.privacy_policy_content`)
- Terms of Use (`settings.terms_content`)

### 3.3 Admin Panel: CookieConsentSection.js

**Путь:** `/frontend/src/components/admin/sections/CookieConsentSection.js`

**Вкладки:**
1. **⚙️ General Settings**
   - Enable/Disable toggle
   - Banner Title
   - Banner Description

2. **🍪 Cookie Policy**
   - Textarea для текста Cookie Policy

3. **🔒 Privacy Policy**
   - Textarea для текста Privacy Policy

4. **📄 Terms of Use**
   - Textarea для текста Terms of Use

### 3.4 Backend API Endpoints

**Путь:** `/backend/server.py`

#### GET /api/cookie-consent-settings
Получение текущих настроек Cookie Consent.

**Response:**
```json
{
  "id": "uuid-string",
  "enabled": true,
  "title_en": "Cookie & Privacy Settings",
  "description_en": "We value your privacy...",
  "cookie_policy_content": "COOKIE POLICY...",
  "privacy_policy_content": "PRIVACY POLICY...",
  "terms_content": "TERMS OF USE...",
  "created_at": "2025-12-29T10:00:00Z",
  "updated_at": "2025-12-29T10:00:00Z"
}
```

#### PUT /api/admin/cookie-consent-settings
Обновление настроек (требует авторизации).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "enabled": true,
  "title_en": "Cookie & Privacy Settings",
  "description_en": "...",
  "cookie_policy_content": "...",
  "privacy_policy_content": "...",
  "terms_content": "..."
}
```

### 3.5 Pydantic Models

```python
class CookieConsentSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    enabled: bool = True
    title_en: str = "Cookie & Privacy Settings"
    description_en: str = "We value your privacy..."
    cookie_policy_content: str = ""
    privacy_policy_content: str = ""
    terms_content: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CookieConsentUpdate(BaseModel):
    enabled: Optional[bool] = None
    title_en: Optional[str] = None
    description_en: Optional[str] = None
    cookie_policy_content: Optional[str] = None
    privacy_policy_content: Optional[str] = None
    terms_content: Optional[str] = None
```

---

## 4. Структура базы данных

### 4.1 Collection: `cookie_consent_settings`

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-string",
  "enabled": true,
  "title_en": "Cookie & Privacy Settings",
  "description_en": "We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform.",
  "cookie_policy_content": "COOKIE POLICY\n\nEffective Date: March 15, 2025\n\n1. WHAT ARE COOKIES?...",
  "privacy_policy_content": "PRIVACY POLICY\n\nEffective Date: March 15, 2025\n\n1. INTRODUCTION...",
  "terms_content": "TERMS OF USE\n\nEffective Date: March 15, 2025\n\n1. INTRODUCTION...",
  "created_at": ISODate("2025-12-29T10:00:00.000Z"),
  "updated_at": ISODate("2025-12-29T10:00:00.000Z")
}
```

---

## 5. Инструкция по развёртыванию

### 5.1 Требования

- Node.js >= 16.x
- Python >= 3.9
- MongoDB >= 5.0
- yarn (для frontend)
- pip (для backend)

### 5.2 Шаги развёртывания

#### Шаг 1: Клонирование репозитория
```bash
git clone <repository-url>
cd fomo-platform
```

#### Шаг 2: Установка зависимостей Backend
```bash
cd backend
pip install -r requirements.txt
```

#### Шаг 3: Установка зависимостей Frontend
```bash
cd frontend
yarn install
```

#### Шаг 4: Настройка переменных окружения

**Backend (.env):**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=fomo_db
ADMIN_PASSWORD=your_secure_password
```

**Frontend (.env):**
```env
REACT_APP_BACKEND_URL=https://your-domain.com
```

#### Шаг 5: Инициализация базы данных
```bash
python scripts/init_database.py
python scripts/init_cookie_consent.py  # Новый скрипт (см. ниже)
```

#### Шаг 6: Запуск сервисов
```bash
# Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend
cd frontend
yarn start
```

### 5.3 Проверка развёртывания

1. Откройте сайт в браузере
2. Должен появиться Cookie Consent баннер
3. Нажмите на ссылки "Cookie Policy", "Privacy Policy", "Terms of Use" - должны открыться модалки с текстом
4. Примите согласие, баннер должен исчезнуть
5. Войдите в админ-панель
6. Проверьте раздел "Cookie Consent" - должны быть 4 вкладки

---

## 6. Инициализация данных

### 6.1 Скрипт инициализации Cookie Consent

**Создайте файл:** `/scripts/init_cookie_consent.py`

```python
#!/usr/bin/env python3
"""
Cookie Consent Settings Initialization Script
This script initializes the cookie consent settings with default policy content.
Run this script after database setup for proper deployment.
"""

import asyncio
import os
import uuid
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Default policy content
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


async def init_cookie_consent_settings():
    """Initialize cookie consent settings with default policies."""
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'fomo_db')
    
    print(f"Connecting to MongoDB: {mongo_url}")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    collection = db.cookie_consent_settings
    
    # Check if settings already exist
    existing = await collection.find_one({})
    
    if existing:
        print("Cookie consent settings already exist.")
        print(f"  ID: {existing.get('id')}")
        print(f"  Enabled: {existing.get('enabled')}")
        print(f"  Title: {existing.get('title_en')}")
        
        # Ask if should update
        update = input("Do you want to update the policy content? (y/n): ").lower().strip()
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
            print(f"Updated {result.modified_count} document(s)")
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
    print("✅ Cookie consent settings initialized successfully!")
    print(f"  ID: {new_settings['id']}")
    print(f"  Title: {new_settings['title_en']}")
    print(f"  Cookie Policy: {len(COOKIE_POLICY)} characters")
    print(f"  Privacy Policy: {len(PRIVACY_POLICY)} characters")
    print(f"  Terms of Use: {len(TERMS_CONTENT)} characters")


if __name__ == "__main__":
    asyncio.run(init_cookie_consent_settings())
```

### 6.2 Запуск инициализации

```bash
# Установите переменные окружения
export MONGO_URL="mongodb://localhost:27017"
export DB_NAME="fomo_db"

# Запустите скрипт
python scripts/init_cookie_consent.py
```

---

## 7. Конфигурация админ-панели

### 7.1 Доступ к админ-панели

1. Найдите иконку шестерёнки (⚙️) в header сайта
2. Или прокрутите до footer и найдите ссылку на админку
3. Введите пароль администратора (из переменной `ADMIN_PASSWORD`)

### 7.2 Раздел Cookie Consent

После входа в админ-панель найдите раздел **"🍪 Cookie Consent"**.

**Вкладки:**

| Вкладка | Описание |
|---------|----------|
| ⚙️ General Settings | Включение/выключение баннера, заголовок и описание |
| 🍪 Cookie Policy | Полный текст Cookie Policy для модалки |
| 🔒 Privacy Policy | Полный текст Privacy Policy для модалки |
| 📄 Terms of Use | Полный текст Terms of Use для модалки |

### 7.3 Редактирование политик

1. Перейдите на нужную вкладку (Cookie Policy / Privacy Policy / Terms of Use)
2. Отредактируйте текст в textarea
3. Нажмите кнопку **"Save Settings"**
4. Изменения сразу применятся для всех пользователей

### 7.4 Важные замечания

- **Форматирование:** Текст политик отображается с сохранением переносов строк (white-space: pre-wrap)
- **Язык:** Система поддерживает только английский язык
- **localStorage:** Согласие пользователя сохраняется в `fomo_consent` ключе
- **Очистка согласия:** Для показа баннера заново удалите `localStorage.removeItem('fomo_consent')`

---

## Приложения

### A. Список изменённых файлов

```
/app/
├── backend/
│   └── server.py                    # API endpoints + Pydantic models
├── frontend/
│   ├── src/
│   │   ├── App.css                  # Импорт mobile-bug-fixes.css
│   │   ├── components/
│   │   │   ├── CookieConsent.js     # Новый компонент баннера
│   │   │   └── admin/
│   │   │       └── sections/
│   │   │           └── CookieConsentSection.js  # Админ секция
│   │   └── styles/
│   │       └── mobile-bug-fixes.css  # CSS исправления мобильных багов
│   └── package.json                  # Добавлен framer-motion
└── scripts/
    └── init_cookie_consent.py        # Скрипт инициализации (создать)
```

### B. Зависимости

**Frontend (package.json):**
```json
{
  "dependencies": {
    "framer-motion": "^10.x.x"
  }
}
```

**Backend (requirements.txt):**
```
fastapi
motor
pydantic
python-dotenv
```

### C. Тестирование после развёртывания

```bash
# Проверка API
curl http://localhost:8001/api/cookie-consent-settings

# Ожидаемый ответ:
{
  "id": "...",
  "enabled": true,
  "title_en": "Cookie & Privacy Settings",
  "description_en": "...",
  "cookie_policy_content": "COOKIE POLICY...",
  "privacy_policy_content": "PRIVACY POLICY...",
  "terms_content": "TERMS OF USE...",
  ...
}
```

---

## Контакты и поддержка

При возникновении проблем с развёртыванием:
1. Проверьте логи backend: `tail -f /var/log/supervisor/backend.err.log`
2. Проверьте логи frontend: `tail -f /var/log/supervisor/frontend.err.log`
3. Убедитесь, что MongoDB запущена и доступна
4. Проверьте переменные окружения в `.env` файлах

---

*Документ создан автоматически. Последнее обновление: 29 декабря 2025*
