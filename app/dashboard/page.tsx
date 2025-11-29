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

  const Card = ({
    title,
    subtitle,
    description,
    badge,
    onClick,
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
      className="group relative w-full text-left rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-4 md:px-5 md:py-5 flex flex-col gap-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.9)] hover:border-sky-500/70 hover:bg-slate-950/90 transition-all duration-200 cursor-pointer overflow-hidden min-h-[120px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between gap-2">
        <div>
          {subtitle && (
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-0.5">
              {subtitle}
            </p>
          )}
          <h3 className="text-sm md:text-base font-semibold text-slate-50">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-sky-500/15 border border-sky-500/60 text-sky-300">
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
      <div className="floating-orb w-72 h-72 bg-sky-500/30 -top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-indigo-500/30 bottom-[-80px] right-[-40px]" />

        <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-24 py-10 md:py-12 lg:py-16 space-y-8 md:space-y-10">
        {/* Topbar */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

          <div className="flex items-center gap-3 justify-between md:justify-end">
            {user && (
              <div className="text-right">
                <p className="text-xs font-medium text-slate-100">
                  {user.username}
                </p>
                <p className="text-[11px] text-slate-400">
                  {user.email}
                </p>
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

        {/* CONTENU */}
        <div className="space-y-7 md:space-y-8">
          {/* Ligne haute : OUTILS + TRAVAIL */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 md:gap-8">
            {/* OUTILS */}
            <section className="glass-card rounded-3xl border border-slate-800/80 bg-slate-950/75 px-5 py-5 md:px-7 md:py-7">
              <div className="mb-4 md:mb-5 flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                  Outils
                </p>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-sm md:text-base font-semibold text-slate-50">
                    Outils internes de la magistrature
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Accès rapide aux outils du quotidien.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <Card
                  subtitle="Outils"
                  title="Calculatrice"
                  description="Effectuer rapidement des calculs RP (amendes, intérêts, durées de peine…)."
                  badge="À venir"
                />
                <Card
                  subtitle="Outils"
                  title="Comptabilité"
                  description="Suivi des honoraires, frais de justice et mouvements financiers internes."
                  badge="À venir"
                />
                <Card
                  subtitle="Outils"
                  title="CAD"
                  description="Accès au CAD du DOJ : dossiers en cours, décisions et historiques."
                  badge="À venir"
                />
                <Card
                  subtitle="Documentation"
                  title="Guide – Législatif, Exécutif & Judiciaire"
                  description="Accès centralisé aux textes RP : lois, procédures, guides internes."
                  badge="À venir"
                />
                <Card
                  subtitle="Communication"
                  title="Messagerie interne"
                  description="Échanger avec les magistrats, greffiers et membres du DOJ."
                  badge="À venir"
                />
              </div>
            </section>

            {/* TRAVAIL */}
            <section className="glass-card rounded-3xl border border-slate-800/80 bg-slate-950/80 px-5 py-5 md:px-7 md:py-7">
              <div className="mb-4 md:mb-5 flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                  Travail
                </p>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-sm md:text-base font-semibold text-slate-50">
                    Gestion des dossiers et audiences
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Suivi des CI, procès et dossiers complexes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <Card
                  subtitle="Dossiers"
                  title="Comparutions immédiates"
                  description="Création et suivi des dossiers de CI en temps réel."
                  badge="À venir"
                />
                <Card
                  subtitle="Dossiers"
                  title="Procès"
                  description="Gestion des audiences planifiées et des décisions rendues."
                  badge="À venir"
                />
                <Card
                  subtitle="Dossiers"
                  title="Dossier 10-10"
                  description="Suivi des dossiers complexes nécessitant une instruction approfondie."
                  badge="À venir"
                />
                <Card
                  subtitle="Casier"
                  title="Effacement de casier"
                  description="Traitement des demandes d’effacement de casier judiciaire RP."
                  badge="À venir"
                />
              </div>
            </section>
          </div>

          {/* ANNUAIRE en dessous, full width */}
          <section className="glass-card rounded-3xl border border-slate-800/80 bg-slate-950/85 px-5 py-5 md:px-7 md:py-7">
            <div className="mb-4 md:mb-5 flex flex-col gap-1">
              <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                Annuaire
              </p>
            <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-sm md:text-base font-semibold text-slate-50">
                  Accès annuaire interne
                </h2>
                <p className="text-[11px] text-slate-500">
                  Informations sur les magistrats et effectifs DOJ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <Card
                subtitle="Annuaire"
                title="Mon profil magistrat"
                description="Consulter et modifier les informations de votre profil DOJ."
                badge="À venir"
              />
              <Card
                subtitle="Annuaire"
                title="Effectif & organigramme"
                description="Liste des magistrats, greffiers et postes au sein du DOJ."
                badge="À venir"
              />
            </div>
          </section>

          {/* INFO VERSION */}
          <section className="glass-card rounded-2xl border border-slate-800/80 bg-slate-950/80 px-5 py-4 text-[11px] text-slate-400">
            <p className="mb-1.5 font-medium text-slate-200">
              Version Alpha – Portail DOJ
            </p>
            <p>
              Certaines sections sont marquées comme{" "}
              <span className="text-sky-300">“À venir”</span> et seront
              activées au fur et à mesure de leur développement.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
