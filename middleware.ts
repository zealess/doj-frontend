import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // On check uniquement les routes dashboard (voir matcher plus bas)
  const token = req.cookies.get("doj_token")?.value;

  // Si pas de token → redirection vers la page de login
  if (!token) {
    const loginUrl = new URL("/", req.url);
    // Optionnel : ajouter un param pour afficher un message
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sinon on laisse passer
  return NextResponse.next();
}

// On applique le middleware uniquement sur /dashboard et sous-routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
