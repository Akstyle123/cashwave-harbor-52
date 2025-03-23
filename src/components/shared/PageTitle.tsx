
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const PageTitle = ({ 
  title, 
  description, 
  children, 
  className 
}: PageTitleProps) => {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
      className
    )}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 mt-2 sm:mt-0">{children}</div>
      )}
    </div>
  );
};

export default PageTitle;
