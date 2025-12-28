import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('PCMS API')
    .setDescription('Pest Control Management System')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //To ensure DTOs are validated automatically
  app.useGlobalPipes(new ValidationPipe());

  //Allow version the endpoints
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  //Protect against common web attacks
  app.use(helmet());
  app.use(cookieParser());
  if (process.env.NODE_ENV === 'production') {
    app.use(csurf());
  }
  //app.use(csurf({ cookie: { sameSite: 'lax' } }));

  //TODO: Need to create these cron jobs for emailing, schedule and other reminders
  /*   cronService.handleEmailCron();
  scheduledCronService.handleDailyScheduledSyncCron(); */

  await app.listen(process.env.PORT ?? 3000);

  const banner =
    '        .--.       .--.\n' +
    '    _  `    \\     /    `  _\n' +
    '     `\\.===. \\.^./ .===./`\n' +
    '            \\/" "\\/\n' +
    '         ,  |     |  ,\n' +
    "        / `\\|`-.-'|/` \\\n" +
    '       /    |  \\  |    \\\n' +
    "    .-' ,-'`|   ; |`'-, '-.\n" +
    '        |   |    \\|   |\n' +
    '        |   |    ;|   |\n' +
    '        |   \\    //   |\n' +
    "        |    `._//'   |\n" +
    "jgs    .'             `.\n" +
    "    _,'                 `,_\n" +
    '    `                     `\n';

  console.log(banner);
  console.log("All systems go! Let's kill some bugs!");
}
bootstrap();
