import { NextRequest, NextResponse } from "next/server";

const ROLE_REDIRECTS: Record<string, string> = {
  ADMIN: "/dashboard",
  SELLER: "/profile",
  BUYER: "/profile",
};

// Routes yang hanya bisa diakses kalau belum login
const AUTH_ROUTES = ["/login", "/register"];

// Route prefix yang butuh role tertentu
const ROLE_PROTECTED: { prefix: string; role: string }[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/seller", role: "SELLER" },
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  // Kalau sudah login dan akses halaman auth (login/register) → redirect ke dashboard role
  if (token && role && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const destination = ROLE_REDIRECTS[role] ?? "/profile";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Kalau belum login dan akses halaman protected → redirect ke login
  if (!token && !AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const isProtected = ROLE_PROTECTED.some((p) =>
      pathname.startsWith(p.prefix),
    );
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Kalau login tapi role salah, misal BUYER akses /admin
  if (token && role) {
    const wrongRoute = ROLE_PROTECTED.find(
      (p) => pathname.startsWith(p.prefix) && p.role !== role,
    );
    if (wrongRoute) {
      const destination = ROLE_REDIRECTS[role] ?? "/profile";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};
