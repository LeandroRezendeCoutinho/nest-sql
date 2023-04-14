import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cluster from 'node:cluster';
import { cpus } from 'os'
import { Logger } from '@nestjs/common'

if (cluster.isPrimary) {
  const cpuCount = cpus().length

  for (let i = 0; i < cpuCount -2; i += 1) {
    cluster.fork()
  }

  cluster.on('online', worker => {
    Logger.log('Worker ' + worker.process.pid + ' is online.')
  })
  cluster.on('exit', ({ process }) => {
    Logger.log('worker ' + process.pid + ' died.')
  })
} else {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
  }
  bootstrap();
}