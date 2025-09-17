import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("myUserToken")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");



    // BYPASS: Allow all requests through (no auth checks)
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/auth"],
};

// import { NextResponse, NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("myUserToken")?.value;
//   const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

//   if (!token && !isAuthPage) {
//     return NextResponse.redirect(new URL("/auth", request.url));
//   }

//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/dashboard", "/auth"],
// };

