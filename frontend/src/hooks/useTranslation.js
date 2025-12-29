/**
 * useTranslation Hook
 * 
 * Provides translation functionality for the FOMO platform
 * Supports both Russian (ru) and English (en) languages
 */
import { useLanguage } from '../context/LanguageContext';

// ==================== TRANSLATIONS ====================
const translations = {
  ru: {
    // Navigation
    nav: {
      home: "Главная",
      about: "О нас",
      platform: "Платформа",
      roadmap: "Дорожная карта",
      evolution: "Эволюция",
      team: "Команда",
      partners: "Партнёры",
      faq: "FAQ",
      launch: "Запустить платформу"
    },
    // Hero Section
    hero: {
      badge: "Сейчас в Beta v1.1",
      titleLine1: "Будущее",
      titleLine2: "Крипто Аналитики",
      subtitle: "Откройте для себя комплексную платформу, объединяющую социальное взаимодействие, аналитику данных и доступ к крипто-проектам, NFT и многому другому.",
      cta: "Изучить платформу",
      buyNft: "Купить NFT",
      stats: {
        activeUsers: "Активных пользователей",
        tradingVolume: "Объём торгов",
        nftCollection: "NFT Коллекция"
      },
      portfolio: "Портфель",
      volume24h: "Объём 24ч"
    },
    // About Section
    about: {
      badge: "О платформе",
      title: "Инновационная экосистема крипто-аналитики",
      subtitle: "FOMO — это передовая платформа, объединяющая искусственный интеллект, блокчейн-технологии и глубокую аналитику данных для предоставления беспрецедентных инсайтов в мире криптовалют."
    },
    // Platform Section
    platformOverview: {
      badge: "Обзор платформы",
      title: "Мощные инструменты для успешной торговли",
      subtitle: "Комплексное решение для анализа и принятия решений",
      vsLastMonth: "за последний месяц",
      trackedTokens: "отслеживаемых токенов",
      detectedToday: "обнаружено сегодня"
    },
    // Projects Section
    projects: {
      badge: "Наши проекты",
      title: "Инновационные решения",
      subtitle: "Откройте для себя наши передовые проекты в области криптоаналитики",
      learnMore: "Подробнее",
      viewAll: "Смотреть все"
    },
    // Evolution Section
    evolution: {
      badge: "Эволюция",
      title: "Развивайтесь вместе с нами",
      subtitle: "Повышайте свой статус в экосистеме FOMO и открывайте новые возможности",
      levels: "Уровни",
      badges: "Значки",
      nextLevel: "Следующий уровень:",
      howToEarn: "Как заработать:",
      clickToFlip: "Нажмите, чтобы перевернуть",
      clickToSeeConditions: "Нажмите, чтобы увидеть условия",
      earn: "Заработать",
      fomoScore: "FOMO Score",
      xpRequired: "Требуется XP"
    },
    // Team Section  
    team: {
      badge: "Наша команда",
      title: "Команда экспертов",
      subtitle: "Познакомьтесь с профессионалами, создающими будущее криптоаналитики",
      mainTeam: "Основная команда",
      teamMembers: "Члены команды"
    },
    // Partners Section
    partners: {
      badge: "Партнёры",
      title: "Наши партнёры и сотрудники",
      subtitle: "Работаем с ведущими компаниями в индустрии",
      tabs: {
        partners: "Партнёры",
        media: "Медиа",
        portfolio: "Портфолио"
      },
      search: "Поиск партнёров...",
      noResults: "Партнёры не найдены"
    },
    // Roadmap Section
    roadmap: {
      badge: "Дорожная карта",
      title: "Наш путь к успеху",
      subtitle: "Следите за нашим развитием и ключевыми этапами проекта",
      completed: "Завершено",
      inProgress: "В процессе",
      planned: "Запланировано"
    },
    // Community Section
    community: {
      badge: "Сообщество",
      title: "Присоединяйтесь к сообществу",
      subtitle: "Станьте частью глобальной крипто-революции",
      joinCommunity: "Присоединиться",
      emailPlaceholder: "Введите ваш email",
      subscribe: "Подписаться"
    },
    // FAQ Section
    faq: {
      badge: "Часто задаваемые вопросы",
      title: "Ответы на ваши вопросы",
      subtitle: "Найдите ответы на самые популярные вопросы о платформе"
    },
    // Footer
    footer: {
      description: "Передовая платформа крипто-аналитики с AI-алгоритмами",
      quickLinks: "Быстрые ссылки",
      community: "Сообщество",
      support: "Поддержка",
      legal: "Правовая информация",
      allRightsReserved: "Все права защищены",
      madeWith: "Сделано с",
      by: "командой",
      privacyPolicy: "Политика конфиденциальности",
      termsOfService: "Условия использования",
      contactUs: "Связаться с нами"
    },
    // Buy NFT Modal
    buyNft: {
      title: "Стань частью",
      highlight: "#FOMO",
      subtitle: "Купите NFT из нашей коллекции и станьте важной частью проекта FOMO, объединяющего всё сообщество",
      specialOffer: "Наше специальное предложение для вас:",
      discount: "Покупка 3 NFT - скидка 10%",
      quantity: "Количество [1-3]",
      maxInfo: "Один адрес может купить максимум 3 NFT",
      price: "Цена [USDC]",
      discountApplied: "Скидка 10% применена!",
      approve: "Подтвердить",
      approving: "Подтверждение...",
      buy: "Купить NFT",
      processing: "Обработка...",
      connectWallet: "Подключите кошелёк для завершения покупки"
    },
    // Common
    common: {
      readMore: "Читать далее",
      learnMore: "Узнать больше",
      getStarted: "Начать",
      close: "Закрыть",
      save: "Сохранить",
      cancel: "Отмена",
      edit: "Редактировать",
      delete: "Удалить",
      add: "Добавить",
      loading: "Загрузка...",
      page: "Страница",
      of: "из",
      search: "Поиск...",
      noData: "Нет данных",
      error: "Ошибка",
      downloadWhitepaper: "Скачать Whitepaper"
    }
  },
  en: {
    // Navigation
    nav: {
      home: "Home",
      about: "About",
      platform: "Platform",
      roadmap: "Roadmap",
      evolution: "Evolution",
      team: "Team",
      partners: "Partners",
      faq: "FAQ",
      launch: "Launch Platform"
    },
    // Hero Section
    hero: {
      badge: "Now in Beta v1.1",
      titleLine1: "The Future of",
      titleLine2: "Crypto Analytics",
      subtitle: "Discover a comprehensive platform combining social engagement, data analytics, and seamless access to crypto projects, NFTs, and more.",
      cta: "Explore Platform",
      buyNft: "Buy NFT",
      stats: {
        activeUsers: "Active Users",
        tradingVolume: "Trading Volume",
        nftCollection: "NFT Collection"
      },
      portfolio: "Portfolio",
      volume24h: "Volume 24h"
    },
    // About Section
    about: {
      badge: "About Platform",
      title: "Innovative Crypto Analytics Ecosystem",
      subtitle: "FOMO is an advanced platform combining artificial intelligence, blockchain technology, and deep data analytics to provide unprecedented insights into the world of cryptocurrencies."
    },
    // Platform Section
    platformOverview: {
      badge: "Platform Overview",
      title: "Powerful Tools for Successful Trading",
      subtitle: "Comprehensive solution for analysis and decision making",
      vsLastMonth: "vs last month",
      trackedTokens: "tracked tokens",
      detectedToday: "detected today"
    },
    // Projects Section
    projects: {
      badge: "Our Projects",
      title: "Innovative Solutions",
      subtitle: "Discover our cutting-edge projects in crypto analytics",
      learnMore: "Learn More",
      viewAll: "View All"
    },
    // Evolution Section
    evolution: {
      badge: "Evolution",
      title: "Evolve With Us",
      subtitle: "Level up your status in the FOMO ecosystem and unlock new opportunities",
      levels: "Levels",
      badges: "Badges",
      nextLevel: "Next Level:",
      howToEarn: "How to earn:",
      clickToFlip: "Click to flip",
      clickToSeeConditions: "Click to see conditions",
      earn: "Earn",
      fomoScore: "FOMO Score",
      xpRequired: "XP Required"
    },
    // Team Section
    team: {
      badge: "Our Team",
      title: "Expert Team",
      subtitle: "Meet the professionals creating the future of crypto analytics",
      mainTeam: "Main Team",
      teamMembers: "Team Members"
    },
    // Partners Section
    partners: {
      badge: "Partners",
      title: "Our Partners and Collaborators",
      subtitle: "Working with industry-leading companies",
      tabs: {
        partners: "Partners",
        media: "Media",
        portfolio: "Portfolio"
      },
      search: "Search partners...",
      noResults: "No partners found"
    },
    // Roadmap Section
    roadmap: {
      badge: "Roadmap",
      title: "Our Path to Success",
      subtitle: "Follow our development and key milestones",
      completed: "Completed",
      inProgress: "In Progress",
      planned: "Planned"
    },
    // Community Section
    community: {
      badge: "Community",
      title: "Join Our Community",
      subtitle: "Become part of the global crypto revolution",
      joinCommunity: "Join Community",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe"
    },
    // FAQ Section
    faq: {
      badge: "Frequently Asked Questions",
      title: "Answers to Your Questions",
      subtitle: "Find answers to the most popular questions about the platform"
    },
    // Footer
    footer: {
      description: "Advanced crypto analytics platform with AI algorithms",
      quickLinks: "Quick Links",
      community: "Community",
      support: "Support",
      legal: "Legal",
      allRightsReserved: "All rights reserved",
      madeWith: "Made with",
      by: "by team",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      contactUs: "Contact Us"
    },
    // Buy NFT Modal
    buyNft: {
      title: "Become part of",
      highlight: "#FOMO",
      subtitle: "Buy a piece of our NFT collection to become an important part of FOMO project, uniting the entire community",
      specialOffer: "Our special offer for you:",
      discount: "Buying 3 NFT - 10% discount",
      quantity: "Quantity [1-3]",
      maxInfo: "One address can buy a maximum of 3 NFTs",
      price: "Price [USDC]",
      discountApplied: "10% discount applied!",
      approve: "Approve",
      approving: "Approving...",
      buy: "Buy NFT",
      processing: "Processing...",
      connectWallet: "Connect your wallet to complete the purchase"
    },
    // Common
    common: {
      readMore: "Read More",
      learnMore: "Learn More",
      getStarted: "Get Started",
      close: "Close",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      loading: "Loading...",
      page: "Page",
      of: "of",
      search: "Search...",
      noData: "No data",
      error: "Error",
      downloadWhitepaper: "Download Whitepaper"
    }
  }
};

// Helper hook to get translations
export const useTranslation = () => {
  const { language } = useLanguage();
  return (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
};

export default useTranslation;
