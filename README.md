# FOMO - Crypto Analytics Platform

![FOMO Platform](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop)

> **Версія / Version:** 1.2.0  
> **Оновлено / Updated:** 29 грудня 2025

## 🚀 Огляд / Overview

**FOMO** — комплексна платформа криптоаналітики з:
- 📊 Відстеження цін криптовалют у реальному часі (BTC, ETH, ZK)
- 🎮 Геймифікована система Evolution (рівні та бейджі)
- 💼 Підключення гаманця через Dynamic.xyz
- 🍪 Cookie Consent з модальними політиками
- 🎨 Loading Screen з космічною тематикою
- 📱 Повна мобільна адаптивність

## 📋 Зміст / Contents

- [Швидкий старт](#-швидкий-старт)
- [Технології](#-технології)
- [Структура проекту](#-структура-проекту)
- [Документація](#-документація)
- [Нові функції v1.2](#-нові-функції-v12)

## ⚡ Швидкий старт / Quick Start

### 1. Клонування
```bash
git clone https://github.com/Dima434444/FINAL01.git
cd FINAL01
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt

# Створити .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=fomo_db
CORS_ORIGINS=*
ADMIN_PASSWORD=your_secure_password
EOF

# Запустити
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 3. Frontend
```bash
cd frontend
yarn install

# Створити .env
cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

# Запустити
yarn start
```

### 4. Ініціалізація бази даних (ВАЖЛИВО!)
```bash
cd scripts

# Повна ініціалізація з усіма даними (команда, партнери, FAQ, Evolution, Cookie Consent)
python init_full_database.py

# Перевірка
python -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
async def check():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.fomo_db
    for coll in await db.list_collection_names():
        count = await db[coll].count_documents({})
        print(f'{coll}: {count} docs')
asyncio.run(check())
"
```
echo 'REACT_APP_BACKEND_URL="http://localhost:8001/api"' > .env

# Запустить
yarn start
```

### 4. Инициализация данных
```bash
cd scripts
python init_database.py
python init_cookie_consent.py  # Cookie Consent с политиками
```

## 🛠 Технологии

| Компонент | Технология |
|-----------|------------|
| Backend | FastAPI, Python 3.11 |
| Frontend | React 18, TailwindCSS |
| Database | MongoDB |
| UI Components | Shadcn/ui, Radix UI |
| API | RESTful, CoinGecko |

## 📁 Структура проекта

```
/app/
├── backend/
│   ├── server.py          # FastAPI сервер
│   ├── requirements.txt   # Python зависимости
│   └── .env               # Конфигурация
├── frontend/
│   ├── src/
│   │   ├── App.js         # Главный компонент
│   │   ├── App.css        # Стили
│   │   └── components/    # React компоненты
│   ├── package.json       # NPM зависимости
│   └── .env               # Конфигурация
├── scripts/
│   ├── init_database.py   # Скрипт инициализации БД
│   └── init_data/         # Дефолтные данные
├── DEPLOYMENT.md          # Руководство по развертыванию
├── CHANGELOG.md           # Журнал изменений
└── README.md              # Этот файл
```

## 📚 Документация

| Документ | Описание |
|----------|----------|
| [CHANGELOG.md](CHANGELOG.md) | **Журнал изменений v1.1.0** - Cookie Consent, Mobile Fixes |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Полное руководство по развертыванию |
| [QUICK_DEPLOY.md](QUICK_DEPLOY.md) | Краткая инструкция для быстрого старта |
| [MOBILE_BUGS.md](MOBILE_BUGS.md) | Список мобильных багов и их статус |

## 🔐 Админ-панель

- **URL**: `/admin`
- **Пароль**: значение `ADMIN_PASSWORD` из backend/.env

### Доступные секции:
- Hero, About, Utilities, Platform
- Evolution (Levels & Badges)
- Ecosystem, Roadmap, Team
- Partners, Community, Footer, FAQ
- Utility Nav Buttons, Analytics
- **🍪 Cookie Consent** — управление баннером и политиками

## 🎯 Ключевые особенности

### Криптовалюты
- **BTC** (Bitcoin)
- **ETH** (Ethereum)
- **ZK** (zkSync) — не Solana!

### User Evolution System
- **6 Levels**: от Stellar Awakening до Universal Enlightenment
- **9 Badges**: от XP Pioneer до Singularity
- Горизонтальный скролл карточек 288x158px

### Crypto Trading Tools
- Portfolio Tracker
- Price Alerts
- Whale Tracker
- NFT Scanner

## 🌐 API Endpoints

```
GET  /api/                         # Health check
GET  /api/crypto-prices            # Цены BTC, ETH, ZK
GET  /api/team-members             # Команда
GET  /api/partners                 # Партнёры
GET  /api/faq                      # FAQ
GET  /api/utilities                # Инструменты
GET  /api/evolution-levels         # Уровни эволюции
GET  /api/evolution-badges         # Бейджи
GET  /api/utility-nav-buttons      # Навигационные кнопки
GET  /api/cookie-consent-settings  # Настройки Cookie Consent
POST /api/admin/login              # Авторизация админа
PUT  /api/admin/cookie-consent-settings  # Обновление Cookie Consent
```

## ⚠️ Важно

1. **ZK вместо SOL**: По умолчанию zkSync, не Solana
2. **Utility Nav Buttons**: Создать 3 кнопки в базе данных
3. **Evolution Cards**: Размер 288x158px
4. **Пароль админа**: Сменить на production!
5. **Cookie Consent**: Запустить `init_cookie_consent.py` для инициализации политик

## 🆕 Версия 1.1.0 (29.12.2025)

### Новое:
- ✅ Cookie Consent баннер (GDPR compliant)
- ✅ Модальные окна политик (Cookie, Privacy, Terms)
- ✅ Админ-панель для управления текстами политик
- ✅ 20 исправлений мобильной адаптивности

Подробнее см. [CHANGELOG.md](CHANGELOG.md)

## 📞 Поддержка

- 📧 Email: support@fomo.io
- 💬 Telegram: @fomo_support
- 🐛 Issues: [GitHub](https://github.com/ventureguro-create/Full/issues)

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE)

---

**FOMO** © 2025 | Built with ❤️ for the crypto community
