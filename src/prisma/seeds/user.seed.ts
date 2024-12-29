import { Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaService) {
  const configService = new ConfigService();

  const hashedPassword = await bcrypt.hash(
    configService.get('ADMIN_PASSWORD'),
    10,
  );

  await prisma.user.createMany({
    data: [
      { username: 'john_doe', email: 'john@example.com' },
      { username: 'jane_doe', email: 'jane@example.com' },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    ],
  });
}
