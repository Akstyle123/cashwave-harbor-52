
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Holder } from "@/types";
import { CURRENCY_SYMBOL, APP_ROUTES } from "@/config/constants";

interface AccountsOverviewProps {
  holders: Holder[];
  className?: string;
}

const AccountsOverview = ({ holders, className }: AccountsOverviewProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort accounts by balance (highest first)
  const filteredHolders = holders
    .filter(holder => 
      holder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holder.hid.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5); // Limit to 5 accounts

  const totalBalance = holders.reduce((sum, holder) => sum + holder.balance, 0);

  const handleAddAccount = () => {
    navigate(APP_ROUTES.ACCOUNTS);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`dashboard-card dark:dashboard-card-dark overflow-hidden ${className}`}
    >
      <div className="p-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-semibold">Account Holders</h3>
          <p className="text-sm text-muted-foreground">
            Total Balance: <span className="font-medium">{CURRENCY_SYMBOL}{totalBalance.toLocaleString()}</span>
          </p>
        </div>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search accounts..."
              className="pl-8 w-full sm:w-[180px] h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button size="sm" onClick={handleAddAccount}>
            <PlusCircle className="mr-1 h-4 w-4" />
            New Account
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Holder ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Total Deposits</TableHead>
              <TableHead>Withdrawals</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHolders.length > 0 ? (
              filteredHolders.map((holder) => (
                <TableRow key={holder.hid} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`${APP_ROUTES.ACCOUNTS}/${holder.hid}`)}>
                  <TableCell className="font-medium">{holder.hid}</TableCell>
                  <TableCell>{holder.name}</TableCell>
                  <TableCell>{CURRENCY_SYMBOL}{holder.totalDeposit.toLocaleString()}</TableCell>
                  <TableCell>{CURRENCY_SYMBOL}{holder.withdraw.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{CURRENCY_SYMBOL}{holder.balance.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      holder.status === "To give" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : holder.status === "To take"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {holder.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  {searchQuery ? "No accounts found matching your search." : "No accounts found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {holders.length > 5 && (
        <div className="p-4 border-t text-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(APP_ROUTES.ACCOUNTS)}>
            View all accounts
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default AccountsOverview;
