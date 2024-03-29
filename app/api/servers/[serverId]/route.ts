import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";
import getCurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await getCurrentProfile();
        const {name, imageUrl}  = await req.json();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        })

        return new NextResponse(JSON.stringify(server), { status: 200 })

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await getCurrentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        })

        return new NextResponse("OK", { status: 200 })

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}