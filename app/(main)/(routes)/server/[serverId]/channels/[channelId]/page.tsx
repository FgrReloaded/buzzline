import ChatHeader from '@/components/chat/chatHeader';
import ChatInput from '@/components/chat/chatInput';
import ChatMessage from '@/components/chat/chatMessage';
import getCurrentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }

}


const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await getCurrentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  })

  if (!channel || !member) {
    return redirect("/");
  }



  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={channel?.name} serverId={params?.serverId} type={'channel'} />
      <ChatMessage name={channel.name} type='channel' apiUrl='/api/messages' socketUrl='/api/socket/messages' socketQuery={{channelId: channel.id, serverId: channel.serverId}} paramKey='channelId' paramValue={channel.id} member={member} chatId={channel.id} />
      <ChatInput name={channel.name} type={"channel"} apiUrl='/api/socket/messages' query={{channelId: channel.id, serverId: channel.serverId}} />
    </div>
  )
}

export default ChannelIdPage