import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { LanguageModule } from "./modules/language/language.module";
import { CategoryModule } from "./modules/category/category.module";
import { FoodModule } from "./modules/food/food.module";
import { TableModule } from "./modules/table/table.module";
import { PeopleModule } from "./modules/people/people.module";
import { AccountModule } from "./modules/account/account.module";
import { OrderModule } from "./modules/order/order.module";
import { FeedbackModule } from "./modules/feedback/feedback.module";
import { PersonalNoteModule } from "./modules/personal-note/personal-note.module";
import { PresetMenuModule } from "./modules/preset-menu/preset-menu.module";
import { ImagesModule } from "./modules/images/images.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    HealthModule,
    LanguageModule,
    CategoryModule,
    FoodModule,
    TableModule,
    PeopleModule,
    AccountModule,
    OrderModule,
    FeedbackModule,
    PersonalNoteModule,
    PresetMenuModule,
    ImagesModule,
  ],
})
export class AppModule {}
