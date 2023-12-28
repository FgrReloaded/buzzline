import { NextResponse } from "next/server";
import getCurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await getCurrentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new NextResponse("Bad Request", { status: 400 });
        }


        if (!params.memberId) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params) {
            return new NextResponse("Bad Request", { status: 400 });
        }


        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
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
    { params }: { params: { memberId: string } }
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

        if (!params.memberId) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })

        return new NextResponse(JSON.stringify(server), { status: 200 })
    }
    catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
