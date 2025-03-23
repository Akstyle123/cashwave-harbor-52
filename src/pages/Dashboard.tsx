
import { useEffect } from "react";
import {
  Users,
  ArrowDownToLine,
  ArrowUpToLine,
  AlertTriangle,
} from "lucide-react";
import { useBank } from "@/context/BankContext";
import Layout from "@/components/shared/Layout";
import PageTitle from "@/components/shared/PageTitle";
import StatCard from "@/components/dashboard/StatCard";
import AccountsOverview from "@/components/dashboard/AccountsOverview";
import TransactionsList from "@/components/dashboard/TransactionsList";
import ActivityChart from "@/components/dashboard/ActivityChart";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { CURRENCY_SYMBOL } from "@/config/constants";

// Mock transaction data for demonstration (would be replaced with real data from API)
const mockTransactions = [
  {
    id: "D00123",
    date: "2023-05-15",
    time: "10:30 AM",
    hid: "HID001",
    amount: 5000,
    note: "Monthly deposit",
    type: "deposit" as const,
  },
  {
    id: "W00089",
    date: "2023-05-14",
    time: "03:15 PM",
    hid: "HID002",
    amount: 2000,
    charges: 50,
    note: "Withdrawal for expenses",
    type: "withdrawal" as const,
  },
  {
    id: "P00034",
    date: "2023-05-12",
    time: "11:45 AM",
    hid: "HID003",
    amount: 500,
    note: "Late payment penalty",
    type: "penalty" as const,
  },
  {
    id: "D00122",
    date: "2023-05-10",
    time: "09:20 AM",
    hid: "HID001",
    amount: 3000,
    note: "Additional deposit",
    type: "deposit" as const,
  },
  {
    id: "W00088",
    date: "2023-05-08",
    time: "02:30 PM",
    hid: "HID004",
    amount: 1500,
    charges: 30,
    note: "Urgent withdrawal",
    type: "withdrawal" as const,
  },
];

const Dashboard = () => {
  const { holders, fetchHolders, isLoading } = useBank();
  
  useEffect(() => {
    fetchHolders();
  }, [fetchHolders]);

  // Calculate totals for stats
  const totalHolders = holders.length;
  const totalDeposits = holders.reduce((sum, holder) => sum + holder.totalDeposit, 0);
  const totalWithdrawals = holders.reduce((sum, holder) => sum + holder.withdraw, 0);
  const totalPenalties = holders.reduce((sum, holder) => sum + (holder.penalty || 0), 0);

  if (isLoading && holders.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTitle
        title="Dashboard"
        description="Overview of your banking system"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Account Holders"
          value={totalHolders}
          icon={<Users className="h-5 w-5" />}
          delay={0}
        />
        <StatCard
          title="Total Deposits"
          value={`${CURRENCY_SYMBOL}${totalDeposits.toLocaleString()}`}
          icon={<ArrowDownToLine className="h-5 w-5" />}
          trend={{ value: 8.2, isPositive: true }}
          delay={1}
        />
        <StatCard
          title="Total Withdrawals"
          value={`${CURRENCY_SYMBOL}${totalWithdrawals.toLocaleString()}`}
          icon={<ArrowUpToLine className="h-5 w-5" />}
          trend={{ value: 3.1, isPositive: false }}
          delay={2}
        />
        <StatCard
          title="Total Penalties"
          value={`${CURRENCY_SYMBOL}${totalPenalties.toLocaleString()}`}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: 1.5, isPositive: false }}
          delay={3}
        />
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ActivityChart />
      </div>

      {/* Accounts & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountsOverview holders={holders} />
        <TransactionsList transactions={mockTransactions} />
      </div>
    </Layout>
  );
};

export default Dashboard;
