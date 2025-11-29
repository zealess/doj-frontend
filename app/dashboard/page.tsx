"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserInfo {
  username: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  // Optionnel : récupérer les infos stockées localement
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
    // On nettoie tout
    localStorage.removeItem("doj_token");
    localStorage.removeItem("doj_user");
    if (typeof document !== "undefined") {
      document.cookie =
        "doj_token=; Path=/; Max-Age=0; SameSite=Lax; Secure";
    }
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Topbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-sky-500/60 bg-sky-500/10 flex items-center justify-center text-sm font-bold tracking-[0.15em]">
              DOJ
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Department of Justice – San Andreas
              </p>
              <p className="text-sm font-medium">
                Portail interne de la magistrature
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium">
                  {user.username}
                </p>
                <p className="text-[11px] text-slate-400">
                  {user.role === "admin" ? "Administrateur" : "Membre DOJ"}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-md border border-slate-700 hover:border-red-500/70 hover:text-red-300 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Vue d’ensemble de l’activité du Department of Justice.
          </p>
        </div>

        {/* Grille de cartes */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Dossiers en cours
            </p>
            <p className="text-3xl font-semibold">—</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Intégration future : liste des dossiers, audiences à venir, etc.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Magistrature & Greffe
            </p>
            <p className="text-sm text-slate-200">
              Accès rapide aux registres, audiences, convocations et outils
              internes.
            </p>
            <button
              className="mt-3 text-xs px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 transition"
              type="button"
            >
              (À venir) Ouvrir l’espace magistrature
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Notifications
            </p>
            <p className="text-sm text-slate-200">
              À terme : alertes audiences, décisions à signer, délais à
              respecter.
            </p>
          </div>
        </div>

        {/* Bas de page info */}
        <div className="mt-4 rounded-2xl border border-sky-900/60 bg-sky-950/30 p-4">
          <p className="text-xs font-semibold text-sky-300 uppercase tracking-wide mb-1">
            Information
          </p>
          <p className="text-sm text-slate-200">
            Ce tableau de bord est en cours de construction. Il servira de
            point d’entrée unique pour la gestion des audiences, des décisions,
            des registres et de l’ensemble des documents internes du DOJ RP.
          </p>
        </div>
      </section>
    </main>
  );
}
