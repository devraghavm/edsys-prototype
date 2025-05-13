import { Module } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service'; // Import the PrismaService

@Module({
  providers: [PrismaService],
  exports: [PrismaService], //export this service to use in other modules
})
export class PrismaModule {}
