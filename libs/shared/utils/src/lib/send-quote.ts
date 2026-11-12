// libs/shared/utils/src/lib/send-quote.ts
import { createServerFn } from '@tanstack/react-start'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface QuoteFormData {
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  serviceType?: string
  priceRange?: string
  phone?: string
  website?: string
  quoteDetails: string
}

export const sendQuoteFn = createServerFn({ method: 'POST' })
  .validator((data: unknown): QuoteFormData => {
    const formData = data as QuoteFormData
    if (!formData?.email || !formData?.quoteDetails) {
      throw new Error('Email and quote details are required.')
    }
    return formData
  })
  .handler(async ({ data }: { data: QuoteFormData }) => {
    const {
      email,
      firstName = '',
      lastName = '',
      companyName = 'N/A',
      serviceType = 'N/A',
      priceRange = 'N/A',
      phone = 'N/A',
      website = 'N/A',
      quoteDetails,
    } = data

    const senderName = `${firstName} ${lastName}`.trim() || email

    const textContent = `
New Quote Request:
------------------
Name: ${senderName}
Email: ${email}
Company: ${companyName}
Phone: ${phone}
Website: ${website}
Service Requested: ${serviceType}
Price Range: ${priceRange}

Details:
${quoteDetails}
`.trim()

const recipientEmail = process.env.QUOTE_RECIPIENT_EMAIL || 'patrick.totaldata.dominic@gmail.com';

    const response = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `New Quote Request from ${senderName}`,
      replyTo: email,
      text: textContent,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return { success: true }
  })
