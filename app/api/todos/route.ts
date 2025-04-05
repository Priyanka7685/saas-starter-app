import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 10

export async function GET(req: NextResponse) {
    const { userId } = await auth()

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 404})
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("Page") || "1")
    const search = searchParams.get("search") || ""

    try {
        const todos = await prisma.todo.findMany({
            where: {
                userId,
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            orderBy: {createdAt: "desc"},
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE   // 2-1 = 1 means 10 i.e 10 items skipping, 3-1 = 2 means 20 items skipping on 3rd page
        })

        const totalItems = await prisma.todo.count({
            where: {
                userId,
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        })

        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

        return NextResponse.json({
            todos,
            currentPage: page,
            totalPages
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json (
            {error: "Unable to load pages"},
            {status: 500}
        )
        
    }
}

// for adding new todos
export async function POST(req: NextRequest) {
    const { userId } = await auth()

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 404})
    }

    const user = await prisma.user.findUnique({
        where: {id: userId},
        include: {todos: true}
    })

    if(!user) {
        return NextResponse.json({error: "User not found"},{status: 404})
    
    }

    // limited todos
    if(!user.isSubscribed && user.todos.length >= 3) {
        return NextResponse.json({
            error: "Free users can only create upto 3 todos. Please subscribe to paid plans to get more todod"
        }, {status: 403})
    }

    const {title} = await req.json()
    if (!title || typeof title !== "string") {
        return NextResponse.json({ error: "Invalid title" }, { status: 400 });
      }

    const todo = await prisma.todo.create({
        data: {title, userId}
    })

    return NextResponse.json(todo, {status:200})
}