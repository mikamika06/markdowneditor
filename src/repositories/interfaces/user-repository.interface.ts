import { User } from '../../models/user.model';

export interface IUserRepository {
  create(email: string, passwordHash: string): Promise<Omit<User, 'passwordHash'>>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}