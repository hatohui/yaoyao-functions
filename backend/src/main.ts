import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import figlet from "figlet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.useGlobalInterceptors(new LoggingInterceptor());
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
    apiReference({ content: openApiDoc, theme: "deepSpace" }),
  );

  app.use("/api/openapi", (_req: any, res: any) => res.json(openApiDoc));

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  printBanner(Number(port));
}

function printBanner(port: number): void {
  const r = "\x1b[0m";
  const y = "\x1b[33m";
  const c = "\x1b[36m";
  const g = "\x1b[32m";
  const b = "\x1b[1m";
  const d = "\x1b[2m";

  const art = figlet.textSync("YaoYao Dinner", { font: "Standard" });

  console.log(`\n${y}${art}${r}`);
  console.log(
    `${b}${y}  :: YaoYao Dinner ::${r}${d}  Restaurant Management API  (v1.0.0)${r}\n`,
  );
  console.log(
    `  ${c}Environment${r}  ${process.env.NODE_ENV ?? "development"}`,
  );
  console.log(`  ${c}Port       ${r}  ${port}`);
  console.log(
    `  ${c}Docs       ${r}  ${g}http://localhost:${port}/api/docs${r}\n`,
  );
}

bootstrap();
