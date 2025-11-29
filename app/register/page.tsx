"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l’inscription.");
        setLoading(false);
        return;
      }

      setSuccess("Compte créé avec succès !");
      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      console.error(err);
      setError("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">

        <div className="mb-10 flex flex-col items-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-xl font-bold">
            DOJ
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Créer un compte DOJ
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Réservé aux membres autorisés.
          </p>
        </div>

        <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl p-8">

          <div className="mb-6">
            <div className="text-sm text-slate-300 mb-2">Déjà un compte ?</div>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 transition font-medium text-sm"
            >
              Se connecter
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-700"></div>
            <span>ou</span>
            <div className="h-px flex-1 bg-slate-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Nom d&apos;utilisateur*
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Email*
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                required
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Mot de passe*
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                required
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-slate-300">
                Confirmer le mot de passe*
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                required
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 text-sm"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 rounded-md px-3 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-sky-600 hover:bg-sky-500 rounded-lg disabled:opacity-60 transition text-sm"
            >
              {loading ? "Création..." : "Créer un compte"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-[11px] text-slate-500">
          Department of Justice – San Andreas
        </p>
      </div>
    </main>
  );
}
