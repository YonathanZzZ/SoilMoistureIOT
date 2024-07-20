import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const session = req.cookies.get("connect.sid");

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    //middleware for dashboard pages
    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  if (req.nextUrl.pathname === "/signin") {
    //middleware for signin page
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (req.nextUrl.pathname === "/signup") {
    //middleware for signin page
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  //configure routes to be handled by middleware
  matcher: ["/dashboard/:path*", "/signin/:path*", "/signup/:path*"],
};
