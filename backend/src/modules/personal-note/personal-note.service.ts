import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { prisma } from "../../libs/prisma";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PersonalNoteService {
  findByPerson(personId: string) {
    return prisma.personalNote.findMany({ where: { personId } });
  }

  create(dto: CreateNoteDto) {
    return prisma.personalNote.create({
      data: { id: uuidv4(), personId: dto.personId, content: dto.content },
    });
  }

  /**
   * A person carries at most one note, so saving replaces whatever is there and
   * an empty body clears it - avoids the delete-then-create race on the client.
   */
  async upsert(dto: CreateNoteDto) {
    const content = dto.content.trim();
    const existing = await prisma.personalNote.findFirst({
      where: { personId: dto.personId },
    });

    if (!content) {
      if (existing) await prisma.personalNote.delete({ where: { id: existing.id } });
      return null;
    }

    if (existing) {
      return prisma.personalNote.update({
        where: { id: existing.id },
        data: { content },
      });
    }

    return prisma.personalNote.create({
      data: { id: uuidv4(), personId: dto.personId, content },
    });
  }

  async remove(id: string) {
    const note = await prisma.personalNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException("Note not found");
    await prisma.personalNote.delete({ where: { id } });
  }
}
