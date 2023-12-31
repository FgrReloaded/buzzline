import ChatHeader from '@/components/chat/chatHeader'
import { getOrCreateConversation } from '@/lib/conversation'
import getCurrentProfile from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

interface MemberIdPageProps {
  params: {
    serverId: string
    memberId: string
  }
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await getCurrentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === profile.id ? memberTwo : memberOne;


  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full' >
      <ChatHeader imageUrl={otherMember.profile.imageUrl} name={otherMember.profile.name} type='conversation' serverId={params.serverId} />

    </div>
  )
}

export default MemberIdPage