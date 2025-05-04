'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import * as z from 'zod';

const page = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof SignInSchema>>({ // type of signin schema
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
      callbackUrl: '/dashboard'
    })

    if (result?.error) {
      toast.error('Incorrect username or passowrd')
      console.log("error", result?.error);

    }
    if (result?.ok && result.url) {
      router.replace(result.url); // ✅ now this will point to /dashboard
    }

    // if (result?.ok) {
    //   toast.success("login succesful...")
    //   console.log("full result", result)

    //   // router.replace('/dashboard')
    // }
    console.log("login flow completed")
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Enter into anonymous world
          </h1>
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Signin</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New here?
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page