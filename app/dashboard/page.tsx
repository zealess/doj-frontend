"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  username: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("doj_token")
        : null;

    if (!token) {
      router.push("/");
      return;
    }

    const storedUser =
      typeof window !== "undefined"
        ? localStorage.getItem("doj_user")
        : null;

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur parsing user", e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("doj_token");
      localStorage.removeItem("doj_user");
      document.cookie =
        "doj_token=; Path=/; Max-Age=0; SameSite=Lax; Secure";
    }
    router.push("/");
  };

  // petit helper pour les cartes
  const Card = ({
    title,
    subtitle,
    description,
    onClick,
    badge,
  }: {
    title: string;
    subtitle?: string;
    description?: string;
    badge?: string;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="group text-left w-full glass-card bg-slate-900/70 border border-slate-800/80 hover:border-sky-500/70 hover:bg-slate-900/90 transition-all duration-200 rounded-2xl px-4 py-4 md:px-5 md:py-5 flex flex-col gap-1.5 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {subtitle}
          </p>
          <h3 className="text-sm md:text-base font-semibold text-slate-50">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-sky-500/15 border border-sky-500/50 text-sky-300">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-[11px] md:text-xs text-slate-400 mt-1">
          {description}
        </p>
      )}
    </button>
  );

  return (
    <main className="min-h-screen body-gradient relative flex items-stretch justify-center overflow-hidden">
      {/* Orbes de fond */}
      <div className="floating-orb w-72 h-72 bg-sky-500/30 -top-10 -left-16" />
      <div className="floating-orb w-80 h-80 bg-indigo-500/30 bottom-[-60px] right-[-40px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 md:py-8 flex flex-col gap-5">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-sky-400/60 bg-slate-950/90 flex items-center justify-center text-[11px] font-semibold text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.55)]">
              DOJ
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-sky-300/80">
                San Andreas
              </p>
              <h1 className="text-sm md:text-base font-semibold text-slate-50">
                Portail interne – Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="text-right">
                <p className="text-xs font-medium text-slate-100">
                  {user.username}
                </p>
                <p className="text-[11px] text-slate-400">{user.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/80 hover:border-red-500/70 hover:text-red-300 transition-all duration-200"
            >
              Se déconnecter
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Colonne principale */}
          <div className="flex-1 space-y-5">
            {/* Section OUTILS */}
            <section className="glass-card p-4 md:p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                    Outils
                  </p>
                  <h2 className="text-sm md:text-base font-semibold text-slate-50">
                    Outils internes de la magistrature
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card
                  subtitle="Outils"
                  title="Calculatrice"
                  description="Effectuer rapidement des calculs RP (amendes, intérêts, durées de peine…)."
                  badge="À venir"
                  // onClick={() => router.push("/outils/calculatrice")}
                />
                <Card
                  subtitle="Outils"
                  title="Comptabilité"
                  description="Suivi des honoraires, frais de justice et mouvements financiers internes."
                  badge="À venir"
                  // onClick={() => router.push("/outils/comptabilite")}
                />
                <Card
                  subtitle="Outils"
                  title="CAD"
                  description="Accès au CAD du DOJ : dossiers en cours, décisions et historiques."
                  badge="À venir"
                  // onClick={() => router.push("/outils/cad")}
                />
                <Card
                  subtitle="Documentation"
                  title="Guide – Législatif, Exécutif & Judiciaire"
                  description="Accès centralisé aux textes RP : lois, procédures, guides internes."
                  badge="À venir"
                  // onClick={() => router.push("/outils/guides")}
                />
                <Card
                  subtitle="Communication"
                  title="Messagerie interne"
                  description="Échanger avec les magistrats, greffiers et membres du DOJ."
                  badge="À venir"
                  // onClick={() => router.push("/outils/messagerie")}
                />
              </div>
            </section>

            {/* Section TRAVAIL */}
            <section className="glass-card p-4 md:p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                    Travail
                  </p>
                  <h2 className="text-sm md:text-base font-semibold text-slate-50">
                    Gestion des dossiers et audiences
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card
                  subtitle="Dossiers"
                  title="Comparutions immédiates"
                  description="Création et suivi des dossiers de CI en temps réel."
                  badge="À venir"
                  // onClick={() => router.push("/travail/comparution-immediate")}
                />
                <Card
                  subtitle="Dossiers"
                  title="Procès"
                  description="Gestion des audiences planifiées et des décisions rendues."
                  badge="À venir"
                  // onClick={() => router.push("/travail/proces")}
                />
                <Card
                  subtitle="Dossiers"
                  title="Dossier 10-10"
                  description="Suivi des dossiers complexes nécessitant une instruction approfondie."
                  badge="À venir"
                  // onClick={() => router.push("/travail/dossier-10-10")}
                />
                <Card
                  subtitle="Casier"
                  title="Effacement de casier"
                  description="Traitement des demandes d’effacement de casier judiciaire RP."
                  badge="À venir"
                  // onClick={() => router.push("/travail/effacement-casier")}
                />
              </div>
            </section>
          </div>

          {/* Colonne ANNNUAIRE */}
          <aside className="w-full lg:w-72 space-y-5">
            <section className="glass-card p-4 md:p-5 rounded-2xl">
              <div className="mb-3">
                <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                  Annuaire
                </p>
                <h2 className="text-sm md:text-base font-semibold text-slate-50">
                  Accès annuaire interne
                </h2>
              </div>

              <div className="space-y-3">
                <Card
                  subtitle="Annuaire"
                  title="Mon profil magistrat"
                  description="Consulter et modifier les informations de votre profil DOJ."
                  badge="À venir"
                  // onClick={() => router.push("/annuaire/profil")}
                />
                <Card
                  subtitle="Annuaire"
                  title="Effectif & organigramme"
                  description="Liste des magistrats, greffiers et postes au sein du DOJ."
                  badge="À venir"
                  // onClick={() => router.push("/annuaire/effectif")}
                />
              </div>
            </section>

            <section className="glass-card p-4 rounded-2xl text-[11px] text-slate-400">
              <p className="mb-1 font-medium text-slate-200">
                Version Alpha – Portail DOJ
              </p>
              <p>
                Certaines sections sont marquées comme{" "}
                <span className="text-sky-300">“À venir”</span> et seront
                activées au fur et à mesure de leur développement.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
