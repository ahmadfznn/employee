"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import resetPassword from "@/services/resetPassword";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    const res = await resetPassword({ email });
    setLoading(false);
    if (res.status) {
      setMessage(res.data?.message || "Password reset link sent to your email.");
    } else {
      setError(res.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Back to sign in
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to receive a password reset link.
            </p>
          </div>
          {message && (
            <div className="mb-4 text-sm text-green-600">{message}</div>
          )}
          {error && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Button className="w-full" size="sm" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 