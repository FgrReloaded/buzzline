"use client"

import React, { useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Form, FormControl, FormLabel, FormField, FormItem, FormMessage
} from "@/components/ui/form"

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import FileUpload from './FileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

/* The code is defining a form schema using the `zod` library. */
const formSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  imageUrl: z.string().url().min(1, "Image URL is required")
})

const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { server } = data;

  const isModalOpen = isOpen && type === 'editServer';

  const handleOnClose = () => {
    form.reset();
    onClose();
  }

  /* The code is initializing a form using the `useForm` hook from the `react-hook-form` library. */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: ""
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, data);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      form.setValue('imageUrl', server.imageUrl);
    }
  }, [server, isOpen])




  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Server</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <div className='space-y-8'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Server Image
                      </FormLabel>
                      <FormControl>
                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField control={form.control} name='name' render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input className='py-6' placeholder='Enter Server Name' disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <DialogFooter className='px-6 py-4'>
              <Button className='m-auto w-full' type='submit' disabled={isLoading}>
                Update Server
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog >
  )
}

export default EditServerModal