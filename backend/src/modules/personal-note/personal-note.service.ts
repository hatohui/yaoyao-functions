import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { prisma } from '../../prisma';
import { v4 as uuidv4 } from 'uuid';

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

  async remove(id: string) {
    const note = await prisma.personalNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    await prisma.personalNote.delete({ where: { id } });
  }
}
