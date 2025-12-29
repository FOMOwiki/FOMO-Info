# FOMO Platform - Deployment Guide

## 📋 Содержание
1. [Обзор проекта](#обзор-проекта)
2. [Ключевые изменения](#ключевые-изменения)
3. [Требования](#требования)
4. [Развертывание](#развертывание)
5. [Конфигурация](#конфигурация)
6. [Инициализация данных](#инициализация-данных)
7. [Админ-панель](#админ-панель)

---

## 🎯 Обзор проекта

**FOMO** - криптоаналитическая платформа с функциями:
- Отслеживание цен криптовалют (BTC, ETH, ZK)
- Система эволюции пользователей (Levels & Badges)
- OTC/P2P маркеты
- NFT интеграция
- Админ-панель для управления контентом

### Технологический стек
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React 18 + TailwindCSS + Shadcn/ui
- **Database**: MongoDB
- **API**: RESTful API с CoinGecko интеграцией

---

## 🔧 Ключевые изменения (ВАЖНО!)

### 1. Криптовалюты в хедере
**Файл**: `/app/backend/server.py` (строка ~3090)
**Файл**: `/app/frontend/src/App.js` (строки ~5670-5710)

По умолчанию отображаются:
- **BTC** (Bitcoin)
- **ETH** (Ethereum)  
- **ZK** (zkSync) ← НЕ Solana!

```python
# Backend API - CoinGecko запрос
"ids": "bitcoin,ethereum,zksync,binancecoin,ripple,cardano,dogecoin,polkadot,avalanche-2,chainlink"
```

```javascript
// Frontend - отображение
{ symbol: "ZK", formatted_price: `$${prices.zksync?.usd?.toFixed(4) || '---'}` }
```

### 2. Utility Navigation Buttons (Crypto/Core/Utility)
**API**: `/api/utility-nav-buttons`
**Админка**: Admin → "Utility Nav Buttons"

Кнопки в правой части хедера загружаются из базы данных:
| Order | Label | URL |
|-------|-------|-----|
| 1 | Crypto | #crypto |
| 2 | Core | #core |
| 3 | Utility | #utility |

**Frontend загрузка** (App.js ~строка 5555):
```javascript
const response = await axios.get(`${API}/utility-nav-buttons`);
```

### 3. Evolution Section (FOMO Score Levels & Badges)
**Размер карточек**: 288x158px
**Горизонтальный скролл**: да

#### Levels (6 уровней):
| Rank | Score Range | Color |
|------|-------------|-------|
| Stellar Awakening | 0-199 | Gray |
| Cosmic Explorer | 200-399 | Blue |
| Galactic Navigator | 400-599 | Purple |
| Celestial Master | 600-799 | Orange |
| Astral Sage | 800-899 | Pink |
| Universal Enlightenment | 900-1000 | Green |

#### Badges (9 бейджей):
| Name | XP Required |
|------|-------------|
| XP Pioneer | 1,000 |
| Onboarding Master | 2,500 |
| Project Reviewer | 5,000 |
| Top Predictor | 10,000 |
| Hot Streak | 15,000 |
| Market Maker | 20,000 |
| P2P Pro | 25,000 |
| Community Champion | 35,000 |
| Singularity | 100,000 |

### 4. Crypto Trading Tools (Utilities)
**API**: `/api/utilities`
4 инструмента: Portfolio Tracker, Price Alerts, Whale Tracker, NFT Scanner

---

## 📦 Требования

### Системные
- Node.js 18+
- Python 3.11+
- MongoDB 6+

### Python пакеты
```bash
pip install fastapi uvicorn motor httpx python-multipart aiofiles user-agents bcrypt
```

### NPM пакеты
```bash
cd frontend && yarn install
```

---

## 🚀 Развертывание

### 1. Клонирование репозитория
```bash
git clone https://github.com/ventureguro-create/Full.git
cd Full
```

### 2. Настройка Backend
```bash
cd backend

# Создать .env файл
cat > .env << EOF
MONGO_URL="mongodb://localhost:27017"
DB_NAME="fomo_db"
CORS_ORIGINS="*"
ADMIN_PASSWORD="your_secure_password_here"
EOF

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Настройка Frontend
```bash
cd frontend

# Создать .env файл
cat > .env << EOF
REACT_APP_BACKEND_URL="https://your-domain.com/api"
EOF

# Установить зависимости
yarn install

# Запустить dev сервер
yarn start

# Или собрать для production
yarn build
```

### 4. Инициализация базы данных
```bash
cd scripts
python init_database.py
```

---

## ⚙️ Конфигурация

### Backend .env
| Переменная | Описание | Пример |
|------------|----------|--------|
| MONGO_URL | MongoDB connection string | mongodb://localhost:27017 |
| DB_NAME | Имя базы данных | fomo_db |
| CORS_ORIGINS | Разрешённые origins | * |
| ADMIN_PASSWORD | Пароль админки | admin123 |

### Frontend .env
| Переменная | Описание | Пример |
|------------|----------|--------|
| REACT_APP_BACKEND_URL | URL Backend API | https://api.fomo.io |

---

## 📊 Инициализация данных

После развертывания выполните скрипт инициализации:

```bash
cd /app/scripts
python init_database.py
```

Скрипт создаст:
- ✅ 6 Team Members (команда)
- ✅ 8 FAQ вопросов
- ✅ 7 Partners
- ✅ 4 Utilities (инструменты)
- ✅ 6 Evolution Levels
- ✅ 9 Evolution Badges
- ✅ 3 Utility Nav Buttons
- ✅ 4 Drawer Cards (проекты)

### Ручная инициализация (если скрипт не работает)

#### Utility Nav Buttons:
```bash
curl -X POST http://localhost:8001/api/utility-nav-buttons \
  -H "Content-Type: application/json" \
  -d '{"label": "Crypto", "url": "#crypto", "order": 1}'

curl -X POST http://localhost:8001/api/utility-nav-buttons \
  -H "Content-Type: application/json" \
  -d '{"label": "Core", "url": "#core", "order": 2}'

curl -X POST http://localhost:8001/api/utility-nav-buttons \
  -H "Content-Type: application/json" \
  -d '{"label": "Utility", "url": "#utility", "order": 3}'
```

---

## 🔐 Админ-панель

**URL**: `/admin`
**Пароль**: значение `ADMIN_PASSWORD` из backend/.env

### Доступные секции:
| Секция | Описание |
|--------|----------|
| Hero | Главный баннер и кнопки |
| About | О платформе |
| Utilities | Crypto Trading Tools |
| Platform | Описание платформы |
| Evolution | Levels & Badges |
| Ecosystem | Экосистема FOMO |
| Roadmap | Дорожная карта |
| Team | Команда |
| Partners | Партнёры и медиа |
| Community | Социальные ссылки |
| Footer | Подвал сайта |
| FAQ | Вопросы и ответы |
| Utility Nav Buttons | Кнопки Crypto/Core/Utility |
| Analytics | Аналитика |

---

## 📁 Структура файлов

```
/app/
├── backend/
│   ├── server.py          # FastAPI сервер (3800+ строк)
│   ├── requirements.txt   # Python зависимости
│   └── .env               # Конфигурация
├── frontend/
│   ├── src/
│   │   ├── App.js         # Главный компонент (9000+ строк)
│   │   ├── App.css        # Стили
│   │   └── components/
│   │       └── admin/     # Админ-панель
│   ├── package.json       # NPM зависимости
│   └── .env               # Конфигурация
└── scripts/
    ├── init_database.py   # Скрипт инициализации
    └── init_data/         # JSON данные для инициализации
        ├── team_members.json
        ├── faq.json
        ├── partners.json
        ├── utilities.json
        ├── evolution_levels.json
        ├── evolution_badges.json
        ├── utility_nav_buttons.json
        └── drawer_cards.json
```

---

## 🔄 API Endpoints

### Публичные
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | /api/ | Health check |
| GET | /api/crypto-prices | Цены BTC, ETH, ZK |
| GET | /api/crypto-market-data | Полные данные рынка |
| GET | /api/hero-settings | Настройки Hero секции |
| GET | /api/team-members | Команда |
| GET | /api/partners | Партнёры |
| GET | /api/faq | FAQ |
| GET | /api/utilities | Инструменты |
| GET | /api/evolution-levels | Уровни эволюции |
| GET | /api/evolution-badges | Бейджи |
| GET | /api/utility-nav-buttons | Навигационные кнопки |
| GET | /api/drawer-cards | Карточки проектов |

### Админские (требуют авторизации)
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | /api/admin/login | Авторизация |
| PUT | /api/[collection]/{id} | Обновление записи |
| DELETE | /api/[collection]/{id} | Удаление записи |

---

## 🎨 Кастомизация Evolution Cards

### Размеры (App.js)
```javascript
// Levels & Badges - одинаковый размер
style={{ 
  minWidth: '288px', 
  maxWidth: '288px', 
  height: '158px'
}}
```

### CSS (App.css)
```css
.evolution-levels-grid .evolution-card-wrapper,
.evolution-badges-grid .evolution-card-wrapper {
  min-width: 288px !important;
  max-width: 288px !important;
  height: 158px !important;
}
```

---

## ⚠️ Важные замечания

1. **ZK вместо SOL**: Криптовалюта zkSync (ZK) используется вместо Solana
2. **Utility Nav Buttons**: Кнопки должны быть созданы в базе данных
3. **Evolution Cards**: Размер 288x158px с горизонтальным скроллом
4. **Админ пароль**: Изменить на production!

---

## 📞 Поддержка

- Email: support@fomo.io
- Telegram: @fomo_support
- GitHub Issues: https://github.com/ventureguro-create/Full/issues
