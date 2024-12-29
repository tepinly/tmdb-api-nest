import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const jwtService = new JwtService({
  secret: configService.get('JWT_SECRET'),
  signOptions: { expiresIn: '1d' },
});

// TODO: Used for development purposes, should be removed in production
async function generateAdminToken() {
  const prismaService = new PrismaService();
  const adminUser = await prismaService.user.findFirst({
    where: { role: Role.ADMIN },
  });

  if (!adminUser) {
    throw new Error('Admin user not found');
  }

  const payload = {
    sub: adminUser.id,
    username: adminUser.username,
    role: adminUser.role,
  };

  const token = jwtService.sign(payload);
  console.log('Admin Token:', token);
}

generateAdminToken().catch((e) => console.error(e));
