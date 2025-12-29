/**
 * Translations Configuration
 * 
 * Contains all translatable strings for the application.
 * Supports Russian (ru) and English (en) languages.
 * 
 * Usage:
 * import { translations } from '@/i18n/translations';
 * const text = translations[language].nav.home;
 */

export const translations = {
  ru: {
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
    about: {
      badge: "О платформе",
      title: "Инновационная экосистема крипто-аналитики",
      subtitle: "FOMO — это передовая платформа, объединяющая искусственный интеллект, блокчейн-технологии и глубокую аналитику данных."
    },
    platformOverview: {
      badge: "Обзор платформы",
      title: "Мощные инструменты для успешной торговли",
      subtitle: "Комплексное решение для анализа и принятия решений",
      vsLastMonth: "за последний месяц",
      trackedTokens: "отслеживаемых токенов",
      detectedToday: "обнаружено сегодня"
    },
    projects: {
      badge: "Наши проекты",
      title: "Инновационные решения",
      subtitle: "Откройте для себя наши передовые проекты",
      learnMore: "Подробнее",
      viewAll: "Смотреть все"
    },
    evolution: {
      badge: "Эволюция",
      title: "Развивайтесь вместе с нами",
      subtitle: "Повышайте свой статус в экосистеме FOMO",
      levels: "Уровни",
      badges: "Значки",
      nextLevel: "Следующий уровень:",
      howToEarn: "Как заработать:",
      clickToFlip: "Нажмите, чтобы перевернуть",
      earn: "Заработать",
      fomoScore: "FOMO Score",
      xpRequired: "Требуется XP"
    },
    team: {
      badge: "Наша команда",
      title: "Команда экспертов",
      subtitle: "Профессионалы, создающие будущее криптоаналитики",
      mainTeam: "Основная команда",
      teamMembers: "Члены команды"
    },
    partners: {
      badge: "Партнёры",
      title: "Наши партнёры и сотрудники",
      subtitle: "Работаем с ведущими компаниями",
      tabs: {
        partners: "Партнёры",
        media: "Медиа",
        portfolio: "Портфолио"
      },
      search: "Поиск партнёров...",
      noResults: "Партнёры не найдены"
    },
    roadmap: {
      badge: "Дорожная карта",
      title: "Наш путь к успеху",
      subtitle: "Следите за нашим развитием",
      completed: "Завершено",
      inProgress: "В процессе",
      planned: "Запланировано"
    },
    community: {
      badge: "Сообщество",
      title: "Присоединяйтесь к сообществу",
      subtitle: "Станьте частью глобальной крипто-революции",
      joinCommunity: "Присоединиться",
      emailPlaceholder: "Введите ваш email",
      subscribe: "Подписаться"
    },
    faq: {
      badge: "Часто задаваемые вопросы",
      title: "Ответы на ваши вопросы",
      subtitle: "Найдите ответы на популярные вопросы"
    },
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
    buyNft: {
      title: "Стань частью",
      highlight: "#FOMO",
      subtitle: "Купите NFT из нашей коллекции",
      quantity: "Количество [1-3]",
      maxInfo: "Максимум 3 NFT на адрес",
      price: "Цена [USDC]",
      discountApplied: "Скидка 10% применена!",
      approve: "Подтвердить",
      buy: "Купить NFT",
      processing: "Обработка...",
      connectWallet: "Подключите кошелёк"
    },
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
    about: {
      badge: "About Platform",
      title: "Innovative Crypto Analytics Ecosystem",
      subtitle: "FOMO is an advanced platform combining artificial intelligence, blockchain technology, and deep data analytics."
    },
    platformOverview: {
      badge: "Platform Overview",
      title: "Powerful Tools for Successful Trading",
      subtitle: "Comprehensive solution for analysis and decision making",
      vsLastMonth: "vs last month",
      trackedTokens: "tracked tokens",
      detectedToday: "detected today"
    },
    projects: {
      badge: "Our Projects",
      title: "Innovative Solutions",
      subtitle: "Discover our cutting-edge projects",
      learnMore: "Learn More",
      viewAll: "View All"
    },
    evolution: {
      badge: "Evolution",
      title: "Evolve With Us",
      subtitle: "Level up your status in the FOMO ecosystem",
      levels: "Levels",
      badges: "Badges",
      nextLevel: "Next Level:",
      howToEarn: "How to earn:",
      clickToFlip: "Click to flip",
      earn: "Earn",
      fomoScore: "FOMO Score",
      xpRequired: "XP Required"
    },
    team: {
      badge: "Our Team",
      title: "Expert Team",
      subtitle: "Meet the professionals creating the future of crypto analytics",
      mainTeam: "Main Team",
      teamMembers: "Team Members"
    },
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
    roadmap: {
      badge: "Roadmap",
      title: "Our Path to Success",
      subtitle: "Follow our development and key milestones",
      completed: "Completed",
      inProgress: "In Progress",
      planned: "Planned"
    },
    community: {
      badge: "Community",
      title: "Join Our Community",
      subtitle: "Become part of the global crypto revolution",
      joinCommunity: "Join Community",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe"
    },
    faq: {
      badge: "Frequently Asked Questions",
      title: "Answers to Your Questions",
      subtitle: "Find answers to the most popular questions"
    },
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
    buyNft: {
      title: "Become part of",
      highlight: "#FOMO",
      subtitle: "Buy a piece of our NFT collection",
      quantity: "Quantity [1-3]",
      maxInfo: "Max 3 NFTs per address",
      price: "Price [USDC]",
      discountApplied: "10% discount applied!",
      approve: "Approve",
      buy: "Buy NFT",
      processing: "Processing...",
      connectWallet: "Connect your wallet"
    },
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

export default translations;
