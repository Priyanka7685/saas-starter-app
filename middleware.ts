import {clerkMiddleware} from '@clerk/nextjs/server'
import {  NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

const isPublicRoute = [
  "/",
  "/api/webhook/register",
  "/sign-up",
  "/sign-in"
];

export default clerkMiddleware(async(auth,req) => {
  const {userId} = await auth();

  // redirecting unauthenticated users on protected users
  if(!isPublicRoute.includes(req.nextUrl.pathname) && !userId) {
    // If the route is protected and the user is not authenticated, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if(userId) {
     try {
      const user = await clerkClient.users.getUser(userId);
      const role =   user.publicMetadata.role as string | undefined
 
     //  admin role redirection
     if(role === 'admin' && req.nextUrl.pathname === '/dashboard') {
       return NextResponse.redirect(new URL('/admin.dashboard', req.url))
     }
 
     // prevent non admin user to access the admin routes
     if( role !== 'admin' && req.nextUrl.pathname.startsWith('/admin')) {
       return NextResponse.redirect(new URL("/dashboard", req.url))
   }
 
   // 
   if(isPublicRoute.includes(req.nextUrl.pathname)) {
     return NextResponse.redirect(
       new URL(
         role === "admin" ? "/admin/dashboard" : "/dashboard",
         req.url
       )
     )
   }
  } catch (error) {
      console.error(error);
      return NextResponse.redirect(new URL("/error", req.url))
      
     }
}

  // Proceed without authentication for public routes
  return NextResponse.next();
  
})

export const config = {
  matcher: [
    // // Skip Next.js internals and all static files, unless found in search params
    // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // // Always run for API routes
    // '/(api|trpc)(.*)',
    "/((?!_next|.*\\..*).*)", // Protect all routes except static files
    "/api/(.*)", // Protect all API routes
   
  ],
}