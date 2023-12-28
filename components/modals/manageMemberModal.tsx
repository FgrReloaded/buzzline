"use client"

import React, { useState } from 'react';
import axios from 'axios';
import qs from "query-string"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"


import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { MemberRole, Server } from '@prisma/client';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import { Check, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion, UserRoundX } from 'lucide-react';
import { useRouter } from 'next/navigation';

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className='w-4 h-4 text-green-500' />,
  "ADMIN": <ShieldAlert className='w-4 h-4 text-red-500' />,
}


const ManageMemberModal = () => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        }
      })
      const response = await axios.delete(url);

      router.refresh();

      onOpen("members", {server: response.data})

      } catch (error) {
        console.log(error)
      }
      finally {
        setLoadingId("")
      }
    }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        }
      })
      const response = await axios.patch(url, { role });

      router.refresh();

      onOpen("members", {server: response.data})

  

      } catch (error) {
        console.log(error)
      }
      finally {
        setLoadingId("")
      }
    }


  return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Members</DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='mt-6 max-h-[420px] pr-6'>
            {
              server?.members?.map((member) => (
                <div className='flex items-center mb-3 gap-x-2' key={member?.id}>
                  <UserAvatar src={member?.profile?.imageUrl} />
                  <div className='flex flex-col gap-y-1'>
                    <div className="text-xs font-semibold flex items-center gap-x-2">
                      {member?.profile?.name}
                      {roleIconMap[member?.role]}
                    </div>
                    <p className='text-xs text-zinc-400'>
                      {member?.profile?.email}
                    </p>
                  </div>
                  {server.profileId !== member?.profileId && loadingId !== member?.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className='w-5 h-5 text-zinc-500 outline-none' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='left'>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='flex items-center'>
                              <ShieldQuestion className='w-4 h-4 text-zinc-500 mr-2' />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className='ml-2'>
                                <DropdownMenuItem onClick={()=>{onRoleChange(member?.id, "GUEST")}}>
                                  <Shield className='h-4 w-4 mr-2' />
                                  Guest
                                  {member?.role === 'GUEST' && (
                                    <Check className='w-4 h-4 text-green-500 ml-auto' />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={()=>{onRoleChange(member?.id, "MODERATOR")}}>
                                  <ShieldCheck className='h-4 w-4 mr-2' />
                                  Moderator
                                  {member?.role === 'MODERATOR' && (
                                    <Check className='w-4 h-4 text-green-500 ml-auto' />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={()=>{onKick(member?.id)}}>
                            <UserRoundX className='w-4 h-4 text-zinc-500 mr-2' />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  {
                    loadingId === member?.id && (
                      <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4' />
                    )
                  }
                </div>
              ))
            }
          </ScrollArea>
        </DialogContent>
      </Dialog >
    )
  }

  export default ManageMemberModal