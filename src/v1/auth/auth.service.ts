import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '../user/entities/user.entity';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(readonly prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(userInfo: {
    email: string;
    password: string;
  }): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    const checkUser: boolean = await compare(userInfo.password, user.password);

    if (user && checkUser) {
      return user;
    }

    return null;
  }

  async register(dto: RegisterDto) {
    try {
      const user: User = await this.validateUser(dto);

      const num = 10;
      if (user) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: 'User is valid',
        };
      } else {
        const hashPassword: string = await hash(dto.password, num);

        const data = await this.prisma.user.create({
          data: { ...dto, password: hashPassword },
        });

        return {
          code: HttpStatus.CREATED,
          data: {
            email: data?.email,
            name: data?.name,
          },
          message: 'Register success!',
        };
      }
    } catch (error) {
      return {
        code: HttpStatus.BAD_REQUEST,
        error,
      };
    }
  }

  async login(
    userInfo: { email: string; password: string },
    request: Request,
    response: Response,
  ) {
    try {
      const user: User = await this.validateUser(userInfo);

      const payload = {
        name: user.name,
        email: user.email,
        role: 1,
      };

      const token = await this.jwt.signAsync(payload);

      if (user) {
        response.cookie('token', token);

        return response.send({
          code: HttpStatus.OK,
          data: {
            token: token,
          },
          message: 'Login success!',
        });
      }
    } catch (error) {
      return {
        code: HttpStatus.BAD_REQUEST,
        error,
      };
    }
  }

  async me(email: string) {
    try {
      const user: User = await this.prisma.user.findUnique({
        where: { email },
      });

      return {
        code: HttpStatus.OK,
        data: {
          name: user.name,
          email: user.email,
        },
        message: 'Success!',
      };
    } catch (error) {
      return new BadRequestException('Authenticated!');
    }
  }

  logout(res: Response) {
    res.clearCookie('token');
    return res.send('Logout success!');
  }
}
