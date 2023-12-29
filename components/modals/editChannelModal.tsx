"use client"

import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import qs from "query-string"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Select, SelectItem, SelectContent, SelectValue, SelectTrigger

} from "@/components/ui/select"

import {
  Form, FormControl, FormLabel, FormField, FormItem, FormMessage
} from "@/components/ui/form"

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';

/* The code is defining a form schema using the `zod` library. */
const formSchema = z.object({
  name: z.string().min(1, "Channel name is required").refine(name => name !== "general", { message: "Channel name cannot be 'general'" }),
  type: z.nativeEnum(ChannelType)
})

const EditChannelModal = () => {
  const [resetChannelType, setResetChannelType] = useState(Math.random());
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'editChannel';
  const { channel, server } = data

  const handleOnClose = () => {
    form.reset();
    onClose();
    setResetChannelType(Math.random());
  }

  /* The code is initializing a form using the `useForm` hook from the `react-hook-form` library. */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT
    }
  })


  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
    }
  }, [form, channel, resetChannelType])


  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      })
      await axios.patch(url, data);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <FormField control={form.control} name='name' render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <Input className='py-6' placeholder='Enter Channel Name' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='type' render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="focus:ring-0 text-zinc-400 ring-offset-0 focus:ring-offset-0 capitalize "
                      >
                        <SelectValue placeholder="Select a channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ChannelType).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>

              )} />
            </div>
            <DialogFooter className='px-6 py-4'>
              <Button className='m-auto w-full' type='submit' disabled={isLoading}>
                Update Channel
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog >
  )
}

export default EditChannelModal