import { Module } from '@nestjs/common';
import { PersonalNoteController } from './personal-note.controller';
import { PersonalNoteService } from './personal-note.service';

@Module({
  controllers: [PersonalNoteController],
  providers: [PersonalNoteService],
})
export class PersonalNoteModule {}
