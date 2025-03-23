
import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, ArrowUpRight, ArrowDownLeft, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";
import { CURRENCY_SYMBOL } from "@/config/constants";

interface TransactionsListProps {
  transactions: Transaction[];
  className?: string;
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "deposit":
      return (
        <div className="p-1.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <ArrowDownLeft className="h-3.5 w-3.5" />
        </div>
      );
    case "withdrawal":
      return (
        <div className="p-1.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      );
    case "penalty":
      return (
        <div className="p-1.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
        </div>
      );
    default:
      return null;
  }
};

const TransactionsList = ({ transactions, className }: TransactionsListProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Display the most recent transactions first (limit to 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`dashboard-card dark:dashboard-card-dark overflow-hidden ${className}`}
    >
      <div className="p-5 border-b">
        <h3 className="font-semibold">Recent Transactions</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.hid}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`${transaction.type === 'deposit' ? 'text-green-600 dark:text-green-500' : transaction.type === 'withdrawal' ? 'text-red-600 dark:text-red-500' : 'text-amber-600 dark:text-amber-500'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{CURRENCY_SYMBOL}{transaction.amount.toLocaleString()}
                    </div>
                    {transaction.charges && (
                      <div className="text-xs text-muted-foreground">
                        Fee: {CURRENCY_SYMBOL}{transaction.charges.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.date}</div>
                    <div className="text-xs text-muted-foreground">{transaction.time}</div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTransaction(transaction)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Export receipt</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No recent transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {recentTransactions.length > 0 && (
        <div className="p-4 border-t text-center">
          <Button variant="ghost" size="sm">View all transactions</Button>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionsList;
