import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if(!WEBHOOK_SECRET) {
        throw new Error("Please add webhook secret")
    }

    const headerPayload = headers();
    const svix_id = (await headerPayload).get("svix-id") || ""
    const svix_timestamp = (await headerPayload).get("svix-timestamp") || ""
    const svix_signature = (await headerPayload).get("svix-signature") || ""

    if(!svix_id || svix_signature || svix_timestamp) {
        return new Response("No Svix headers")
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(WEBHOOK_SECRET);
    
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix_id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (error) {
        console.error("Error verifying webhook", error);
        return new Response("Error occured",{status: 400})
        
    }

    // extracting data
    const {id} = evt.data
    const eventType = evt.type
}