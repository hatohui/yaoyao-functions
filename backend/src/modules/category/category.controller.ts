import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { CategoryService } from "./category.service";

@ApiTags("categories")
@Controller("categories")
export class CategoryController {
  constructor(private category: CategoryService) {}

  @Get()
  @ApiOperation({ operationId: "getCategories" })
  @ApiQuery({ name: "lang", required: false, type: String, example: "en" })
  findAll(@Query("lang") lang = "en") {
    return this.category.findAll(lang);
  }

  @Get(":id")
  @ApiOperation({ operationId: "getCategoryById" })
  @ApiQuery({ name: "lang", required: false, type: String, example: "en" })
  findOne(@Param("id") id: string, @Query("lang") lang = "en") {
    return this.category.findOne(id, lang);
  }
}
