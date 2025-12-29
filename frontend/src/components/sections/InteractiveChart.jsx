import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const InteractiveChart = () => {
  const [data, setData] = useState([40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [cryptoData, setCryptoData] = useState({
    cryptos: [
      { symbol: "BTC", formatted_price: "$88,954", change_24h: 1.57 },
      { symbol: "ETH", formatted_price: "$2,982", change_24h: 1.82 },
      { symbol: "ZKS", formatted_price: "$0.15", change_24h: -0.5 }
    ],
    indices: [
      { name: "Fear & Greed", value: 65 },
      { name: "Altcoin Season", value: 42 }
    ]
  });

  // Fetch real crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(`${API}/crypto-market-data`);
        setCryptoData(response.data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };
    
    fetchCryptoData();
    // Update every 60 seconds
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setData(prev => prev.map(v => Math.max(20, Math.min(100, v + (Math.random() - 0.5) * 15))));
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <span className="text-gray-900 font-semibold text-lg">Market Overview</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAnimating(!isAnimating)} 
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${isAnimating ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}
          >
            {isAnimating ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>
      <div className="chart-area">
        {data.map((h, i) => (
          <div 
            key={i} 
            className="chart-bar-container"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className={`chart-bar ${hoveredIndex === i ? 'hovered' : ''}`}
              style={{ height: `${h}%` }}
            />
            {hoveredIndex === i && (
              <div className="chart-tooltip">
                ${(h * 1000).toFixed(0)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chart-stats">
        <div className="stat-box">
          <span className="text-gray-500 text-xs">{cryptoData.cryptos[0].symbol}</span>
          <span className="text-gray-900 font-bold">{cryptoData.cryptos[0].formatted_price}</span>
          <span className={`stat-change ${cryptoData.cryptos[0].change_24h >= 0 ? 'positive' : 'negative'}`}>
            {cryptoData.cryptos[0].change_24h >= 0 ? '+' : ''}{cryptoData.cryptos[0].change_24h.toFixed(2)}%
          </span>
        </div>
        <div className="stat-box">
          <span className="text-gray-500 text-xs">{cryptoData.cryptos[1].symbol}</span>
          <span className="text-gray-900 font-bold">{cryptoData.cryptos[1].formatted_price}</span>
          <span className={`stat-change ${cryptoData.cryptos[1].change_24h >= 0 ? 'positive' : 'negative'}`}>
            {cryptoData.cryptos[1].change_24h >= 0 ? '+' : ''}{cryptoData.cryptos[1].change_24h.toFixed(2)}%
          </span>
        </div>
        <div className="stat-box">
          <span className="text-gray-500 text-xs">{cryptoData.cryptos[2].symbol}</span>
          <span className="text-gray-900 font-bold">{cryptoData.cryptos[2].formatted_price}</span>
          <span className={`stat-change ${cryptoData.cryptos[2].change_24h >= 0 ? 'positive' : 'negative'}`}>
            {cryptoData.cryptos[2].change_24h >= 0 ? '+' : ''}{cryptoData.cryptos[2].change_24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};



export default InteractiveChart;
