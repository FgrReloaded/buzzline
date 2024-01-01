import ChatHeader from '@/components/chat/chatHeader'
import { getOrCreateConversation } from '@/lib/conversation'
import getCurrentProfile from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

import ChatMessage from '@/components/chat/chatMessage'
import ChatInput from '@/components/chat/chatInput'
import MediaRoom from '@/components/media-room'

interface MemberIdPageProps {
  params: {
    serverId: string
    memberId: string
  },
  searchParams: {
    video?: boolean
  }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
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
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true}  />
      )}
      {!searchParams.video && (
        <>
          <ChatMessage member={currentMember} name={otherMember.profile.name} chatId={conversation.id} type='conversation' apiUrl='/api/direct-messages' paramKey="conversationId" paramValue={conversation.id} socketUrl='/api/socket/direct-messages' socketQuery={{
            conversationId: conversation.id
          }} />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}

    </div>
  )
}

export default MemberIdPage