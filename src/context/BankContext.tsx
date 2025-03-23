
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { BankState, HolderData, DepositData, WithdrawData, PenaltyData } from "@/types";
import { 
  getAllHoldersAPI, 
  addHolderAPI, 
  depositAPI, 
  withdrawAPI, 
  addPenaltyAPI, 
  getPenaltyAPI,
  getLogsAPI 
} from "@/lib/api";
import { useAuth } from "./AuthContext";

interface BankContextType extends BankState {
  fetchHolders: () => Promise<void>;
  addHolder: (data: HolderData) => Promise<boolean>;
  makeDeposit: (data: DepositData) => Promise<boolean>;
  makeWithdrawal: (data: WithdrawData) => Promise<boolean>;
  addPenalty: (data: PenaltyData) => Promise<boolean>;
  fetchPenaltiesForHolder: (hid: string) => Promise<void>;
  fetchLogs: () => Promise<void>;
}

const initialState: BankState = {
  holders: [],
  transactions: [],
  penalties: [],
  logs: [],
  admins: [],
  isLoading: false,
  error: null
};

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BankState>(initialState);
  const { isAuthenticated } = useAuth();

  // Fetch holders on initial load if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchHolders();
    }
  }, [isAuthenticated]);

  const fetchHolders = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const holders = await getAllHoldersAPI();
      setState(prev => ({ ...prev, holders, isLoading: false }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch holders";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  };

  const addHolder = async (data: HolderData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await addHolderAPI(data);
      
      if (response.includes("successfully")) {
        toast.success("Holder added successfully");
        await fetchHolders(); // Refresh holders list
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false, error: response }));
        toast.error(response);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add holder";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
      return false;
    }
  };

  const makeDeposit = async (data: DepositData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await depositAPI(data);
      
      if (response.includes("successful")) {
        toast.success("Deposit successful");
        await fetchHolders(); // Refresh holders list
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false, error: response }));
        toast.error(response);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Deposit failed";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
      return false;
    }
  };

  const makeWithdrawal = async (data: WithdrawData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await withdrawAPI(data);
      
      if (response.includes("successful")) {
        toast.success("Withdrawal successful");
        await fetchHolders(); // Refresh holders list
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false, error: response }));
        toast.error(response);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Withdrawal failed";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
      return false;
    }
  };

  const addPenalty = async (data: PenaltyData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await addPenaltyAPI(data);
      
      if (response.includes("successfully")) {
        toast.success("Penalty added successfully");
        await fetchHolders(); // Refresh holders list
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false, error: response }));
        toast.error(response);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add penalty";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
      return false;
    }
  };

  const fetchPenaltiesForHolder = async (hid: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const penalties = await getPenaltyAPI(hid);
      setState(prev => ({ ...prev, penalties, isLoading: false }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch penalties";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  };

  const fetchLogs = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const logs = await getLogsAPI();
      setState(prev => ({ ...prev, logs, isLoading: false }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch logs";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  };

  return (
    <BankContext.Provider
      value={{
        ...state,
        fetchHolders,
        addHolder,
        makeDeposit,
        makeWithdrawal,
        addPenalty,
        fetchPenaltiesForHolder,
        fetchLogs
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = (): BankContextType => {
  const context = useContext(BankContext);
  
  if (context === undefined) {
    throw new Error("useBank must be used within a BankProvider");
  }
  
  return context;
};
