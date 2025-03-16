import {
  Injectable,
} from '@nestjs/common';
import { Account } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthenDTO } from './dtos/authen.dto';
import { AccountUtil } from 'src/modules/authen/account.util';
import { MailService } from './mail.service';
import { env } from 'src/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly accountUtil: AccountUtil,
  ) {}

  async createUser({ username, password }: AuthenDTO): Promise<Boolean> {
    const findUser = await this.accountUtil.findByUsername(username);
    if (findUser) 
      return true;

    const ecryptPassword = await bcrypt.hash(password, 12);

    const user = this.accountUtil.create(username, ecryptPassword);
    await this.accountUtil.save(user);
  }

  async validateUser({ username, email, password }: AuthenDTO): Promise<string> {
    let findUser: Account;

    if (username) {
      findUser = await this.accountUtil.findByUsername(username);
    }

    if (!findUser && email) {
      const userByEmail = await this.accountUtil.findByEmail(email);
      if (userByEmail?.verifyEmail) {
        findUser = userByEmail;
      }
    }

    if (!findUser) return null;

    if (await bcrypt.compare(password, findUser.password)) {
      const {
        password,
        profile,
        verifyEmail,
        created_at,
        updated_at,
        ...user
      } = findUser;
      return this.jwtService.sign({ user, jit: uuidv4() });
    }

    return null;
  }

  async forgotPassword(email: string): Promise<Boolean> {
    const user = await this.accountUtil.findByEmail(email);

    if (!user) return null

    const payload = { email };
    const token = this.jwtService.sign(payload, { expiresIn: env.mailer.time });

    const resetLink = `${env.dns}/reset-password?token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Reset password',
      text: `Dear user,\n\nWe received a request to reset your password...`,
      html: `
                <h1>Dear user,</h1>
                <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
                <p>To reset your password, click the link below:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>This link will expire in <strong>${env.mailer.time}</strong> for security reasons.</p>
                <p>If you have any issues, please contact our support team.</p>
                <p>Best regards,<br>Your Website Team</p>
            `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<Boolean> {
      try {
          const decoded = this.jwtService.verify(token);
          const email = decoded.email;
      
          const user = await this.accountUtil.findByEmail(email);
          if (!user) 
            return null;
          await this.accountUtil.updatePassword(user, newPassword);
      } catch (error) {
          return false;
      }
  }

  async verifyEmail(email: string): Promise<Boolean> {
    const user = await this.accountUtil.findByEmail(email);

    if (!user) return null
    if (user.verifyEmail) return false;

    const payload = { email };
    const token = this.jwtService.sign(payload, { expiresIn: env.mailer.time });

    const verifyLink = `${env.dns}/verify?token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Verify email',
      text: `Dear user,\n\nWe received a request to verify your email...`,
      html: `
                <h1>Dear user,</h1>
                <p>We received a request to verify your email. If you did not make this request, please ignore this email.</p>
                <p>To verify your email, click the link below:</p>
                <p><a href="${verifyLink}">${verifyLink}</a></p>
                <p>This link will expire in <strong>${env.mailer.time}</strong> for security reasons.</p>
                <p>If you have any issues, please contact our support team.</p>
                <p>Best regards,<br>Your Website Team</p>
            `,
    });
  }

  async verify(token: string): Promise<Boolean> {
    try {
      const decoded = this.jwtService.verify(token);
      const email = decoded.email;

      const user = await this.accountUtil.findByEmail(email);
      if (!user)  return null;

      await this.accountUtil.updateVerifyEmail(user);
    } catch (error) {
      return false
    }
  }
}
