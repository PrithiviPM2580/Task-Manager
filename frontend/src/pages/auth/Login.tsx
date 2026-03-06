import AuthLayout from "@/components/layout/AuthLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  loginFormSchema,
  type LoginFormData,
} from "@/validation/auth.validation";
import { login, getUserProfile } from "@/services/auth.service";
import { useUser } from "@/context/userContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    setLoading(true);

    try {
      await login(data);
      // fetch full profile (includes role and profileImageUrl)
      const profile = await getUserProfile();
      const user = profile.user;

      updateUser(user);
      toast.success("Login successful");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials and try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="modern-form w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="form-title text-2xl">Login</CardTitle>
          <CardDescription className="form-description">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="form-body flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <div className="relative">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      >
                        <path
                          strokeWidth="1.5"
                          stroke="currentColor"
                          d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                        />
                      </svg>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        className="h-11 pl-10 text-base"
                        aria-invalid={fieldState.invalid}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      >
                        <path
                          strokeWidth="1.5"
                          stroke="currentColor"
                          d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
                        />
                      </svg>
                      <Input
                        {...field}
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        className="h-11 pl-10 pr-11 text-base"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                          >
                            <path
                              strokeWidth="1.5"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3L21 21M10.584 10.588C10.2117 10.9605 10 11.4657 10 12C10 13.1046 10.8954 14 12 14C12.5343 14 13.0395 13.7883 13.412 13.416M9.363 5.365C10.2107 5.12194 11.0994 4.99846 12 5C19 5 22 12 22 12C21.5439 13.0084 20.9405 13.9436 20.21 14.775M6.228 6.23C4.44886 7.41376 3.00096 9.03056 2 12C2 12 5 19 12 19C13.9405 19.0068 15.8374 18.4234 17.438 17.327"
                            />
                          </svg>
                        ) : (
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                          >
                            <path
                              strokeWidth="1.5"
                              stroke="currentColor"
                              d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                            />
                            <circle
                              strokeWidth="1.5"
                              stroke="currentColor"
                              r="3"
                              cy="12"
                              cx="12"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 text-base bg-[#3B83F7] hover:bg-[#256de0]"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="font-medium text-[#3B83F7] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Login;
