"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";

const API_BASE_URL = "https://doj-backend-production.up.railway.app";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  discordLinked?: boolean;
  discordUsername?: string | null;
  discordAvatar?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupération de l'utilisateur connecté
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("doj_token") : null;

    if (!token) {
      router.push("/");
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Erreur /api/auth/me:", res.status);
          // fallback sur le localStorage si dispo
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("doj_user");
            if (stored) {
              setUser(JSON.parse(stored));
            }
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("doj_user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Erreur fetch profil:", err);
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("doj_user");
          if (stored) {
            setUser(JSON.parse(stored));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [router]);

  const isDiscordLinked = !!user?.discordLinked;

  return (
    <main className="min-h-screen body-gradient relative flex items-stretch justify-center overflow-hidden">
      {/* Orbes de fond */}
      <div className="floating-orb w-72 h-72 bg-sky-500/30 -top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-indigo-500/30 bottom-[-80px] right-[-40px]" />

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-24 py-10 md:py-12 lg:py-16 space-y-8 md:space-y-10">
        {/* HEADER GLOBAL */}
        <AppHeader title="Portail interne – Profil magistrat" />

        {/* CONTENU */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-7 md:gap-8">
          {/* Colonne identité DOJ */}
          <section className="glass-card rounded-3xl border border-slate-800/80 bg-slate-950/80 px-5 py-5 md:px-7 md:py-7 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                  Profil magistrat
                </p>
                <h1 className="text-lg md:text-xl font-semibold text-slate-50">
                  Fiche d&apos;identité
                </h1>
                <p className="text-[12px] text-slate-400 mt-1">
                  Informations principales liées à votre compte DOJ.
                </p>
              </div>
              {/* Badge rôle */}
              {user && (
                <span className="inline-flex items-center rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200">
                  Rôle : {user.role || "Utilisateur"}
                </span>
              )}
            </div>

            {loading ? (
              // Skeleton simple
              <div className="space-y-4">
                <div className="h-4 w-40 rounded bg-slate-800/80 animate-pulse" />
                <div className="h-4 w-56 rounded bg-slate-800/80 animate-pulse" />
                <div className="h-4 w-32 rounded bg-slate-800/80 animate-pulse" />
              </div>
            ) : !user ? (
              <p className="text-sm text-red-300">
                Impossible de charger les informations du profil.
              </p>
            ) : (
              <div className="space-y-6">
                {/* Bloc identité principale */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/40 to-indigo-500/40 border border-slate-700/80 shadow-[0_10px_35px_rgba(15,23,42,0.9)]">
                    <span className="text-lg font-semibold text-slate-50">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.14),_transparent_55%)] opacity-40" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base md:text-lg font-semibold text-slate-50">
                        {user.username}
                      </p>
                      <span className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.17em] text-emerald-300">
                        Actif
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-400">
                      Compte DOJ lié à cette identité RP.
                    </p>
                  </div>
                </div>

                {/* Infos détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Adresse mail
                    </p>
                    <p className="text-sm text-slate-50">{user.email}</p>
                    <p className="text-[11px] text-slate-500">
                      Utilisée pour l&apos;accès au portail DOJ.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Rôle interne
                    </p>
                    <p className="text-sm text-slate-50">
                      {user.role === "admin"
                        ? "Administrateur du portail"
                        : user.role === "magistrat"
                        ? "Magistrat"
                        : "Utilisateur standard"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Détermine vos accès aux outils internes.
                    </p>
                  </div>
                </div>

                {/* Placeholder futur : paramètres */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                    Paramètres du compte
                  </p>
                  <p className="text-[12px] text-slate-400">
                    Les options de modification du profil (photo, signature, préférences
                    d&apos;affichage) seront disponibles dans une prochaine mise à jour.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Colonne Discord & statut d’accès */}
          <section className="glass-card rounded-3xl border border-slate-800/80 bg-slate-950/85 px-5 py-5 md:px-7 md:py-7 space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                Intégration Discord
              </p>
              <h2 className="text-sm md:text-base font-semibold text-slate-50">
                Compte Discord lié au portail
              </h2>
              <p className="text-[12px] text-slate-400 mt-1">
                Synchronisation entre votre identité DOJ et votre identité Discord.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-900/80 px-4 py-4 space-y-3 shadow-[0_18px_45px_rgba(15,23,42,0.95)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-700/80">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`h-5 w-5 ${
                        isDiscordLinked ? "fill-emerald-300" : "fill-slate-500"
                      }`}
                    >
                      <path d="M20.317 4.369A18.47 18.47 0 0 0 16.556 3c-.2.356-.424.832-.582 1.214a17.2 17.2 0 0 0-3.947 0A12.52 12.52 0 0 0 11.445 3c-1.32.24-2.63.6-3.862 1.105C4.036 9.063 3.178 13.59 3.513 18.06a18.39 18.39 0 0 0 4.986 2.54c.4-.54.754-1.115 1.06-1.72a11.9 11.9 0 0 1-1.66-.8c.14-.1.276-.21.407-.32 3.2 1.5 6.67 1.5 9.84 0 .135.11.27.22.407.32-.53.31-1.087.58-1.665.8.306.605.66 1.18 1.06 1.72a18.26 18.26 0 0 0 5-2.57c.41-5.25-.7-9.74-2.631-13.69ZM9.68 15.33c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Zm4.64 0c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-0.5">
                      {isDiscordLinked ? "Compte lié" : "Compte non lié"}
                    </p>
                    <p className="text-sm text-slate-50">
                      {isDiscordLinked
                        ? user?.discordUsername || "Identité Discord synchronisée."
                        : "Aucune identité Discord associée pour l’instant."}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[11px] border ${
                    isDiscordLinked
                      ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700/80 bg-slate-900/70 text-slate-300"
                  }`}
                >
                  {isDiscordLinked ? "Synchronisé" : "Non synchronisé"}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                La liaison Discord permet de contrôler automatiquement vos accès en fonction
                de votre rôle sur le serveur (grade, permissions, etc.).
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1.5">
                Statut d&apos;accès
              </p>
              <p className="text-[12px] text-slate-400">
                Tant que votre compte Discord reste lié et actif, vous conservez l&apos;accès à
                l&apos;ensemble des outils du dashboard (calculatrice, CI, procès, dossiers 10-10,
                etc.), selon votre rôle au sein du DOJ.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
