import { Injectable } from "@nestjs/common";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { prisma } from "../../libs/prisma";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FeedbackService {
  findAll() {
    return prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  }

  create(dto: CreateFeedbackDto) {
    return prisma.feedback.create({
      data: { id: uuidv4(), by: dto.by, content: dto.content },
    });
  }
}
