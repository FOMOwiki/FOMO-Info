# FOMO Platform - Changelog & Critical Changes

## 🔴 КРИТИЧЕСКИЕ ИЗМЕНЕНИЯ (применить после развертывания!)

### 1. Криптовалюты: ZK вместо SOL

**Backend** (`/app/backend/server.py` ~строка 3090):
```python
# Найти строку с CoinGecko API call и заменить:
# БЫЛО: "ids": "bitcoin,ethereum,solana,..."
# СТАЛО: "ids": "bitcoin,ethereum,zksync,..."
```

**Frontend** (`/app/frontend/src/App.js` ~строка 5670):
```javascript
// БЫЛО:
{ symbol: "SOL", formatted_price: `$${prices.solana?.usd?.toLocaleString() || '---'}` }

// СТАЛО:
{ symbol: "ZK", formatted_price: `$${prices.zksync?.usd?.toFixed(4) || '---'}` }
```

---

### 2. Utility Navigation Buttons (Crypto/Core/Utility)

**Frontend** (`/app/frontend/src/App.js` ~строка 5555):
```javascript
// БЫЛО: загрузка из hero-settings
const response = await axios.get(`${API}/hero-settings`);
if (response.data?.action_buttons) {
  setActionButtons(response.data.action_buttons);
}

// СТАЛО: загрузка из utility-nav-buttons
const response = await axios.get(`${API}/utility-nav-buttons`);
if (response.data && response.data.length > 0) {
  const sorted = response.data.sort((a, b) => a.order - b.order);
  const buttons = {};
  const keys = ['crypto', 'core', 'utility'];
  sorted.forEach((btn, idx) => {
    if (idx < 3) {
      buttons[keys[idx]] = { label: btn.label, url: btn.url, id: btn.id };
    }
  });
  setActionButtons(prev => ({ ...prev, ...buttons }));
}
```

**Инициализация данных**:
```bash
curl -X POST http://localhost:8001/api/utility-nav-buttons -H "Content-Type: application/json" -d '{"label": "Crypto", "url": "#crypto", "order": 1}'
curl -X POST http://localhost:8001/api/utility-nav-buttons -H "Content-Type: application/json" -d '{"label": "Core", "url": "#core", "order": 2}'
curl -X POST http://localhost:8001/api/utility-nav-buttons -H "Content-Type: application/json" -d '{"label": "Utility", "url": "#utility", "order": 3}'
```

---

### 3. Evolution Cards Size (288x158px)

**Frontend** (`/app/frontend/src/App.js` ~строка 7780):
```javascript
// Levels wrapper
style={{ 
  minWidth: '288px', 
  maxWidth: '288px', 
  height: '158px',
  flexShrink: 0,
  scrollSnapAlign: 'start',
  cursor: 'pointer'
}}

// Badges wrapper (~строка 7870)
style={{ 
  minWidth: '288px', 
  maxWidth: '288px', 
  height: '158px',
  flexShrink: 0,
  scrollSnapAlign: 'start',
  cursor: 'pointer'
}}
```

**CSS** (`/app/frontend/src/App.css` в конце файла):
```css
/* ==================== EVOLUTION COMPACT SCROLL ==================== */
.evolution-levels-grid,
.evolution-badges-grid {
  display: flex !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  scroll-snap-type: x mandatory !important;
  -webkit-overflow-scrolling: touch !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  align-items: flex-start !important;
  gap: 16px !important;
  padding: 14px 4px 28px !important;
}

.evolution-levels-grid::-webkit-scrollbar,
.evolution-badges-grid::-webkit-scrollbar {
  display: none !important;
}

.evolution-levels-grid .evolution-card-wrapper,
.evolution-badges-grid .evolution-card-wrapper {
  min-width: 288px !important;
  max-width: 288px !important;
  height: 158px !important;
  flex-shrink: 0 !important;
  scroll-snap-align: start !important;
}
```

---

## 📊 Данные для инициализации

### Team Members (6)
1. Alex Thompson - CEO & Founder
2. Sarah Chen - CTO
3. Michael Roberts - Head of Product
4. Emma Wilson - Lead Designer
5. David Kim - Head of Marketing
6. Lisa Martinez - Senior Blockchain Developer

### FAQ (8)
1. What is FOMO Platform?
2. How do I get started with FOMO?
3. What cryptocurrencies does FOMO track?
4. What is the Evolution system?
5. Is FOMO secure?
6. How does the OTC Market work?
7. What are Red Flag Alerts?
8. How can I contact support?

### Partners (7)
- Partners: Binance, Chainlink
- Media: CoinTelegraph, The Block
- Portfolio: CoinGecko, DeFi Pulse, Uniswap

### Utilities (4)
1. Portfolio Tracker - отслеживание активов
2. Price Alerts - уведомления о ценах
3. Whale Tracker - мониторинг китов
4. NFT Scanner - анализ NFT

### Evolution Levels (6)
| Rank | Score | Gradient |
|------|-------|----------|
| Stellar Awakening | 0-199 | #64748b → #475569 |
| Cosmic Explorer | 200-399 | #3b82f6 → #2563eb |
| Galactic Navigator | 400-599 | #8b5cf6 → #7c3aed |
| Celestial Master | 600-799 | #f59e0b → #d97706 |
| Astral Sage | 800-899 | #ec4899 → #db2777 |
| Universal Enlightenment | 900-1000 | #10b981 → #059669 |

### Evolution Badges (9)
| Badge | XP | Gradient |
|-------|-----|----------|
| XP Pioneer | 1,000 | #3b82f6 → #1d4ed8 |
| Onboarding Master | 2,500 | #10b981 → #059669 |
| Project Reviewer | 5,000 | #8b5cf6 → #7c3aed |
| Top Predictor | 10,000 | #ec4899 → #db2777 |
| Hot Streak | 15,000 | #f59e0b → #d97706 |
| Market Maker | 20,000 | #ef4444 → #dc2626 |
| P2P Pro | 25,000 | #06b6d4 → #0891b2 |
| Community Champion | 35,000 | #84cc16 → #65a30d |
| Singularity | 100,000 | #a855f7 → #9333ea |

### Drawer Cards (4)
1. FOMO Dashboard
2. OTC Market
3. P2P Exchange
4. NFT Box 666

---

## 🔧 Быстрая проверка после развертывания

```bash
# 1. Проверить API
curl http://localhost:8001/api/

# 2. Проверить криптоцены (должен быть zksync)
curl http://localhost:8001/api/crypto-prices | jq '.prices.zksync'

# 3. Проверить Utility Nav Buttons
curl http://localhost:8001/api/utility-nav-buttons

# 4. Проверить Evolution Levels
curl http://localhost:8001/api/evolution-levels

# 5. Проверить Evolution Badges
curl http://localhost:8001/api/evolution-badges

# 6. Проверить Team Members
curl http://localhost:8001/api/team-members
```

---

## 📝 Версионирование

| Версия | Дата | Изменения |
|--------|------|-----------|
| 1.0.0 | 2025-12-28 | Начальная версия |
| 1.1.0 | 2025-12-29 | SOL → ZK, Utility Nav Buttons fix |
| 1.2.0 | 2025-12-29 | Evolution Cards 288x158px |
