"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur de connexion.");
        setLoading(false);
        return;
      }

      localStorage.setItem("doj_token", data.token);
      
// On pose aussi un cookie lisible par le middleware
if (typeof document !== "undefined") {
  document.cookie = `doj_token=${data.token}; Path=/; Max-Age=${
    7 * 24 * 60 * 60
  }; SameSite=Lax; Secure`;
}

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erreur serveur. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">
        <div className="mb-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-4 h-16 w-16 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-xl font-bold">
            DOJ
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Connexion au Portail DOJ
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Accédez à votre espace magistrature, greffe et dossiers.
          </p>
        </div>

        {/* CARD */}
        <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 backdrop-blur-xl p-6 md:p-8">

          <div className="mb-6">
            <div className="text-sm text-slate-300 mb-2">Nouveau sur le portail ?</div>
            <button
              onClick={() => router.push("/register")}
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 transition font-medium text-sm"
            >
              Créer un compte
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-700" />
            <span>ou</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nom d&apos;utilisateur ou email*
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-sky-500 text-sm"
                placeholder="ex : a.targaryen"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mot de passe*
              </label>
              <input
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-sky-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-60 transition font-medium text-sm"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

          </form>
        </div>

        <p className="mt-8 text-[11px] text-slate-500">
          Department of Justice – San Andreas · Accès réservé aux personnels autorisés.
        </p>
      </div>
    </main>
  );
}
