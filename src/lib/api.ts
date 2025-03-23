
import { toast } from "sonner";
import { 
  LoginParams, 
  OTPVerificationParams, 
  LogoutParams,
  HolderData,
  DepositData,
  WithdrawData,
  PenaltyData,
  Holder,
  Transaction,
  Penalty,
  LogEntry
} from "@/types";
import { API_URL } from "@/config/constants";

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
    }
    throw error;
  }
};

const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
  toast.error(errorMessage);
  return errorMessage;
};

// Authentication APIs
export const loginAPI = async (params: LoginParams): Promise<string> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "login");
    url.searchParams.append("email", params.email);
    url.searchParams.append("password", params.password);
    if (params.ip) url.searchParams.append("ip", params.ip);

    const response = await fetchWithTimeout(url.toString());
    const data = await response.text();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyOTPAPI = async (params: OTPVerificationParams): Promise<string> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "verifyOTP");
    url.searchParams.append("email", params.email);
    url.searchParams.append("otp", params.otp);

    const response = await fetchWithTimeout(url.toString());
    const data = await response.text();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logoutAPI = async (params: LogoutParams): Promise<string> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "logout");
    url.searchParams.append("email", params.email);

    const response = await fetchWithTimeout(url.toString());
    const data = await response.text();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Holder Management APIs
export const addHolderAPI = async (data: HolderData): Promise<string> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "addholder");
    url.searchParams.append("hid", data.hid || "");
    url.searchParams.append("fullname", data.fullname);
    url.searchParams.append("mob", data.mob);
    url.searchParams.append("email", data.email);

    const response = await fetchWithTimeout(url.toString());
    const responseData = await response.text();
    return responseData;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAllHoldersAPI = async (): Promise<Holder[]> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "tget");

    const response = await fetchWithTimeout(url.toString());
    const html = await response.text();
    
    // Parse the HTML table into JSON
    const holders = parseHoldersTable(html);
    return holders;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Transaction APIs
export const depositAPI = async (data: DepositData): Promise<string> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "deposit");
    url.searchParams.append("hid", data.hid);
    url.searchParams.append("damount", data.damount.toString());
    url.searchParams.append("note", data.note);
    url.searchParams.append("email", data.email);

    const response = await fetchWithTimeout(url.toString());
    const responseData = await response.text();
    return responseData;
  } catch (error) {
    return handleApiError(error);
  }
};

export const withdrawAPI = async (data: WithdrawData): Promise<string> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "withdraw");
    url.searchParams.append("hid", data.hid);
    url.searchParams.append("wamount", data.wamount.toString());
    url.searchParams.append("camount", data.camount.toString());
    url.searchParams.append("note", data.note);
    url.searchParams.append("email", data.email);

    const response = await fetchWithTimeout(url.toString());
    const responseData = await response.text();
    return responseData;
  } catch (error) {
    return handleApiError(error);
  }
};

// Penalty APIs
export const addPenaltyAPI = async (data: PenaltyData): Promise<string> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "addPenalty");
    url.searchParams.append("hid", data.hid);
    url.searchParams.append("pamount", data.pamount.toString());
    url.searchParams.append("reason", data.reason);
    url.searchParams.append("email", data.email);

    const response = await fetchWithTimeout(url.toString());
    const responseData = await response.text();
    return responseData;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getPenaltyAPI = async (hid: string): Promise<Penalty[]> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "getPenalty");
    url.searchParams.append("hid", hid);

    const response = await fetchWithTimeout(url.toString());
    const data = await response.text();
    
    // Parse the penalty text into structured data
    const penalties = parsePenaltyData(data, hid);
    return penalties;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Log APIs
export const getLogsAPI = async (): Promise<LogEntry[]> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "readlogs");

    const response = await fetchWithTimeout(url.toString());
    const data = await response.text();
    
    // Parse the logs CSV data
    const logs = parseLogsData(data);
    return logs;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Admin APIs
export const getAdminsAPI = async () => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("action", "readadmin");

    const response = await fetchWithTimeout(url.toString());
    const data = await response.text();
    
    // Parse the admin CSV data
    const admins = parseAdminData(data);
    return admins;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Helper Functions for Parsing
const parseHoldersTable = (html: string): Holder[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("table tr");
    
    const holders: Holder[] = [];
    
    // Skip the header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      if (cells.length >= 9) {
        holders.push({
          date: cells[0].textContent || "",
          hid: cells[1].textContent || "",
          name: cells[2].textContent || "",
          mobile: cells[3].textContent || "",
          totalDeposit: parseFloat(cells[4].textContent || "0"),
          withdraw: parseFloat(cells[5].textContent || "0"),
          charges: parseFloat(cells[6].textContent || "0"),
          balance: parseFloat(cells[7].textContent || "0"),
          status: cells[8].textContent || "",
          email: "", // Email may not be in the HTML table
          penalty: 0  // Penalty may not be in the HTML table
        });
      }
    }
    
    return holders;
  } catch (error) {
    console.error("Error parsing holders table:", error);
    return [];
  }
};

const parsePenaltyData = (data: string, hid: string): Penalty[] => {
  try {
    // Example penalty data format: "Penalty Details:\nDate: 2023-01-01, Amount: 100, Reason: Late payment\n..."
    if (data.startsWith("No penalties found")) {
      return [];
    }
    
    const lines = data.split("\n");
    const penalties: Penalty[] = [];
    
    // Skip the first line (header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const datePart = line.match(/Date: ([^,]+)/);
        const amountPart = line.match(/Amount: ([^,]+)/);
        const reasonPart = line.match(/Reason: (.+)/);
        
        if (datePart && amountPart && reasonPart) {
          penalties.push({
            id: `P${i}`,
            date: datePart[1].trim(),
            time: "", // Time might not be available
            hid: hid,
            amount: parseFloat(amountPart[1].trim()),
            reason: reasonPart[1].trim()
          });
        }
      }
    }
    
    return penalties;
  } catch (error) {
    console.error("Error parsing penalty data:", error);
    return [];
  }
};

const parseLogsData = (data: string): LogEntry[] => {
  try {
    const lines = data.split("\n");
    const logs: LogEntry[] = [];
    
    // Skip the header line if present
    const startIndex = lines[0].includes("timestamp") ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(", ");
        if (parts.length >= 5) {
          logs.push({
            timestamp: parts[0],
            action: parts[1],
            user: parts[2],
            details: parts[3],
            status: parts[4]
          });
        }
      }
    }
    
    return logs;
  } catch (error) {
    console.error("Error parsing logs data:", error);
    return [];
  }
};

const parseAdminData = (data: string) => {
  try {
    const lines = data.split("\n");
    const admins = [];
    
    // Skip the header line if present
    const startIndex = lines[0].includes("email") ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(", ");
        if (parts.length >= 2) {
          admins.push({
            email: parts[0],
            role: "admin",
            lastLogin: parts.length > 3 ? parts[3] : undefined
          });
        }
      }
    }
    
    return admins;
  } catch (error) {
    console.error("Error parsing admin data:", error);
    return [];
  }
};
