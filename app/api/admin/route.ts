import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import clerk from "@clerk/clerk-sdk-node"
import prisma from "@/lib/prisma";

// to access/get whether user is admin or not
async function isAdmin(userId: string) {
   const user =  await clerk.users.getUser(userId)
   return user.privateMetadata.role === 'admin'
}