"use client"

import React, { useEffect, useState } from 'react';
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

/* The code is defining a form schema using the `zod` library. */
const formSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  imageUrl: z.string().url().min(1, "Image URL is required")
})

const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      await axios.post('/api/servers', data);
      form.reset();

      router.refresh();
      window.location.reload();

    } catch (error) {
      console.log(error)
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Server</DialogTitle>
          <DialogDescription>
            A server is a group of people who can chat and talk with each other.
          </DialogDescription>
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
                Create Server
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog >
  )
}

export default InitialModal