import getCurrentProfile from "@/lib/current-profile"
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server"


const MESSAGE_LIMIT = 10;

export async function GET(req: Request) {
    try {
        const profile = await getCurrentProfile();

        const { searchParams } = new URL(req.url)

        const channelId = searchParams.get("channelId")
        const cursor = searchParams.get("cursor")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!channelId) {
            return new NextResponse("Channel ID is required", { status: 400 })
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_LIMIT,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGE_LIMIT,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        }

        let nextCursor = null;

        if (messages.length === MESSAGE_LIMIT) {
            nextCursor = messages[messages.length - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        }, { status: 200 })

    } catch (error) {
        console.log(error)
        return new NextResponse("Something went wrong", { status: 500 })
    }
}