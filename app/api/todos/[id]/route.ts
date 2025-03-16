import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// delete todo
export async function DELETE(req: NextRequest, {params}: {params: {id:string}}) {

    const { userId } = await auth()

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"},{status: 401})
    }

    try {
        const todoId = params.id
        const todo = await prisma.todo.findUnique({
            where: {id: todoId}
        })

        if(!todo) {
            return NextResponse.json({error: "Todo Not found"},{status: 401})
        }
        if(todo.userId !== userId) {
            return NextResponse.json({error: "Forbidden"}, {status: 403})
        }
        
        await prisma.todo.delete({
            where: {id: todoId}
        })

        return NextResponse.json({message: "Todo deleted successfully"}, {status: 200})

    } catch (error) {
        console.error("Error in deleting todo", error);
        return NextResponse.json (
            { error: "Internal Server error" },
            { status: 500 }
        )
        
    }
    
}

// update todo
export async function PUT(req: NextRequest, {params}: {params: {id:string}}) {

    const { userId } = await auth()

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"},{status: 401})
    }

    try {
        const completed = await req.json()
        const todoId = params.id
        const todo = await prisma.todo.findUnique({
            where: {id: todoId}
        })

        if(!todo) {
            return NextResponse.json({error: "Todod not found"}, {status: 401})
        }
        if(todo.userId !== userId) {
            return NextResponse.json({error: "Forbidden"}, {status: 403})
        }

         await prisma.todo.update({
            where: { id: todoId },
            data: { completed },
        })
        return NextResponse.json({message: "Todo updated successfully"}, {status: 200})

    } catch (error) {
        console.error("Error in updating todo", error);
        return NextResponse.json (
            { error: "Internal Server error" },
            { status: 500 }
        )
    }

}