"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, confirmPassword: form.confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Registration failed");
        return;
      }

      // Auto sign in
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Welcome to Pet-o-philia!");
      router.push("/account");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mono-label">/create account</p>
          <h1 className="mt-2 font-serif text-[48px] italic leading-tight text-primary">
            Join the pantry.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Create your Pet-o-philia account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "name", label: "Full name", type: "text", field: "name", placeholder: "June Mehta", autoComplete: "name" },
            { id: "email", label: "Email", type: "email", field: "email", placeholder: "your@email.com", autoComplete: "email" },
            { id: "password", label: "Password", type: "password", field: "password", placeholder: "••••••••", autoComplete: "new-password" },
            { id: "confirmPassword", label: "Confirm password", type: "password", field: "confirmPassword", placeholder: "••••••••", autoComplete: "new-password" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-semibold text-primary mb-1">
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                required
                autoComplete={f.autoComplete}
                value={form[f.field as keyof typeof form]}
                onChange={(e) => set(f.field, e.target.value)}
                className="w-full rounded-lg border border-border/15 bg-white px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder={f.placeholder}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent py-3 text-sm font-bold text-white shadow-soft-sm transition-all hover:bg-[#128a96] hover:shadow-soft-sm-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
