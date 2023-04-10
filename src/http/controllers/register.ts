import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUserCase } from '@/use-cases/register';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const usersRepository = new PrismaUsersRepository();
        const registerUseCase = new RegisterUserCase(usersRepository);

        await registerUseCase.execute({ name, email, password });

    } catch (error) {
        return reply.status(409).send();
    }

    return reply.status(201).send();
};