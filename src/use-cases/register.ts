import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export const registerUseCase = async ({ name, email, password}: RegisterUseCaseRequest) => {
    const hashedPassword = await hash(password, 6);

    const userAlreadyExists = await prisma.user.findUnique({
        where: { email },
    });

    if (userAlreadyExists) {
        throw new Error('Email already exists');
    }

    const prismaUsersRepository = new PrismaUsersRepository();

    await prismaUsersRepository.create({
        name,
        email,
        password_hash: hashedPassword,
    });
};