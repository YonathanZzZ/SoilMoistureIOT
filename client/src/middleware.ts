import { NextRequest, NextResponse } from "next/server";

//this middleware runs before each route is loaded

export default function middleware(req: NextRequest) {
  const session = req.cookies.get("connect.sid");
  console.log('middleware executed');
  if (!session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  //configure protected routes
  matcher: ["/dashboard/:path*"],
};
