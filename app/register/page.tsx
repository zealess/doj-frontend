"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

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

      setSuccess("Compte créé avec succès. Redirection en cours…");
      setTimeout(() => router.push("/"), 1100);
    } catch (err) {
      console.error(err);
      setError("Erreur serveur. Merci de réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen body-gradient relative flex items-center justify-center overflow-hidden">
      <div className="floating-orb w-60 h-60 bg-sky-500/40 top-[-40px] right-[-30px]" />
      <div className="floating-orb w-72 h-72 bg-indigo-500/40 bottom-[-70px] left-[-50px]" />

      <div className="relative z-10 w-full max-w-5xl px-4 py-10 md:py-14 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        {/* Bloc infos */}
        <section className="glass-card w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="badge-orbit h-12 w-12 md:h-14 md:w-14 rounded-full border border-indigo-300/60 bg-slate-950/80 flex items-center justify-center text-[10px] md:text-xs font-semibold tracking-[0.18em]">
                DOJ
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-300/80">
                  Inscription
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
                  Création d&apos;un compte DOJ
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-300/90 mb-4">
              Cet espace est réservé aux membres autorisés du Department of
              Justice (magistrats, greffiers, personnels habilités).
            </p>

            <ul className="space-y-2 text-xs text-slate-300/90">
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Utilisez un identifiant RP cohérent avec votre personnage.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span>
                  L&apos;adresse email sert à la récupération et à la gestion interne.
                </span>
              </li>
            </ul>
          </div>

          <p className="mt-8 text-[11px] text-slate-400/80">
            En validant votre inscription, vous acceptez le cadre RP et les
            règles internes du DOJ.
          </p>
        </section>

        {/* Formulaire */}
        <section className="glass-card w-full md:w-1/2 p-6 md:p-8 flex flex-col">
  {/* CTA d'abord */}
  <button
    type="button"
    onClick={() => router.push("/")}
    className="mb-5 w-full text-xs font-medium text-sky-100 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 transition-all duration-300 py-2.5 rounded-xl"
  >
    J&apos;ai déjà un compte
  </button>

  <div className="flex items-center gap-3 mb-5 text-[11px] text-slate-500">
    <span className="h-px flex-1 bg-slate-600" />
    <span>ou créer un accès</span>
    <span className="h-px flex-1 bg-slate-600" />
  </div>

  {/* Titre juste au-dessus du formulaire */}
  <header className="mb-4">
    <p className="text-xs uppercase tracking-[0.23em] text-slate-400/80 mb-1">
      Informations du compte
    </p>
    <h2 className="text-lg md:text-xl font-semibold text-slate-50">
      Créer un accès sécurisé
    </h2>
    <p className="text-xs text-slate-400 mt-1">
      Complétez les champs ci-dessous pour générer vos identifiants.
    </p>
  </header>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-1 text-xs">
              <label className="font-medium text-slate-200">
                Nom d&apos;utilisateur RP
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="ex. Alessandro.Targaryen"
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 px-3.5 py-2.5 text-[13px] text-slate-50 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-slate-200">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="prenom.nom@exemple.com"
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 px-3.5 py-2.5 text-[13px] text-slate-50 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-slate-200">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40 px-3.5 py-2.5 text-[13px] text-slate-50 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-slate-200">
                Confirmation du mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/40 px-3.5 py-2.5 text-[13px] text-slate-50 outline-none transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-[11px] text-red-300 bg-red-950/50 border border-red-800/70 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/70 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full text-sm font-medium rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 hover:from-sky-400 hover:via-indigo-400 hover:to-violet-400 disabled:opacity-60 disabled:cursor-not-allowed py-2.5 shadow-[0_12px_35px_rgba(79,70,229,0.55)] transition-transform duration-200 hover:-translate-y-[1px]"
            >
              {loading ? "Création du compte..." : "Créer le compte"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
