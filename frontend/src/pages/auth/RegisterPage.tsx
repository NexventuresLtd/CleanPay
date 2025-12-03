import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Alert } from "../../components/common/Alert";
import type { RegisterData } from "../../types";

const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["password_confirm"],
  });

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  // Password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData & { password_confirm: string }>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setError(null);
    setIsLoading(true);

    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-success via-emerald-600 to-teal-700 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Dotted Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">CleanPay</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
                Start your
                <br />
                journey today
              </h1>
              <p className="text-lg text-white/80 max-w-md leading-relaxed">
                Join thousands of businesses already using CleanPay to
                streamline their payment operations.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Setup</h3>
                  <p className="text-sm text-white/70">
                    Get started in under 5 minutes with our guided onboarding
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    No Credit Card Required
                  </h3>
                  <p className="text-sm text-white/70">
                    Start with our free tier, upgrade when you're ready
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Support</h3>
                  <p className="text-sm text-white/70">
                    Our team is always here to help you succeed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-white/70">Uptime</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-white/70">Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold">$2B+</div>
              <div className="text-sm text-white/70">Processed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-bg-subtle px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-text-primary">
                CleanPay
              </span>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
              Create your account
            </h1>
            <p className="text-text-secondary">
              Fill in your details to get started
            </p>
          </div>

          {/* Register Form Card */}
          <div className="bg-bg-base rounded-2xl shadow-xl p-8 border border-border-muted">
            {error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  fullWidth
                  error={errors.first_name?.message}
                  {...register("first_name")}
                />

                <Input
                  label="Last name"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  fullWidth
                  error={errors.last_name?.message}
                  {...register("last_name")}
                />
              </div>

              <Input
                label="Work email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                fullWidth
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                fullWidth
                error={errors.password?.message}
                {...register("password", {
                  onChange: (e) => setPassword(e.target.value),
                })}
              />

              {/* Password Requirements */}
              <div className="bg-bg-subtle rounded-lg p-3 border border-border-muted">
                <p className="text-xs font-medium text-text-secondary mb-2">
                  Password must contain:
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.length
                        ? "text-success"
                        : "text-text-tertiary"
                    }`}
                  >
                    {passwordChecks.length ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    8+ characters
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.uppercase
                        ? "text-success"
                        : "text-text-tertiary"
                    }`}
                  >
                    {passwordChecks.uppercase ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    Uppercase letter
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.lowercase
                        ? "text-success"
                        : "text-text-tertiary"
                    }`}
                  >
                    {passwordChecks.lowercase ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    Lowercase letter
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.number
                        ? "text-success"
                        : "text-text-tertiary"
                    }`}
                  >
                    {passwordChecks.number ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    Number
                  </div>
                </div>
                <p className="text-xs text-text-tertiary mt-2 pt-2 border-t border-border-muted">
                  💡 Tip: Avoid common passwords like "password123" or "qwerty"
                </p>
              </div>

              <Input
                label="Confirm password"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                fullWidth
                error={errors.password_confirm?.message}
                {...register("password_confirm")}
              />

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-border-emphasis text-primary focus:ring-primary focus:ring-offset-0 transition-colors"
                />
                <label className="text-sm text-text-secondary leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                Create account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-base"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-bg-base text-text-tertiary">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-border-emphasis rounded-xl text-text-primary font-medium hover:bg-bg-subtle hover:border-primary transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14"
                />
              </svg>
              Sign in instead
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-tertiary">
              © 2025 CleanPay. All rights reserved.
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-sm">
              <a
                href="#"
                className="text-text-tertiary hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <span className="text-border-emphasis">•</span>
              <a
                href="#"
                className="text-text-tertiary hover:text-primary transition-colors"
              >
                Terms
              </a>
              <span className="text-border-emphasis">•</span>
              <a
                href="#"
                className="text-text-tertiary hover:text-primary transition-colors"
              >
                Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
