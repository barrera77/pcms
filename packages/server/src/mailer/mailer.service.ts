import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationEmail(to: string, token: string) {
    const activationLink = `${process.env.FRONTEND_URL}/activate?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Activate your PCMS account',
      html: `
        <p>Hello,</p>
        <p>Click the link below to activate your account:</p>
        <a href="${activationLink}">Activate your account</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  }
}
