import getCurrentProfile  from "@/lib/current-profile"
import {v4 as uuidv4} from "uuid";

import { db } from "@/lib/db";
import exp from "constants";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request){
    try {
        const {name, imageUrl} = await req.json();
        const profile = await getCurrentProfile();

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const newServer = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {
                            name: "general",
                            profileId: profile.id,
                        }
                    ]
                },
                members: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        })

        return new NextResponse(JSON.stringify(newServer), { status: 201 });


    } catch (error) {
        console.log(error);
        return new NextResponse("Inernal Server Error", { status: 500 });
    }
}

