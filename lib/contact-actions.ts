'use server'

import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactInquiryData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export async function inquire(data: ContactInquiryData) {
  const supabase = await createClient()

  const { error: dbError } = await supabase
    .from('inquiries')
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      message: data.message,
    })

  if (dbError) {
    console.error('Database error:', dbError)
    return { success: false, error: 'Failed to save inquiry' }
  }

  try {
    const { error: emailError } = await resend.emails.send({
      from: 'AgroEcom <onboarding@resend.dev>',
      to: process.env.MY_EMAIL as string, 
      subject: `New Inquiry from ${data.firstName} ${data.lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #008000;">
          ${data.message}
        </blockquote>
      `
    })

    if (emailError) {
      console.error('Email error:', emailError)
    }

  } catch (error) {
    console.error('Unexpected email error:', error)
  }

  return { success: true }
}