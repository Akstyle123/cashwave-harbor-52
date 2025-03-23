
import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { CHART_COLORS } from "@/config/constants";

// Sample data (would be replaced with real data in production)
const generateSampleData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      deposits: Math.floor(Math.random() * 10000) + 5000,
      withdrawals: Math.floor(Math.random() * 8000) + 3000,
    });
  }
  
  return data;
};

interface ActivityChartProps {
  className?: string;
}

const ActivityChart = ({ className }: ActivityChartProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');
  
  const data = generateSampleData(
    timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90
  );

  const handleRangeChange = (range: 'week' | 'month' | 'quarter') => {
    setTimeRange(range);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`dashboard-card dark:dashboard-card-dark overflow-hidden ${className}`}
    >
      <div className="p-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-semibold">Activity Overview</h3>
          <p className="text-sm text-muted-foreground">Deposit and withdrawal trends</p>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant={timeRange === 'week' ? 'default' : 'outline'} 
            onClick={() => handleRangeChange('week')}
          >
            Week
          </Button>
          <Button 
            size="sm" 
            variant={timeRange === 'month' ? 'default' : 'outline'} 
            onClick={() => handleRangeChange('month')}
          >
            Month
          </Button>
          <Button 
            size="sm" 
            variant={timeRange === 'quarter' ? 'default' : 'outline'} 
            onClick={() => handleRangeChange('quarter')}
          >
            Quarter
          </Button>
        </div>
      </div>
      
      <div className="p-5 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickMargin={10}
              stroke="rgba(156, 163, 175, 0.5)"
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              stroke="rgba(156, 163, 175, 0.5)"
            />
            <Tooltip 
              formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(226, 232, 240, 1)',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke={CHART_COLORS.success}
              activeDot={{ r: 5 }}
              strokeWidth={2}
              name="Deposits"
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke={CHART_COLORS.primary}
              activeDot={{ r: 5 }}
              strokeWidth={2}
              name="Withdrawals"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ActivityChart;
