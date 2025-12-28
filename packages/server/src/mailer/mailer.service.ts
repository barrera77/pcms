import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendActivationEmail(email: string, token: string) {
    // For now, just include the token in the email
    // User will manually POST to /user/activate with this token
    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your PCMS account',
      html: `
        <h2>Account Activation</h2>
        <p>Your account has been created. To activate it, use this token:</p>
        <p><strong>${token}</strong></p>
        <p>Send a POST request to <code>POST /user/activate</code> with:</p>
        <pre>
{
  "token": "${token}",
  "password": "your-password"
}
        </pre>
        <p>This token expires in 48 hours.</p>
      `,
    });

    console.log('Activation email sent to:', email);
  }
}
