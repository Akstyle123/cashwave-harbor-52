
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import { BANK_NAME, OTP_EXPIRY_MINUTES } from "@/config/constants";
import BrandLogo from "@/components/shared/BrandLogo";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Form schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter a valid OTP").max(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Login = () => {
  const { login, verifyOTP, isLoading } = useAuth();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // OTP form
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const onLoginSubmit = async (values: LoginFormValues) => {
    const success = await login({
      email: values.email,
      password: values.password,
      ip: "Web Client",
    });

    if (success) {
      setEmail(values.email);
      setShowOtpForm(true);
      // Start countdown for OTP expiry
      setResendDisabled(true);
      setCountdown(OTP_EXPIRY_MINUTES * 60);
    }
  };

  const onOtpSubmit = async (values: OTPFormValues) => {
    await verifyOTP({
      email: email,
      otp: values.otp,
    });
  };

  const handleBack = () => {
    setShowOtpForm(false);
    loginForm.reset();
    otpForm.reset();
    setResendDisabled(false);
    setCountdown(0);
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    const password = loginForm.getValues("password");
    if (!password) {
      toast.error("Password is required to resend OTP");
      return;
    }

    setResendDisabled(true);
    const success = await login({
      email: email,
      password: password,
      ip: "Web Client",
    });

    if (success) {
      toast.success("New OTP sent to your email");
      setCountdown(OTP_EXPIRY_MINUTES * 60);
      otpForm.reset();
    } else {
      setResendDisabled(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="space-y-2 text-center">
          <BrandLogo large className="justify-center mb-2" />
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access the banking system
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-card rounded-xl shadow-lg border animate-slide-up">
          {showOtpForm ? (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-medium">Verify OTP</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to {email}
                  </p>
                  {countdown > 0 && (
                    <p className="text-sm font-medium mt-2">
                      OTP expires in: <span className="text-primary">{formatTime(countdown)}</span>
                    </p>
                  )}
                </div>

                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP 
                          maxLength={6} 
                          {...field}
                          render={({ slots }) => (
                            <InputOTPGroup>
                              {slots.map((slot, index) => (
                                <InputOTPSlot key={index} {...slot} index={index} />
                              ))}
                            </InputOTPGroup>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : "Verify & Sign In"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={isLoading || resendDisabled}
                    className="w-full"
                  >
                    {resendDisabled ? (
                      <>
                        <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                        Resend available in {formatTime(countdown)}
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    disabled={isLoading}
                    className="w-full mt-2"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          autoComplete="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : "Continue"}
                </Button>
              </form>
            </Form>
          )}
        </div>

        <p className="text-sm text-center text-muted-foreground">
          By signing in, you agree to the terms and conditions of {BANK_NAME}
        </p>
      </div>
    </div>
  );
};

export default Login;
