'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/type/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod"

const MessagePage = () => {
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const params = useParams<{ username: string }>()
  const username = params.username;

  type MessageFormData = z.infer<typeof messageSchema>;

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema)
  })

  const { register, handleSubmit, formState: { errors } } = form

  const sendMessage = async (data: MessageFormData) => {
    setIsSendingMessage(true)
    try {
      const response = await axios.post('/api/send-message', {
        username,
        content: data.content
      })
      console.log(response);

      toast.success(response.data.message)
      form.reset()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError?.response?.data.message || 'Failed to fetch message setting')
    } finally {
      setIsSendingMessage(false)
    }
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className="text-4xl font-bold mb-4 text-center">Public Page</h1>
      <p className="text-lg font-bold mb-4 mt-6">Send Anonymouse Message to {username}</p>
      <form onSubmit={handleSubmit(sendMessage)}>
        <Textarea
          {...register('content')}
          placeholder='type your secret message here...'
          disabled={isSendingMessage}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
        <Button type='submit' disabled={isSendingMessage}
          className='mt-4 flex items-center justify-center'>
          {isSendingMessage ? 'Sending' : 'Send it'}
        </Button>
      </form>
    </div>
  )
}

export default MessagePage