"use client"

import React, { useState } from 'react';
import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';



const InviteModal = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newInviteUrl, setNewInviteUrl] = useState("");

  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';
  const { server } = data;
  
  let inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  const onNewLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      const { data } = response;
      setNewInviteUrl(`${origin}/invite/${data.inviteCode}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary'>
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input disabled={isLoading} className='bg-zinc-300 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' value={newInviteUrl?newInviteUrl:inviteUrl} />
            <Button disabled={isLoading} size="icon">
              {copied ? <Check className="h-5 w-5" /> :
                <Copy onClick={onCopy} className="h-5 w-5" />
              }
            </Button>
          </div>
          <Button onClick={onNewLink} disabled={isLoading} size="sm" variant={"link"} className='text-xs text-zinc-500 mt-4'>
            Generate a new link
            <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog >
  )
}

export default InviteModal