# FOMO - Crypto Analytics Platform

![FOMO Platform](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=400&fit=crop)

## 🚀 Обзор

**FOMO** — комплексная платформа криптоаналитики, объединяющая:
- 📊 Отслеживание цен криптовалют в реальном времени (BTC, ETH, ZK)
- 🎮 Геймифицированную систему эволюции пользователей
- 💱 OTC и P2P маркеты
- 🎨 NFT интеграцию
- 🛠 Набор инструментов для трейдеров

## 📋 Содержание

- [Быстрый старт](#-быстрый-старт)
- [Технологии](#-технологии)
- [Структура проекта](#-структура-проекта)
- [Документация](#-документация)
- [Поддержка](#-поддержка)

## ⚡ Быстрый старт

### 1. Клонирование
```bash
git clone https://github.com/ventureguro-create/Full.git
cd Full
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt

# Создать .env
echo 'MONGO_URL="mongodb://localhost:27017"' > .env
echo 'DB_NAME="fomo_db"' >> .env
echo 'CORS_ORIGINS="*"' >> .env
echo 'ADMIN_PASSWORD="admin123"' >> .env

# Запустить
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 3. Frontend
```bash
cd frontend
yarn install

# Создать .env
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

## 📞 Поддержка

- 📧 Email: support@fomo.io
- 💬 Telegram: @fomo_support
- 🐛 Issues: [GitHub](https://github.com/ventureguro-create/Full/issues)

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE)

---

**FOMO** © 2025 | Built with ❤️ for the crypto community
