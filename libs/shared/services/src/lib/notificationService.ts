// libs/shared/services/src/lib/notificationService.ts

import { configs } from '@domo/config';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Resend } from 'resend';
import { twilioService } from './twilioService';

const resend = new Resend(configs.RESEND_API_KEY);

export class NotificationService {
  constructor(private fastify: FastifyInstance) {}

  async sendFormNotification(data: Record<string, any>) {
    const senderName =
      data.fullName || `${data.firstName || ''} ${data.lastName || 'Anonymous'}`.trim();
    const recipientEmail = data.email || 'noreply@example.com';

    let subject = 'New Form Submission';
    let htmlBody = '';
    let isHighPriority = false;

    if (data.quoteDetails) {
      // --- QUOTE FORM LOGIC ---
      subject = `💰 QUOTE REQUEST: ${data.companyName || senderName}`;
      isHighPriority = true;
      htmlBody = `
        <h2>New Quote Request</h2>
        <p><strong>Company:</strong> ${data.companyName || 'N/A'}</p>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${recipientEmail}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Service:</strong> ${data.serviceType || 'N/A'}</p>
        <p><strong>Budget:</strong> ${data.priceRange || 'N/A'}</p>
        <hr />
        <p><strong>Details:</strong></p>
        <p>${data.quoteDetails}</p>
      `;
    } else if (data.message) {
      // --- CONTACT FORM LOGIC ---
      subject = `📧 CONTACT FORM: ${senderName}`;
      htmlBody = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${recipientEmail}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Attention To:</strong> ${data.attention || 'General'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `;
    } else if (data.comment) {
      // --- COMMENT LOGIC ---
      subject = `💬 NEW COMMENT from ${senderName}`;
      htmlBody = `<p><strong>Comment:</strong> ${data.comment}</p>`;
    } else {
      throw new Error('Invalid or incomplete form data received.');
    }

    try {
      const resp = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: configs.GMAIL!,
        replyTo: recipientEmail,
        subject,
        html: htmlBody,
      });

      // Resend client returns the created email data; adapt to your client shape if different
      const emailData = (resp as any).data ?? resp;

      this.fastify.log.info({ emailId: emailData?.id }, 'Email notification dispatched');

      if (isHighPriority) {
        try {
          await twilioService.sendSMS(
            configs.MY_PERSONAL_NUMBER,
            `Priority Quote: ${senderName} - ${data.serviceType || 'N/A'}`,
          );
        } catch (smsErr) {
          this.fastify.log.error({ smsErr }, 'SMS failed (non-fatal)');
        }
      }

      return emailData;
    } catch (err: any) {
      this.fastify.log.error({ err }, 'Resend API Error');
      throw err;
    }
  }
}

/**
 * Fastify plugin that decorates the instance with notificationService
 */
declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface FastifyInstance {
    notificationService: NotificationService;
  }
}

const notificationPlugin: FastifyPluginAsync = async (fastify) => {
  const svc = new NotificationService(fastify);
  fastify.decorate('notificationService', svc);
};

export default fp(notificationPlugin, {
  name: 'notification-service-plugin',
});
