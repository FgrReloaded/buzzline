import ServerSidebar from '@/components/server/serverSiderbar';
import getCurrentProfile from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode, params: { serverId: string } }) => {
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
        }
    })

    if (!server) {
        return redirect('/');
    }

    return (
        <div className="h-full">
            <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className='md:pl-60 h-full'>
                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout