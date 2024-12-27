import { PrismaService } from '../prisma.service';

export async function seedUsers(prisma: PrismaService) {
  await prisma.user.createMany({
    data: [
      { username: 'john_doe', email: 'john@example.com' },
      { username: 'jane_doe', email: 'jane@example.com' },
    ],
  });
}
