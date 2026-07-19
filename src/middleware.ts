import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("lifeum-flow-session-jwt")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = 
    pathname.startsWith("/login") || 
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/icon.svg" ||
    pathname === "/sw.js";

  let isSessionValid = false;

  if (token) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

      if (supabaseUrl && supabaseAnonKey) {
        // Valida o token JWT diretamente contra o endpoint Auth do Supabase
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          isSessionValid = true;
        }
      }
    } catch (err) {
      console.error("Erro ao validar sessao no middleware:", err);
    }
  }

  // Se o usuário não estiver logado ou a sessão for inválida, e tentar acessar rotas internas
  if (!isSessionValid) {
    if (!isPublicRoute) {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Limpa cookie inválido
      response.cookies.delete("lifeum-flow-session-jwt");
      return response;
    }
  }

  // Se o usuário estiver logado e tentar acessar a rota de login, redireciona para a home
  if (isSessionValid && pathname.startsWith("/login")) {
    const homeUrl = new URL("/hoje", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Configura o middleware para rodar em todas as rotas internas, exceto assets
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
