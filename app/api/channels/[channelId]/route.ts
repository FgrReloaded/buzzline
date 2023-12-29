import getCurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await getCurrentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!serverId) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.channelId) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: ["ADMIN", "MODERATOR"]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await getCurrentProfile();
        const { name, type } = await req.json();

        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!serverId) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        if(name === "general"){
            return new NextResponse("Bad Request", { status: 400 });
        }

       const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: ["ADMIN", "MODERATOR"]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });

        return new NextResponse(JSON.stringify(server), { status: 200 })

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}