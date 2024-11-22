
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

//  Not necessary anymore ?
//   async enableShutDownhooks(app: INestApplication) {
//     this.$on('beforeExit', async () => {
//         await app.close();
//     });
//   }
}
