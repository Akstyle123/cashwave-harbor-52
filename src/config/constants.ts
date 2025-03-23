// Bank Information
export const BANK_NAME = "MINI BANK";
export const SUPPORT_EMAIL = "support@minibank.com";

// API Config
export const API_URL = "https://script.google.com/macros/s/AKfycbwA0PmgH66TTVcS4mt5o_JkkmVI28kkHd5e490-lCVHnpTABjLIjo4zR07nANlpUjcW/exec";
// Replace YOUR_GOOGLE_SCRIPT_ID with your actual script ID from Google Apps Script
// You can find it in the URL when you open your script in the editor
// It looks like: AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// App Configuration
export const OTP_EXPIRY_MINUTES = 5;
export const CURRENCY_SYMBOL = "₹";
export const DATE_FORMAT = "MMM dd, yyyy";
export const TIME_FORMAT = "hh:mm a";

// Navigation
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ACCOUNTS: "/accounts",
  TRANSACTIONS: "/transactions",
  DEPOSIT: "/deposit",
  WITHDRAW: "/withdraw",
  PENALTIES: "/penalties",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  NOT_FOUND: "*",
};

// Transaction Types
export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  PENALTY: "penalty",
};

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_AMOUNT: 1,
  PHONE_REGEX: /^\d{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Table Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Color Schemes for Dashboard
export const CHART_COLORS = {
  primary: "rgba(59, 130, 246, 1)",
  primaryTransparent: "rgba(59, 130, 246, 0.2)",
  secondary: "rgba(99, 102, 241, 1)",
  secondaryTransparent: "rgba(99, 102, 241, 0.2)",
  success: "rgba(16, 185, 129, 1)",
  successTransparent: "rgba(16, 185, 129, 0.2)",
  warning: "rgba(245, 158, 11, 1)",
  warningTransparent: "rgba(245, 158, 11, 0.2)",
  danger: "rgba(239, 68, 68, 1)",
  dangerTransparent: "rgba(239, 68, 68, 0.2)",
};
