import getCurrentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

interface ServerIdPageProps {
    params: {
        serverId: string;
    }
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
    const profile = await getCurrentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: 'general'
                },
                orderBy: {
                    createdAt: 'asc'
                },
            }
        }
    })

    const initialChannel = server?.channels[0];

    return redirect(`/server/${params.serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage