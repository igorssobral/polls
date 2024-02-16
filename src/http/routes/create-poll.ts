import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    const prisma = new PrismaClient();

    const { title, options } = createPollBody.parse(request.body);

    const poll = await prisma.poll.create({
      data: {
        title,
        ...(options && {
          options: {
            createMany: {
              data: options.map((option) => {
                return { title: option };
              }),
            },
          },
        }),
      },
    });

    return reply.status(201).send({ pollId: poll.id });
  });
}
