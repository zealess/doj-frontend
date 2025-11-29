"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";

const API_BASE_URL = "https://doj-backend-production.up.railway.app";

interface DiscordInfo {
  username?: string | null;
}

const Card = ({
  title,
  subtitle,
  description,
  badge,
  onClick,
  disabled = false,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`
      group relative w-full text-left
      rounded-2xl border bg-slate-950/60
      px-4 py-4 md:px-5 md:py-5
      flex flex-col gap-1.5
      shadow-[0_18px_45px_rgba(15,23,42,0.9)]
      min-h-[120px] overflow-hidden transform-gpu
      ${
        disabled
          ? "border-slate-800/60 opacity-60 cursor-not-allowed"
          : "border-slate-800/80 hover:border-sky-500/70 hover:bg-slate-950/90 cursor-pointer hover:-translate-y-1 hover:scale-[1.02]"
      }
    `}
  >
    {!disabled && (
      <>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute -inset-16 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_55%)]" />
        </div>
      </>
    )}

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
      <span
        className={`inline-flex items-center gap-1 text-[10px] ${
          disabled
            ? "text-slate-600"
            : "text-slate-500 group-hover:text-sky-300 transition-colors duration-200"
        }`}
      >
        {disabled ? "Liaison Discord requise" : "Accéder"}
        {!disabled && (
          <span className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        )}
      </span>
    </div>
  </button>
);

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  const [discordInfo, setDiscordInfo] = useState<DiscordInfo | null>(null);

  // Récupération / refresh de l'utilisateur depuis le backend
  const refreshUserFromBackend = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Erreur /api/auth/me:", res.status);
        return;
      }

      const data = await res.json();
      const user = data.user;

      if (user) {
        // On met à jour le localStorage pour les prochaines fois
        if (typeof window !== "undefined") {
          localStorage.setItem("doj_user", JSON.stringify(user));
        }

        setIsDiscordLinked(!!user.discordLinked);
        setDiscordInfo({
          username: user.discordUsername ?? null,
        });
      }
    } catch (err) {
      console.error("Erreur de fetch /api/auth/me:", err);
    }
  };

  // Protection + init état Discord
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("doj_token") : null;
    if (!token) {
      router.push("/");
      return;
    }

    const discordStatus = searchParams?.get("discord");

    if (discordStatus === "linked") {
      // On vient de terminer l'OAuth Discord → on recharge l'utilisateur depuis le backend
      refreshUserFromBackend(token);
    } else {
      // Cas normal : on lit les infos déjà stockées
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("doj_user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setIsDiscordLinked(!!user.discordLinked);
            setDiscordInfo({
              username: user.discordUsername ?? null,
            });
          } catch {
            // ignore parse error
          }
        }
      }
    }
  }, [router, searchParams]);

  const handleDiscordLink = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("doj_token") : null;
    if (!token) return;

    window.location.href = `${API_BASE_URL}/api/discord/login?token=${encodeURIComponent(
      token
    )}`;
  };

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

                  {isDiscordLinked ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/60 text-[11px] text-emerald-300">
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4 fill-emerald-300"
                        >
                          <path d="M20.317 4.369A18.47 18.47 0 0 0 16.556 3c-.2.356-.424.832-.582 1.214a17.2 17.2 0 0 0-3.947 0A12.52 12.52 0 0 0 11.445 3c-1.32.24-2.63.6-3.862 1.105C4.036 9.063 3.178 13.59 3.513 18.06a18.39 18.39 0 0 0 4.986 2.54c.4-.54.754-1.115 1.06-1.72a11.9 11.9 0 0 1-1.66-.8c.14-.1.276-.21.407-.32 3.2 1.5 6.67 1.5 9.84 0 .135.11.27.22.407.32-.53.31-1.087.58-1.665.8.306.605.66 1.18 1.06 1.72a18.26 18.26 0 0 0 5-2.57c.41-5.25-.7-9.74-2.631-13.69ZM9.68 15.33c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Zm4.64 0c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Z" />
                        </svg>
                      </span>
                      <span>
                        Compte Discord lié
                        {discordInfo?.username ? (
                          <span className="text-slate-300">
                            {" "}
                            · {discordInfo.username}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDiscordLink}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-sky-500/70 text-[11px] text-sky-300 hover:bg-sky-500/10 hover:border-sky-400 transition-all duration-200"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4 fill-sky-300"
                        >
                          <path d="M20.317 4.369A18.47 18.47 0 0 0 16.556 3c-.2.356-.424.832-.582 1.214a17.2 17.2 0 0 0-3.947 0A12.52 12.52 0 0 0 11.445 3c-1.32.24-2.63.6-3.862 1.105C4.036 9.063 3.178 13.59 3.513 18.06a18.39 18.39 0 0 0 4.986 2.54c.4-.54.754-1.115 1.06-1.72a11.9 11.9 0 0 1-1.66-.8c.14-.1.276-.21.407-.32 3.2 1.5 6.67 1.5 9.84 0 .135.11.27.22.407.32-.53.31-1.087.58-1.665.8.306.605.66 1.18 1.06 1.72a18.26 18.26 0 0 0 5-2.57c.41-5.25-.7-9.74-2.631-13.69ZM9.68 15.33c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Zm4.64 0c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Z" />
                        </svg>
                      </span>
                      <span>Lier mon compte Discord</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <Card
                  subtitle="Outils"
                  title="Calculatrice"
                  description="Effectuer rapidement des calculs RP (amendes, intérêts, durées de peine…)."
                  badge="À venir"
                  disabled={!isDiscordLinked}
                />
                <Card
                  subtitle="Outils"
                  title="Comptabilité"
                  description="Suivi des honoraires, frais de justice et mouvements financiers internes."
                  badge="À venir"
                  disabled={!isDiscordLinked}
                />
                <Card
                  subtitle="Outils"
                  title="CAD"
                  description="Accès au CAD du DOJ : dossiers en cours, décisions et historiques."
                  badge="À venir"
                  disabled={!isDiscordLinked}
                />
                <Card
                  subtitle="Documentation"
                  title="Guide – Législatif, Exécutif & Judiciaire"
                  description="Accès centralisé aux textes RP : lois, procédures, guides internes."
                  badge="À venir"
                  disabled={!isDiscordLinked}
                />
                <Card
                  subtitle="Communication"
                  title="Messagerie interne"
                  description="Échanger avec les magistrats, greffiers et membres du DOJ."
                  badge="À venir"
                  disabled={!isDiscordLinked}
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
                  disabled={!isDiscordLinked}
                />
                <Card
                  subtitle="Dossiers"
                  title="Procès"
                  description="Gestion des audiences planifiées et des décisions rendues."
                  badge="À venir"
                  disabled={!isDiscordLinked}
                />
                <Card
                  subtitle="Dossiers"
                  title="Dossier 10-10"
                  description="Suivi des dossiers complexes nécessitant une instruction approfondie."
                  badge="À venir"
                  disabled={!isDiscordLinked}
                />
                <Card
                  subtitle="Casier"
                  title="Effacement de casier"
                  description="Traitement des demandes d’effacement de casier judiciaire RP."
                  badge="À venir"
                  disabled={!isDiscordLinked}
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
                disabled={!isDiscordLinked}
              />
              <Card
                subtitle="Annuaire"
                title="Effectif & organigramme"
                description="Liste des magistrats, greffiers et postes au sein du DOJ."
                badge="À venir"
                disabled={!isDiscordLinked}
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
