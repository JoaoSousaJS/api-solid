import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserCase {
    constructor(
    private usersRepository: UsersRepository
    ) {}

    async execute({ name, email, password}: RegisterUseCaseRequest) {
        const hashedPassword = await hash(password, 6);

        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new UserAlreadyExistsError();
        }

        await this.usersRepository.create({
            name,
            email,
            password_hash: hashedPassword,
        });
    }
}
