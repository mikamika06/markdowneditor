import { IUserRepository } from './interfaces/user-repository.interface';
import { INoteRepository } from './interfaces/note-repository.interface';
import { PgUserRepository } from './pg/user-repository.pg';
import { PgNoteRepository } from './pg/note-repository.pg';

export class RepositoryFactory {
  private static userRepository: IUserRepository;
  private static noteRepository: INoteRepository;
  
  static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new PgUserRepository();
    }
    return this.userRepository;
  }
  
  static getNoteRepository(): INoteRepository {
    if (!this.noteRepository) {
      this.noteRepository = new PgNoteRepository();
    }
    return this.noteRepository;
  }
}