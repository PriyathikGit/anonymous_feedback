'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { VerifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/type/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod"

const verifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof VerifySchema>>({ // type of signup schema
        resolver: zodResolver(VerifySchema),
    })

    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast.success(response.data.message)
            router.push('/sign-in')
        } catch (error) {
            console.error("Error in signup user", error);
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data?.message;
            toast.error(errorMessage)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your Email</p>

                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter your code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify Code</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default verifyAccount