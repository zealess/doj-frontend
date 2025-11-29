"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";

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
    className="
      group relative w-full text-left
      rounded-2xl border border-slate-800/80 bg-slate-950/60
      px-4 py-4 md:px-5 md:py-5
      flex flex-col gap-1.5
      shadow-[0_18px_45px_rgba(15,23,42,0.9)]
      hover:border-sky-500/70 hover:bg-slate-950/90
      transition-all duration-200
      cursor-pointer overflow-hidden min-h-[120px]
      transform-gpu hover:-translate-y-1 hover:scale-[1.02]
    "
  >
    {/* glow top */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {/* radial glow */}
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute -inset-16 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_55%)]" />
    </div>

    <div className="flex items-center justify-between gap-2 relative z-[1]">
      <div>
        {subtitle && (
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-0.5">
            {subtitle}
          </p>
        )}
        <h3 className="text-sm md:text-base font-semibold text-slate-50">{title}</h3>
      </div>
      {badge && (
        <span className="text-[10px] px-2 py-1 rounded-full bg-sky-500/15 border border-sky-500/60 text-sky-300">
          {badge}
        </span>
      )}
    </div>

    {description && (
      <p className="text-[11px] md:text-xs text-slate-400 mt-1 relative z-[1]">
        {description}
      </p>
    )}

    <div className="relative z-[1] mt-2 flex justify-end">
      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 group-hover:text-sky-300 transition-colors duration-200">
        Accéder
        <span className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
          →
        </span>
      </span>
    </div>
  </button>
);

export default function DashboardPage() {
  const router = useRouter();

  // Protection simple côté client : si pas de token, retour login
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("doj_token") : null;
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <main className="min-h-screen body-gradient relative flex items-stretch justify-center overflow-hidden">
      {/* Orbes de fond */}
      <div className="floating-orb w-72 h-72 bg-sky-500/30 -top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-indigo-500/30 bottom-[-80px] right-[-40px]" />

      {/* Conteneur full width */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-24 py-10 md:py-12 lg:py-16 space-y-8 md:space-y-10">
        {/* HEADER GLOBAL */}
        <AppHeader title="Portail interne – Dashboard" />

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

          {/* ANNUAIRE */}
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
            <p className="mb-1.5 font-medium text-slate-200">Version Alpha – Portail DOJ</p>
            <p>
              Certaines sections sont marquées comme{" "}
              <span className="text-sky-300">“À venir”</span> et seront activées au fur et à mesure
              de leur développement.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
