
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BANK_NAME } from "@/config/constants";

interface BrandLogoProps {
  className?: string;
  large?: boolean;
}

const BrandLogo = ({ className, large = false }: BrandLogoProps) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2 font-medium",
        large ? "text-2xl" : "text-lg",
        className
      )}
    >
      <div className={cn(
        "relative rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center overflow-hidden",
        large ? "w-9 h-9" : "w-7 h-7"
      )}>
        <span className={cn(
          "relative z-10",
          large ? "text-lg" : "text-sm"
        )}>MB</span>
        <div className="absolute top-0 right-0 w-4 h-4 bg-blue-400 rounded-full opacity-50 blur-sm transform translate-x-2 -translate-y-2"></div>
      </div>
      <span className="font-semibold tracking-tight">{BANK_NAME}</span>
    </Link>
  );
};

export default BrandLogo;
