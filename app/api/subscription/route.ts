import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

 
export async function POST() {
    const { userId } = await  auth()

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 400})
    }

    // capture payment
    try {
       const user = await prisma.user.findUnique({where: {id: userId}})

       if(!user) {
        return NextResponse.json({error: "USer not found"}, {status: 401})
       }

    //    current status of subscription
    const subscriptionEnds = new Date()
    subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1)

    const updatedUser = await prisma.user.update({
        where: {id: userId},
        data: {
            isSubscribed: true,
            subscriptionEnds: subscriptionEnds,
        }
    })

    return NextResponse.json({
        message: "Subscription successfull",
        subscriptionEnds: updatedUser.subscriptionEnds
    })

    } catch (error) {
        console.error("Error updating subscription", error);
        return NextResponse.json({error: "Internal server error"},{status: 402})
        
    }
}


export async function GET() {
    const { userId } = await auth();

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const user = await prisma.user.findUnique(
            {
                where: {id: userId},
            // selecting fields that we want to grab
                select: {
                    isSubscribed: true,
                    subscriptionEnds: true
                }
            },
        )
        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 401})
        }

        const now = new Date()

        if(user.subscriptionEnds && user.subscriptionEnds < now) {
            await prisma.user.update({
                where: {id: userId},
                // remove subscription
                data: {
                    isSubscribed: false,
                    subscriptionEnds: null
                }
            })
            return NextResponse.json({
                isSubscribed: false,
                subscriptionEnds: null
            })
        }
        return NextResponse.json({
            isSubscribed: user.isSubscribed,
            susbscriptionEnds: user.subscriptionEnds
        })

    } catch (error) {
        console.error("Error updating subscription", error);
        return NextResponse.json(
            {error: "Internal Server error"},{status: 500}
        )
        
    }
}