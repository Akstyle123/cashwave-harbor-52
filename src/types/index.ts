
// API Types
export interface LoginParams {
  email: string;
  password: string;
  ip?: string;
}

export interface OTPVerificationParams {
  email: string;
  otp: string;
}

export interface LogoutParams {
  email: string;
}

export interface HolderData {
  hid: string;
  fullname: string;
  mob: string;
  email: string;
}

export interface DepositData {
  hid: string;
  damount: number;
  note: string;
  email: string;
}

export interface WithdrawData {
  hid: string;
  wamount: number;
  camount: number;
  note: string;
  email: string;
}

export interface PenaltyData {
  hid: string;
  pamount: number;
  reason: string;
  email: string;
}

// Data Types
export interface Holder {
  date: string;
  hid: string;
  name: string;
  mobile: string;
  totalDeposit: number;
  withdraw: number;
  charges: number;
  balance: number;
  status: string;
  email: string;
  penalty: number;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  hid: string;
  amount: number;
  note: string;
  type: "deposit" | "withdrawal" | "penalty";
  charges?: number;
}

export interface Penalty {
  id: string;
  date: string;
  time: string;
  hid: string;
  amount: number;
  reason: string;
}

export interface Admin {
  email: string;
  role: string;
  lastLogin?: string;
}

export interface LogEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: string;
}

// Auth Types
export interface User {
  email: string;
  role: "admin" | "holder";
  hid?: string;
}

// State Types
export interface BankState {
  holders: Holder[];
  transactions: Transaction[];
  penalties: Penalty[];
  logs: LogEntry[];
  admins: Admin[];
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
