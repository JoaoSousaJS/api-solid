import { prisma } from '@/lib/prisma';
import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';

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

        const userAlreadyExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userAlreadyExists) {
            throw new Error('Email already exists');
        }


        await this.usersRepository.create({
            name,
            email,
            password_hash: hashedPassword,
        });
    }
}
