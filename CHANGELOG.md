# FOMO Platform - Повна документація / Complete Documentation

> **Репозиторій:** https://github.com/Dima434444/FINAL01  
> **Версія:** 1.2.0  
> **Дата:** 29 грудня 2025

---

## 📋 Зміст / Contents

1. [Огляд проекту](#1-огляд-проекту)
2. [Архітектура системи](#2-архітектура-системи)
3. [Швидкий старт](#3-швидкий-старт)
4. [Функціональність](#4-функціональність)
5. [Інтеграції](#5-інтеграції)
6. [База даних](#6-база-даних)
7. [API Документація](#7-api-документація)
8. [Адмін-панель](#8-адмін-панель)
9. [Мобільна адаптивність](#9-мобільна-адаптивність)
10. [Деплоймент](#10-деплоймент)

---

## 1. Огляд проекту

### Що таке FOMO Platform?

FOMO - це криптовалютна аналітична платформа з такими можливостями:
- 📊 Відстеження цін криптовалют (BTC, ETH, ZK)
- 🏆 Система рівнів Evolution та бейджів
- 👥 Команда та партнери
- 🗺️ Roadmap проекту
- 💼 Утиліти та екосистема
- 🔐 Підключення гаманця через Dynamic.xyz

### Технологічний стек

| Компонент | Технологія |
|-----------|------------|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python 3.11) |
| Database | MongoDB |
| Wallet | Dynamic.xyz SDK |
| Animations | Framer Motion |

---

## 2. Архітектура системи

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FOMO PLATFORM ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐ │
│   │    FRONTEND     │     │     BACKEND      │     │   DATABASE  │ │
│   │   React App     │────▶│   FastAPI App    │────▶│   MongoDB   │ │
│   │   Port: 3000    │     │   Port: 8001     │     │  Port: 27017│ │
│   └─────────────────┘     └──────────────────┘     └─────────────┘ │
│          │                        │                                 │
│          │                        │                                 │
│   ┌──────▼──────┐          ┌──────▼──────┐                         │
│   │ Dynamic.xyz │          │ Crypto API  │                         │
│   │   Wallet    │          │  (Prices)   │                         │
│   └─────────────┘          └─────────────┘                         │
│                                                                     │
│   COMPONENTS:                                                       │
│   ├── LoadingScreen.js    - Анімований екран завантаження         │
│   ├── CookieConsent.js    - Банер згоди з cookies                  │
│   ├── InviteModal.js      - Модалка реєстрації з гаманцем         │
│   └── AdminDashboard.js   - Адміністративна панель                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Структура файлів

```
/app/
├── backend/
│   ├── server.py              # FastAPI сервер
│   ├── requirements.txt       # Python залежності
│   └── .env                   # Конфігурація
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Головний компонент
│   │   ├── App.css            # Стилі
│   │   ├── components/
│   │   │   ├── LoadingScreen.js        # Екран завантаження
│   │   │   ├── CookieConsent.js        # Cookie банер
│   │   │   ├── InviteModal.js          # Модалка гаманця
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.js   # Адмін панель
│   │   │       └── sections/           # Секції адмінки
│   │   └── styles/
│   │       ├── mobile.css              # Базові мобільні стилі
│   │       └── mobile-bug-fixes.css    # Фікси мобільних багів
│   ├── package.json
│   └── .env
│
├── scripts/
│   ├── init_database.py           # Базова ініціалізація
│   ├── init_full_database.py      # Повна ініціалізація з даними
│   ├── init_cookie_consent.py     # Ініціалізація Cookie Consent
│   └── database_seed.json         # Seed дані для бази
│
└── docs/
    ├── CHANGELOG.md               # Цей файл
    ├── DEPLOYMENT_GUIDE.md        # Гайд по деплою
    └── QUICK_DEPLOY.md            # Швидкий старт
```

---

## 3. Швидкий старт

### Крок 1: Клонування репозиторію

```bash
git clone https://github.com/Dima434444/FINAL01.git
cd FINAL01
```

### Крок 2: Налаштування Backend

```bash
cd backend

# Створення віртуального середовища
python -m venv venv
source venv/bin/activate  # Linux/Mac
# або venv\Scripts\activate  # Windows

# Встановлення залежностей
pip install -r requirements.txt

# Створення .env файлу
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=fomo_db
ADMIN_PASSWORD=your_secure_password_here
CORS_ORIGINS=*
EOF
```

### Крок 3: Налаштування Frontend

```bash
cd frontend

# Встановлення залежностей
yarn install

# Створення .env файлу
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
```

### Крок 4: Ініціалізація бази даних

```bash
cd scripts

# Повна ініціалізація з усіма даними
python init_full_database.py

# Або тільки Cookie Consent
python init_cookie_consent.py
```

### Крок 5: Запуск сервісів

```bash
# Backend (термінал 1)
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (термінал 2)
cd frontend
yarn start
```

### Крок 6: Перевірка

1. Відкрийте http://localhost:3000
2. Дочекайтесь Loading Screen (2.5 сек)
3. Прийміть Cookie Consent
4. Перегляньте сайт
5. Увійдіть в адмін-панель (пароль з .env)

---

## 4. Функціональність

### 4.1 Loading Screen

**Файл:** `/frontend/src/components/LoadingScreen.js`

Анімований екран завантаження з:
- 🚀 Плаваюча ракета
- 💎 Діамант
- 📈 Графік
- ⭕ Орбітальні кільця
- 📊 Progress bar з відсотками

**Налаштування:**
```jsx
<LoadingScreen 
  onLoadingComplete={() => setIsLoading(false)}
  minDuration={2500}  // тривалість в мс
/>
```

### 4.2 Cookie Consent

**Файли:**
- `/frontend/src/components/CookieConsent.js` - Банер
- `/frontend/src/components/admin/sections/CookieConsentSection.js` - Адмін
- `/backend/server.py` - API endpoints

**Функції:**
- Банер з двома чекбоксами (Cookies + Privacy)
- Модальні вікна з політиками
- Управління з адмін-панелі
- Збереження згоди в localStorage

**API:**
```
GET  /api/cookie-consent-settings     - Отримати налаштування
PUT  /api/admin/cookie-consent-settings - Оновити (потрібна авторизація)
```

### 4.3 Invite Modal (Wallet Connection)

**Файл:** `/frontend/src/components/InviteModal.js`

Модальне вікно реєстрації з Dynamic.xyz для підключення криптогаманця.

**Кроки реєстрації:**
1. **Connect Wallet** - підключення гаманця через Dynamic.xyz
2. **Enter Invite Code** - введення інвайт-коду
3. **Connect Twitter** - підключення Twitter (опціонально)
4. **Complete** - завершення реєстрації

**Підтримувані гаманці:**
- MetaMask
- WalletConnect
- Coinbase Wallet
- І інші через Dynamic.xyz

**Налаштування Dynamic.xyz:**

```javascript
// В InviteModal.js
const DYNAMIC_ENVIRONMENT_ID = 'your-dynamic-environment-id';

// Конфігурація
const dynamicSettings = {
  environmentId: DYNAMIC_ENVIRONMENT_ID,
  walletConnectors: [EthereumWalletConnectors]
};
```

**API для гаманців:**
```
GET  /api/wallet/check/{address}  - Перевірка реєстрації гаманця
POST /api/wallet/register         - Реєстрація гаманця
```

**Структура реєстрації:**
```json
{
  "wallet_address": "0x...",
  "invite_code": "ABC123",
  "twitter_handle": "@user",
  "registered_at": "2025-12-29T10:00:00Z"
}
```

---

## 5. Інтеграції

### 5.1 Dynamic.xyz (Wallet Connection)

**Встановлення:**
```bash
yarn add @dynamic-labs/sdk-react-core @dynamic-labs/ethereum
```

**Використання:**
```jsx
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

// Обгортка
<DynamicContextProvider settings={dynamicSettings}>
  <YourComponent />
</DynamicContextProvider>

// Всередині компонента
const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext();
```

**Отримання даних гаманця:**
```javascript
const walletAddress = primaryWallet?.address;
const isConnected = !!primaryWallet;
```

### 5.2 Framer Motion (Animations)

**Встановлення:**
```bash
yarn add framer-motion
```

**Приклади використання:**

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Анімація появи
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Цикл анімації
<motion.div
  animate={{ 
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0]
  }}
  transition={{ 
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
>
  Floating element
</motion.div>
```

---

## 6. База даних

### 6.1 Колекції MongoDB

| Колекція | Опис | Документів |
|----------|------|------------|
| `team_members` | Члени команди | 6 |
| `partners` | Партнери | 7 |
| `faq_items` | FAQ питання | 8 |
| `evolution_levels` | Рівні Evolution | 6 |
| `evolution_badges` | Бейджі | 9 |
| `utility_nav_buttons` | Кнопки навігації | 3 |
| `cookie_consent_settings` | Налаштування Cookie | 1 |
| `hero_settings` | Hero секція | 1 |
| `about_settings` | About секція | 1 |
| `footer_settings` | Footer | 1 |
| `platform_settings` | Platform секція | 1 |
| `community_settings` | Community | 1 |
| `roadmap_settings` | Roadmap | 1 |
| `utilities` | Утиліти | 4 |
| `drawer_cards` | Ecosystem карточки | 4 |
| `wallet_registrations` | Зареєстровані гаманці | N |

### 6.2 Схеми документів

**team_members:**
```json
{
  "id": "uuid",
  "name_en": "John Doe",
  "position_en": "CEO",
  "bio_en": "Description...",
  "image_url": "https://...",
  "social_links": {
    "twitter": "https://twitter.com/...",
    "linkedin": "https://linkedin.com/..."
  },
  "displayed_socials": ["twitter", "linkedin"],
  "member_type": "team",
  "order": 1
}
```

**evolution_levels:**
```json
{
  "id": "uuid",
  "rank": "Beginner",
  "fomo_score_min": 0,
  "fomo_score_max": 100,
  "next_level": "Intermediate",
  "description": "Starting level",
  "animation_type": "pulse",
  "gradient_from": "#10b981",
  "gradient_to": "#34d399",
  "order": 1
}
```

**cookie_consent_settings:**
```json
{
  "id": "uuid",
  "enabled": true,
  "title_en": "Cookie & Privacy Settings",
  "description_en": "We value your privacy...",
  "cookie_policy_content": "COOKIE POLICY...",
  "privacy_policy_content": "PRIVACY POLICY...",
  "terms_content": "TERMS OF USE..."
}
```

### 6.3 Ініціалізація бази

```bash
# Повна ініціалізація з усіма даними
python scripts/init_full_database.py

# Скидання та повторна ініціалізація
python scripts/init_full_database.py --reset
```

---

## 7. API Документація

### 7.1 Публічні endpoints

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/` | Health check |
| GET | `/api/crypto-prices` | Ціни BTC, ETH, ZK |
| GET | `/api/team-members` | Команда |
| GET | `/api/partners` | Партнери |
| GET | `/api/faq` | FAQ |
| GET | `/api/utilities` | Утиліти |
| GET | `/api/evolution-levels` | Рівні Evolution |
| GET | `/api/evolution-badges` | Бейджі |
| GET | `/api/utility-nav-buttons` | Кнопки навігації |
| GET | `/api/cookie-consent-settings` | Cookie налаштування |

### 7.2 Wallet endpoints

| Method | Endpoint | Опис |
|--------|----------|------|
| GET | `/api/wallet/check/{address}` | Перевірка реєстрації |
| POST | `/api/wallet/register` | Реєстрація гаманця |

### 7.3 Admin endpoints

| Method | Endpoint | Опис |
|--------|----------|------|
| POST | `/api/admin/login` | Авторизація |
| PUT | `/api/admin/{section}` | Оновлення секції |
| PUT | `/api/admin/cookie-consent-settings` | Оновлення Cookie |

---

## 8. Адмін-панель

### 8.1 Доступ

- **URL:** `/admin` або іконка ⚙️ в header
- **Пароль:** значення `ADMIN_PASSWORD` з `backend/.env`

### 8.2 Секції

| Секція | Опис |
|--------|------|
| 🏠 Hero | Головний банер |
| 📝 About | Секція "Про нас" |
| 🛠️ Utilities | Утиліти |
| 📊 Platform | Platform статистика |
| 🎮 Evolution | Levels & Badges |
| 🌐 Ecosystem | Drawer карточки |
| 🗺️ Roadmap | Дорожня карта |
| 👥 Team | Команда |
| 🤝 Partners | Партнери |
| 💬 Community | Community секція |
| 🦶 Footer | Футер |
| ❓ FAQ | Питання-відповіді |
| 🔘 Utility Nav | Кнопки навігації |
| 📈 Analytics | Аналітика |
| 🍪 Cookie Consent | Cookie банер та політики |

### 8.3 Cookie Consent секція

**Вкладки:**
1. ⚙️ **General Settings** - Enable/Disable, заголовок, опис
2. 🍪 **Cookie Policy** - Текст Cookie Policy
3. 🔒 **Privacy Policy** - Текст Privacy Policy
4. 📄 **Terms of Use** - Текст Terms of Use

---

## 9. Мобільна адаптивність

### 9.1 Виправлені баги

Всі 20 багів з `MOBILE_BUGS.md` виправлені в `/frontend/src/styles/mobile-bug-fixes.css`:

**Критичні (BUG-001 — BUG-006):**
- Header crypto prices overflow
- Utility nav buttons
- Evolution cards sizing
- Utilities/Team/Footer grids

**Середні (BUG-007 — BUG-014):**
- Hero buttons overlap
- Blob animations
- Partners tabs
- FAQ paddings
- Roadmap timeline
- Mobile menu

**Низькі (BUG-015 — BUG-020):**
- Typography
- Touch targets
- Social icons
- Overflow handling

### 9.2 Горизонтальний скролл

Секції з горизонтальним скролом на мобільному:
- FAQ карточки
- Team карточки
- Partners карточки
- Evolution карточки

### 9.3 Breakpoints

```css
/* Galaxy Fold */
@media (max-width: 320px) { }

/* iPhone SE, 12 mini */
@media (max-width: 375px) { }

/* Large mobile */
@media (max-width: 425px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop */
@media (min-width: 769px) { }
```

---

## 10. Деплоймент

### 10.1 Локальний деплоймент

```bash
# 1. Клонування
git clone https://github.com/Dima434444/FINAL01.git

# 2. Backend
cd backend
pip install -r requirements.txt
# Налаштувати .env

# 3. Frontend
cd frontend
yarn install
# Налаштувати .env

# 4. Database
cd scripts
python init_full_database.py

# 5. Запуск
# Backend: uvicorn server:app --port 8001
# Frontend: yarn start
```

### 10.2 Production деплоймент

**Необхідні кроки:**
1. Змінити `ADMIN_PASSWORD` на безпечний
2. Налаштувати MongoDB Atlas або власний сервер
3. Оновити `REACT_APP_BACKEND_URL` на production URL
4. Налаштувати CORS в backend
5. Додати SSL сертифікат

**Змінні середовища для production:**

```env
# Backend
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/fomo_db
DB_NAME=fomo_db
ADMIN_PASSWORD=super_secure_password_123
CORS_ORIGINS=https://yourdomain.com

# Frontend
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### 10.3 Перевірка деплою

```bash
# Перевірка API
curl https://api.yourdomain.com/api/

# Перевірка Cookie Consent
curl https://api.yourdomain.com/api/cookie-consent-settings

# Перевірка бази
python -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
async def check():
    client = AsyncIOMotorClient('your_mongo_url')
    db = client.fomo_db
    for coll in await db.list_collection_names():
        count = await db[coll].count_documents({})
        print(f'{coll}: {count}')
asyncio.run(check())
"
```

---

## Changelog

### v1.2.0 (29.12.2025) - Поточна версія

**Нові функції:**
- ✅ Loading Screen з космічною тематикою (світла тема)
- ✅ Cookie Consent з модалками політик
- ✅ Адмін-панель для Cookie Consent
- ✅ Горизонтальний скролл FAQ на мобільному
- ✅ Повний скрипт ініціалізації бази з seed даними

**Виправлення:**
- ✅ 20 мобільних багів з MOBILE_BUGS.md
- ✅ Ecosystem hint приховано на мобільному
- ✅ MongoDB ObjectId serialization

### v1.1.0

- Початкова інтеграція Cookie Consent
- Базові мобільні фікси

### v1.0.0

- Початковий реліз з GitHub

---

## Контакти

**GitHub:** https://github.com/Dima434444/FINAL01

**Документація:**
- `DEPLOYMENT_GUIDE.md` - Повний гайд
- `QUICK_DEPLOY.md` - Швидкий старт
- `MOBILE_BUGS.md` - Список мобільних багів

---

*Документ оновлено: 29 грудня 2025*
