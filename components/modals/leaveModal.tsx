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
} from "@/components/ui/dialog"

import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { redirect, useRouter } from 'next/navigation';


const LeaveModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'leaveServer';
  const { server } = data;

  const leaveServer = async ()=>{
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
    } catch (error) {
        console.log(error)
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Server</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            <p>Are you sure you want to leave <span className='font-semibold dark:text-white text-black'>
                {server?.name} 
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
              disabled={isLoading} onClick={leaveServer}
            >
              Leave Server
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default LeaveModal