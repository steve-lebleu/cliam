/**
 * @description Describe the body of a Brevo transactional email
 */
export interface IBrevoBody {
  sender: {
    name: string,
    email: string,
    id: 2
  },
  to: [
    {
      email: string,
      name: string
    }
  ],
  bcc: [
    {
      email: string,
      name: string
    }
  ],
  cc: [
    {
      email: string,
      name: string
    }
  ],
  htmlContent: string,
  textContent: string,
  subject: string,
  replyTo: {
    email: string,
    name: string
  },
  attachment: [
    {
      url: string,
      content: string,
      name: string
    }
  ],
  headers: {
    'sender.ip': string,
    'X-Mailin-custom': string,
    idempotencyKey: string
  },
  templateId: number,
  params: {
    FNAME: string,
    LNAME: string
  },
  messageVersions: [
    {
      to: [
        {
          email: string,
          name: string
        }
      ],
      params: {
        FNAME: string,
        LNAME: string
      },
      bcc: [
        {
          email: string,
          name: string
        }
      ],
      cc: [
        {
          email: string,
          name: string
        }
      ],
      replyTo: {
        email: string,
        name: string
      },
      subject: string
    }
  ],
  tags: [
    string
  ],
  scheduledAt: Date,
  batchId: string
}