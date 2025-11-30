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

  // Discord
  discordLinked?: boolean;
  discordUsername?: string | null;
  discordNickname?: string | null;
  discordAvatar?: string | null;
  discordHighestRole?: string | null;

  // Structure
  sector?: string | null;
  service?: string | null;
  poles?: string[] | string | null;
  habilitations?: string[] | string | null;
  fjf?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // État édition structure
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  const [sector, setSector] = useState("");
  const [service, setService] = useState("");
  const [polesText, setPolesText] = useState("");
  const [habilitationsText, setHabilitationsText] = useState("");
  const [fjf, setFjf] = useState(false);
  const [saving, setSaving] = useState(false);

  const canEditStructure =
    !!user &&
    ["Juge Fédéral", "Juge Fédéral Adjoint", "Juge Assesseur"].includes(
      user.discordHighestRole ?? ""
    );

  // 🔧 Fonction utilitaire pour hydrater les champs de structure
  const hydrateStructureForm = (u: UserProfile) => {
    setSector(u.sector ?? "");
    setService(u.service ?? "");

    // Pôles : peut être array, string ou null
    let polesArray: string[] = [];
    if (Array.isArray(u.poles)) {
      polesArray = u.poles;
    } else if (typeof u.poles === "string") {
      polesArray = u.poles
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }
    setPolesText(polesArray.join(", "));

    // Habilitations : même logique
    let habArray: string[] = [];
    if (Array.isArray(u.habilitations)) {
      habArray = u.habilitations;
    } else if (typeof u.habilitations === "string") {
      habArray = u.habilitations
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);
    }
    setHabilitationsText(habArray.join(", "));

    setFjf(!!u.fjf);
  };

  // Récupération de l'utilisateur
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
          // fallback sur localStorage
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("doj_user");
            if (stored) {
              const parsed: UserProfile = JSON.parse(stored);
              setUser(parsed);
              hydrateStructureForm(parsed);
            }
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        const u: UserProfile = data.user;

        setUser(u);
        if (typeof window !== "undefined") {
          localStorage.setItem("doj_user", JSON.stringify(u));
        }
        hydrateStructureForm(u);
      } catch (err) {
        console.error("Erreur fetch profil:", err);
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("doj_user");
          if (stored) {
            const parsed: UserProfile = JSON.parse(stored);
            setUser(parsed);
            hydrateStructureForm(parsed);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [router]);

  const handleSaveStructure = async () => {
    if (!user) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("doj_token") : null;
    if (!token) {
      router.push("/");
      return;
    }

    setSaving(true);
    try {
      const body = {
        sector: sector || null,
        service: service || null,
        poles: polesText
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length > 0),
        habilitations: habilitationsText
          .split(",")
          .map((h) => h.trim())
          .filter((h) => h.length > 0),
        fjf,
      };

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Erreur update profil:", res.status, errText);
        alert(
          "Impossible de mettre à jour la structure. Vérifiez vos droits ou réessayez plus tard."
        );
        return;
      }

      const data = await res.json();
      const updated: UserProfile = data.user;
      setUser(updated);

      if (typeof window !== "undefined") {
        localStorage.setItem("doj_user", JSON.stringify(updated));
      }
      hydrateStructureForm(updated);
      setIsEditingStructure(false);
    } catch (err) {
      console.error("Erreur réseau update profil:", err);
      alert("Erreur réseau lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  const displayIdentity =
    user?.discordNickname ||
    user?.discordUsername ||
    user?.username ||
    "Magistrat";

  const displayHighestRole = user?.discordHighestRole || "Non défini";

  return (
    <main className="min-h-screen body-gradient relative flex items-stretch justify-center overflow-hidden">
      {/* Orbes de fond */}
      <div className="floating-orb w-72 h-72 bg-sky-500/30 -top-10 -left-20" />
      <div className="floating-orb w-80 h-80 bg-indigo-500/30 bottom-[-80px] right-[-40px]" />

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-24 py-10 md:py-12 lg:py-16 space-y-8 md:space-y-10">
        {/* HEADER GLOBAL */}
        <AppHeader title="Portail interne – Profil magistrat" />

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)] gap-7 md:gap-8">
          {/* COLONNE GAUCHE – IDENTITÉ DOJ / DISCORD */}
          <section className="glass-card rounded-3xl border border-slate-800/80 bg-slate-950/80 px-5 py-5 md:px-7 md:py-7 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                  Identité du juge
                </p>
                <h1 className="text-lg md:text-xl font-semibold text-slate-50">
                  Fiche d&apos;identité magistrat
                </h1>
                <p className="text-[12px] text-slate-400 mt-1">
                  Informations liées à votre compte DOJ et à votre présence sur le
                  serveur.
                </p>
              </div>
              {user && (
                <span className="inline-flex items-center rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200">
                  Grade serveur : {displayHighestRole}
                </span>
              )}
            </div>

            {loading ? (
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
                {/* Identité principale */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/40 to-indigo-500/40 border border-slate-700/80 shadow-[0_10px_35px_rgba(15,23,42,0.9)] overflow-hidden">
                    {user.discordAvatar ? (
                      <img
                        src={user.discordAvatar}
                        alt="Avatar Discord"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-xl font-semibold text-slate-50">
                          {displayIdentity.charAt(0).toUpperCase()}
                        </span>
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.14),_transparent_55%)] opacity-40" />
                      </>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base md:text-lg font-semibold text-slate-50">
                        {displayIdentity}
                      </p>
                      {user.discordUsername && (
                        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-300">
                          @{user.discordUsername}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-400">
                      Identité utilisée comme référence pour les habilitations et accès
                      internes.
                    </p>
                  </div>
                </div>

                {/* Infos DOJ / contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Identifiant DOJ
                    </p>
                    <p className="text-sm text-slate-50">{user.username}</p>
                    <p className="text-[11px] text-slate-500">
                      Utilisé pour la connexion au portail.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Adresse mail
                    </p>
                    <p className="text-sm text-slate-50">{user.email}</p>
                    <p className="text-[11px] text-slate-500">
                      Réservée aux communications internes.
                    </p>
                  </div>
                </div>

                {/* Rappel Discord */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-700/80">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className={`h-4 w-4 ${
                          user.discordLinked ? "fill-emerald-300" : "fill-slate-500"
                        }`}
                      >
                        <path d="M20.317 4.369A18.47 18.47 0 0 0 16.556 3c-.2.356-.424.832-.582 1.214a17.2 17.2 0 0 0-3.947 0A12.52 12.52 0 0 0 11.445 3c-1.32.24-2.63.6-3.862 1.105C4.036 9.063 3.178 13.59 3.513 18.06a18.39 18.39 0 0 0 4.986 2.54c.4-.54.754-1.115 1.06-1.72a11.9 11.9 0 0 1-1.66-.8c.14-.1.276-.21.407-.32 3.2 1.5 6.67 1.5 9.84 0 .135.11.27.22.407.32-.53.31-1.087.58-1.665.8.306.605.66 1.18 1.06 1.72a18.26 18.26 0 0 0 5-2.57c.41-5.25-.7-9.74-2.631-13.69ZM9.68 15.33c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Zm4.64 0c-.96 0-1.754-.88-1.754-1.96 0-1.08.774-1.97 1.754-1.97.987 0 1.774.89 1.754 1.97 0 1.08-.767 1.96-1.754 1.96Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Liaison Discord
                      </p>
                      <p className="text-[12px] text-slate-300">
                        {user.discordLinked
                          ? "Votre compte Discord est synchronisé avec le portail DOJ."
                          : "Aucune liaison Discord détectée. Certaines fonctionnalités peuvent être restreintes."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* COLONNE DROITE – STRUCTURE & HABILITATIONS */}
          <section className="glass-card rounded-3xl border border-slate-800/80 bg-slate-950/85 px-5 py-5 md:px-7 md:py-7 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.23em] text-slate-500">
                  Structure & habilitations
                </p>
                <h2 className="text-sm md:text-base font-semibold text-slate-50">
                  Affectation interne du magistrat
                </h2>
                <p className="text-[12px] text-slate-400 mt-1">
                  Secteur, pôles, habilitations et F.J.F. définissent vos champs
                  d&apos;action au sein du DOJ.
                </p>
              </div>

              {canEditStructure && !loading && (
                <button
                  type="button"
                  onClick={() => setIsEditingStructure((prev) => !prev)}
                  className="inline-flex items-center gap-1 rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200 hover:bg-sky-500/20 transition-colors duration-150"
                >
                  {isEditingStructure ? "Annuler" : "Modifier"}
                </button>
              )}
            </div>

            {loading || !user ? (
              <div className="space-y-3">
                <div className="h-4 w-40 rounded bg-slate-800/80 animate-pulse" />
                <div className="h-4 w-56 rounded bg-slate-800/80 animate-pulse" />
                <div className="h-4 w-48 rounded bg-slate-800/80 animate-pulse" />
              </div>
            ) : (
              <div className="space-y-5">
                {/* Affichage ou formulaire suivant le mode */}
                {!isEditingStructure ? (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Secteur
                        </p>
                        <p className="text-sm text-slate-50">
                          {user.sector || "Non défini"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Service
                        </p>
                        <p className="text-sm text-slate-50">
                          {user.service || "Non défini"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Pôles
                        </p>
                        <p className="text-sm text-slate-50">
                          {(() => {
                            let arr: string[] = [];
                            if (Array.isArray(user.poles)) {
                              arr = user.poles;
                            } else if (typeof user.poles === "string") {
                              arr = user.poles
                                .split(",")
                                .map((p) => p.trim())
                                .filter((p) => p.length > 0);
                            }
                            return arr.length > 0
                              ? arr.join(", ")
                              : "Aucun pôle renseigné";
                          })()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Habilitations
                        </p>
                        <p className="text-sm text-slate-50">
                          {(() => {
                            let arr: string[] = [];
                            if (Array.isArray(user.habilitations)) {
                              arr = user.habilitations;
                            } else if (typeof user.habilitations === "string") {
                              arr = user.habilitations
                                .split(",")
                                .map((h) => h.trim())
                                .filter((h) => h.length > 0);
                            }
                            return arr.length > 0
                              ? arr.join(", ")
                              : "Aucune habilitation renseignée";
                          })()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          F.J.F
                        </p>
                        <p className="text-sm text-slate-50">
                          {user.fjf ? "Oui (habilité F.J.F)" : "Non habilité F.J.F"}
                        </p>
                      </div>
                    </div>

                    {!canEditStructure && (
                      <p className="text-[11px] text-slate-500 mt-2">
                        Les champs ci-dessus ne sont modifiables que par les grades{" "}
                        <span className="text-slate-300">
                          Juge Fédéral, Juge Fédéral Adjoint ou Juge Assesseur
                        </span>
                        .
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {/* FORMULAIRE ÉDITION */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Secteur
                        </label>
                        <input
                          type="text"
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                          placeholder="Ex : Section pénale, Section civile..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Service
                        </label>
                        <input
                          type="text"
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                          placeholder="Ex : Service CI, Service Instruction..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Pôles (séparés par des virgules)
                        </label>
                        <textarea
                          value={polesText}
                          onChange={(e) => setPolesText(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[60px] resize-none"
                          placeholder="Ex : Pôle CI, Pôle Cour Suprême..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Habilitations (séparées par des virgules)
                        </label>
                        <textarea
                          value={habilitationsText}
                          onChange={(e) => setHabilitationsText(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[60px] resize-none"
                          placeholder="Ex : CI, Mandats, Fédéral..."
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFjf((prev) => !prev)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition-colors duration-150 ${
                            fjf
                              ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-200"
                              : "border-slate-700 bg-slate-900/80 text-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-2.5 w-2.5 rounded-full ${
                              fjf ? "bg-emerald-400" : "bg-slate-600"
                            }`}
                          />
                          F.J.F {fjf ? "activé" : "non activé"}
                        </button>
                        <p className="text-[11px] text-slate-500">
                          F.J.F accessible uniquement à partir d&apos;un certain grade.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingStructure(false)}
                        className="text-[11px] rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:bg-slate-900"
                        disabled={saving}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveStructure}
                        disabled={saving}
                        className="text-[11px] rounded-full border border-sky-500/80 bg-sky-500/10 px-4 py-1.5 text-sky-100 hover:bg-sky-500/20 disabled:opacity-60"
                      >
                        {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
