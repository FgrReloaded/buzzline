"use client"

import React from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import qs from 'query-string';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormLabel, FormField, FormItem, FormMessage
} from "@/components/ui/form"

import { Button } from '../ui/button';
import FileUpload from './FileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

/* The code is defining a form schema using the `zod` library. */
const formSchema = z.object({
  fileUrl: z.string().url().min(1, "Image URL is required")
})

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const { apiUrl, query } = data

  const isModalOpen = isOpen && type === 'messageFile';

  /* The code is initializing a form using the `useForm` hook from the `react-hook-form` library. */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: ""
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      })

      await axios.post(url, {
        ...data, content: data.fileUrl
      });

      form.reset();
      handleClose();

    } catch (error) {
      console.log(error)
    }
  }
  const handleClose = () => {
    form.reset();
    onClose();
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach a File</DialogTitle>
          <DialogDescription>
            Send files with messages
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <div className='space-y-8'>
                <FormField
                  control={form.control}
                  name='fileUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>
            <DialogFooter className='px-6 py-4'>
              <Button className='m-auto w-full' type='submit' disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog >
  )
}

export default MessageFileModal