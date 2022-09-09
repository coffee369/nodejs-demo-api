import fp from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'

/**
 * This plugins adds a Swagger UI
 */
export default fp(async (fastify) => {
  fastify.register(fastifySwagger, {
    routePrefix: '/docs',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Node.js API Demo',
        description: 'Endpoints using the Fastify Swagger',
        version: '0.0.1',
      },
    },
  })
})
