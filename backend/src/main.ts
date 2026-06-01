import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("YaoYao Dinner API")
      .setDescription("Restaurant management API")
      .setVersion("1.0")
      .addBearerAuth(
        { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        "JWT",
      )
      .build(),
  );

  app.use(
    "/api/docs",
    apiReference({ spec: { content: openApiDoc }, theme: "deepSpace" }),
  );

  // Serves raw OpenAPI JSON for code generation tools (e.g. Orval)
  app.use("/api-spec", (_req: any, res: any) => res.json(openApiDoc));

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📖 API docs at http://localhost:${port}/api/docs`);
}

bootstrap();
