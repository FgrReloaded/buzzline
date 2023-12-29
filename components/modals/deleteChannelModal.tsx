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
} from "@/components/ui/dialog"

import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { useRouter } from 'next/navigation';


const DeleteChannelModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'deleteChannel';
  const { server, channel } = data;

  const deleteChannel = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      })
      await axios.delete(url);
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Channel</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            <p>Are you sure you want to delete <span className='font-semibold dark:text-white text-black'>
              {channel?.name}
            </span> ?
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-6'>
          <div className="flex items-center justify-between w-full">
            <Button
              className='bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-400'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className='bg-red-500 hover:bg-red-600 dark:hover:bg-red-400'
              disabled={isLoading} onClick={deleteChannel}
            >
              Delete Channel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default DeleteChannelModal