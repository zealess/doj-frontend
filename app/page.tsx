"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        setError(data.message || "Identifiants incorrects.");
        setLoading(false);
        return;
      }

      // token + user
      localStorage.setItem("doj_token", data.token);
      if (data.user) {
        localStorage.setItem("doj_user", JSON.stringify(data.user));
      }

      // cookie pour le middleware
      if (typeof document !== "undefined") {
        document.cookie = `doj_token=${data.token}; Path=/; Max-Age=${
          7 * 24 * 60 * 60
        }; SameSite=Lax; Secure`;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erreur serveur. Merci de réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen body-gradient relative flex items-center justify-center overflow-hidden">
      {/* Orbes de fond */}
      <div className="floating-orb w-64 h-64 bg-sky-500/40 -top-10 -left-10" />
      <div className="floating-orb w-72 h-72 bg-indigo-500/40 bottom-[-60px] right-[-40px]" />

      <div className="relative z-10 w-full max-w-5xl px-4 py-10 md:py-14 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        {/* Panneau gauche : identité DOJ */}
        <section className="glass-card w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-8">
            <div className="badge-orbit h-14 w-14 md:h-16 md:w-16 rounded-full border border-sky-300/50 bg-slate-950/80 flex items-center justify-center text-xs md:text-sm font-semibold tracking-[0.18em]">
              DOJ
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300/80">
                San Andreas
              </p>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
                Portail interne de la Magistrature
              </h1>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-200">
            <p className="text-slate-300/90">
              Accédez à votre espace sécurisé pour consulter les audiences,
              décisions et dossiers internes du Department of Justice.
            </p>
            <div className="grid gap-2 text-xs text-slate-300/90">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <span>Accès chiffré &amp; authentification par compte nominatif.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>
                  Espace réservé aux magistrats, greffiers et personnels autorisés.
                </span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[11px] text-slate-400/80">
            Toute connexion et activité est susceptible d&apos;être journalisée
            dans un cadre RP. Utilisation strictement interne.
          </p>
        </section>

        {/* Panneau droit : formulaire de connexion */}
        <section className="glass-card w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <header className="mb-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400/80 mb-1">
              Connexion
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-slate-50">
              Se connecter à son espace
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Entrez vos identifiants personnels pour accéder au portail.
            </p>
          </header>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="mb-5 w-full text-xs font-medium text-sky-100 bg-sky-600/80 hover:bg-sky-500 transition-all duration-300 py-2.5 rounded-xl shadow-[0_10px_30px_rgba(56,189,248,0.35)]"
          >
            Créer un compte DOJ
          </button>

          <div className="flex items-center gap-3 mb-5 text-[11px] text-slate-500">
            <span className="h-px flex-1 bg-slate-600" />
            <span>ou se connecter</span>
            <span className="h-px flex-1 bg-slate-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-1 text-xs">
              <label className="font-medium text-slate-200">
                Nom d&apos;utilisateur ou email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="ex. a.targaryen"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 px-3.5 py-2.5 text-[13px] text-slate-50 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-slate-200">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 px-3.5 py-2.5 text-[13px] text-slate-50 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-300 bg-red-950/50 border border-red-800/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full text-sm font-medium rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 hover:from-sky-400 hover:via-indigo-400 hover:to-violet-400 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 shadow-[0_12px_35px_rgba(79,70,229,0.55)] transition-transform duration-200 hover:-translate-y-[1px]"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
