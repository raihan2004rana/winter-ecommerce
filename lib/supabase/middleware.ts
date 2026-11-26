import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let isAuthenticated = false;

  // 1. If live Supabase keys are configured, check Supabase auth
  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 2. Check local secure session cookie (persists demo / active customer session)
  const localSessionCookie = request.cookies.get("winter_customer_session")?.value;
  if (localSessionCookie) {
    try {
      const parsed = JSON.parse(localSessionCookie);
      if (parsed && parsed.email) {
        isAuthenticated = true;
      }
    } catch {
      // invalid cookie format
    }
  }

  // 3. Route Protection Rule: /account and /account/* require authenticated session
  const isAccountRoute = request.nextUrl.pathname.startsWith("/account");
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/auth/forgot-password");

  if (isAccountRoute && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated and visiting /login or /register, redirect to /account
  if (isAuthRoute && isAuthenticated && !request.nextUrl.searchParams.has("force")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/account";
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Admin Route Protection: /admin and /admin/* require admin session
  const adminCookie = request.cookies.get("winter_admin_session")?.value;
  let isAdminAuthenticated = false;
  if (adminCookie) {
    try {
      const parsedAdmin = JSON.parse(adminCookie);
      if (parsedAdmin && parsedAdmin.email && parsedAdmin.role) {
        isAdminAuthenticated = true;
      }
    } catch {
      // invalid cookie
    }
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isAdminLoginRoute && !isAdminAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminLoginRoute && isAdminAuthenticated && !request.nextUrl.searchParams.has("force")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
