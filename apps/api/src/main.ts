import {NestFactory} from '@nestjs/core';

import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle('Orbis API')
        .setDescription('The Orbis API description')
        .setVersion('1.0')
        .addTag('Orbis')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
