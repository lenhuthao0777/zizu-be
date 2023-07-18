import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '../user/entities/user.entity';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TResponse } from 'utils/common.type';

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

  // Register
  async register(
    dto: RegisterDto,
  ): Promise<TResponse<{ email: string; name: string }>> {
    try {
      const user: User = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      const num = 10;

      if (user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'User is valid',
        };
      } else {
        const hashPassword: string = await hash(dto.password, num);
        const data = await this.prisma.user.create({
          data: { ...dto, password: hashPassword },
        });
        return {
          status: HttpStatus.CREATED,
          data: {
            email: data?.email,
            name: data?.name,
          },
          message: 'Register success!',
        };
      }
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error,
      };
    }
  }

  // Login
  async login(
    userInfo: { email: string; password: string },
    response: Response,
  ): Promise<TResponse<{ token: string }> | any> {
    try {
      const user: User | null = await this.validateUser(userInfo);

      if (user) {
        const payload = {
          name: user.name,
          email: user.email,
          role: 1,
        };
        const token = await this.jwt.signAsync(payload);
        response.cookie('token', token);
        return response.send({
          status: HttpStatus.OK,
          data: {
            token: token,
            email: user.email,
            name: user.name,
            id: user.id,
          },
          message: 'Login success!',
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      return response.send({
        status: HttpStatus.BAD_REQUEST,
        message: 'Email or Password is incorrect!',
      });
    }
  }

  async me(id: string) {
    try {
      const user: User = await this.prisma.user.findUnique({
        where: { id },
      });

      return {
        status: HttpStatus.OK,
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

  // Logout
  logout(res: Response) {
    res.clearCookie('token');
    return res.send({
      status: 200,
      message: 'Logout success!',
    });
  }
}
