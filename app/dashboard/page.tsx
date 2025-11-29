"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserInfo {
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("doj_user");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doj_token");
    localStorage.removeItem("doj_user");
    if (typeof document !== "undefined") {
      document.cookie = "doj_token=; Path=/; Max-Age=0; SameSite=Lax; Secure";
    }
    router.push("/");
  };

  return (
    <main className="min-h-screen body-gradient relative overflow-hidden text-slate-50">
      {/* Orbes décoratives */}
      <div className="floating-orb w-72 h-72 bg-sky-500/40 -top-16 left-[-40px]" />
      <div className="floating-orb w-80 h-80 bg-indigo-500/35 bottom-[-70px] right-[-40px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="badge-orbit h-12 w-12 md:h-14 md:w-14 rounded-full border border-sky-300/60 bg-slate-950/90 flex items-center justify-center text-[10px] md:text-xs font-semibold tracking-[0.18em]">
              DOJ
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300/80">
                Department of Justice – San Andreas
              </p>
              <h1 className="text-xl md:text-2xl font-semibold">
                Tableau de bord interne
              </h1>
              <p className="text-xs text-slate-300/80 mt-1">
                Vue d&apos;ensemble sur les activités et outils du DOJ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium">
                  {user.username}
                </p>
                <p className="text-[11px] text-slate-300/80">
                  {user.role === "admin" ? "Administrateur" : "Membre DOJ"}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs px-3.5 py-2 rounded-xl border border-slate-600/80 bg-slate-900/60 hover:border-red-400/90 hover:bg-red-500/10 hover:text-red-100 transition-all duration-200"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Grille principale */}
        <section className="grid gap-4 md:grid-cols-3 mb-6">
          {/* Carte 1 */}
          <div className="glass-card p-4 md:p-5 col-span-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400/80 mb-1">
              Espace magistrature
            </p>
            <h2 className="text-lg font-semibold mb-2">
              Gestion des audiences &amp; décisions
            </h2>
            <p className="text-sm text-slate-300/90 mb-4">
              À terme, ce module permettra de visualiser les audiences à venir,
              les décisions rendues, les registres et les documents officiels
              associés à chaque affaire.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/50">
                Audiences
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/50">
                Décisions
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-400/50">
                Registres
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/50">
                Notifications
              </span>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="glass-card p-4 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400/80 mb-1">
              Statut RP
            </p>
            <h3 className="text-sm font-semibold mb-3">État du DOJ</h3>
            <ul className="space-y-2 text-xs text-slate-300/90">
              <li className="flex justify-between">
                <span>Sessions de cour</span>
                <span className="text-sky-300">En configuration</span>
              </li>
              <li className="flex justify-between">
                <span>Intégration fiches magistrats</span>
                <span className="text-violet-300">À implémenter</span>
              </li>
              <li className="flex justify-between">
                <span>Base de données décisions</span>
                <span className="text-emerald-300">Structure en cours</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Deuxième ligne */}
        <section className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="glass-card p-4 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400/80 mb-1">
              Prochaines fonctionnalités
            </p>
            <ul className="mt-2 space-y-2 text-xs text-slate-300/90">
              <li>• Module de génération automatique d&apos;ordonnances.</li>
              <li>• Suivi des convocations et des notifications RP.</li>
              <li>• Historique des connexions et journaux d&apos;activité.</li>
            </ul>
          </div>

          <div className="glass-card p-4 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400/80 mb-1">
              Raccourcis rapides
            </p>
            <div className="mt-3 grid gap-2 text-xs">
              <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/80 hover:border-sky-400/80 hover:bg-sky-500/10 transition-all duration-200">
                • Ouvrir l&apos;espace magistrature (à venir)
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/80 hover:border-indigo-400/80 hover:bg-indigo-500/10 transition-all duration-200">
                • Accéder aux registres de décisions (à venir)
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/80 hover:border-violet-400/80 hover:bg-violet-500/10 transition-all duration-200">
                • Centre de notifications (à venir)
              </button>
            </div>
          </div>

          <div className="glass-card p-4 md:p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400/80 mb-1">
              Profil utilisateur
            </p>
            {user ? (
              <div className="mt-3 text-xs text-slate-300/90 space-y-1.5">
                <p>
                  <span className="text-slate-400">Identifiant : </span>
                  <span>{user.username}</span>
                </p>
                <p>
                  <span className="text-slate-400">Email : </span>
                  <span>{user.email}</span>
                </p>
                <p>
                  <span className="text-slate-400">Rôle : </span>
                  <span>{user.role}</span>
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">
                Les informations du profil seront chargées à partir de la base
                utilisateur.
              </p>
            )}
          </div>
        </section>

        <p className="text-[11px] text-slate-400/80 mt-4">
          Version préliminaire du portail DOJ RP. Ce tableau de bord servira de
          base pour connecter tous les outils internes (magistrature, greffe,
          décisions, registres).
        </p>
      </div>
    </main>
  );
}
