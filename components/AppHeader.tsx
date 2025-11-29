"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle = "San Andreas" }) => {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("doj_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur parsing user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("doj_token");
      localStorage.removeItem("doj_user");
      document.cookie = "doj_token=; Path=/; Max-Age=0; SameSite=Lax; Secure";
    }
    router.push("/");
  };

  // Breadcrumb auto à partir de l'URL
  const segments = pathname.split("/").filter(Boolean); // ex: ["dashboard","ci"]
  const breadcrumbLabels = segments.map((seg) => {
    if (seg === "dashboard") return "Dashboard";
    // ici tu pourras mapper d'autres routes plus tard si tu veux un label propre
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  });

  return (
    <div className="sticky top-0 z-30 -mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 mb-6">
      <div className="bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-md border-b border-slate-800/80 px-6 md:px-10 lg:px-16 xl:px-24 pt-4 pb-3">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Logo DOJ + titre + breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-sky-400/60 bg-slate-950/90 flex items-center justify-center text-[11px] font-semibold text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.55)]">
              DOJ
            </div>

            <div className="flex flex-col gap-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-sky-300/80">
                  {subtitle}
                </p>
                <h1 className="text-sm md:text-base font-semibold text-slate-50">
                  {title}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="hover:text-sky-300 cursor-default transition-colors">
                  Accueil
                </span>
                {breadcrumbLabels.map((label, index) => (
                  <span key={`${label}-${index}`} className="flex items-center gap-2">
                    <span className="text-slate-600">/</span>
                    <span
                      className={
                        index === breadcrumbLabels.length - 1
                          ? "text-sky-300"
                          : "hover:text-sky-300 cursor-default transition-colors"
                      }
                    >
                      {label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            {user && (
              <div className="text-right">
                <p className="text-xs font-medium text-slate-100">{user.username}</p>
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
      </div>
    </div>
  );
};

export default AppHeader;
