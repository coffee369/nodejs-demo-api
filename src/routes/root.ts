import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Just a root route for checking the url
  fastify.get('/', async (request, reply) => {
    reply.send({ root: 'ok' })
  })
}

export default root
