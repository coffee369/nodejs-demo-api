import fp from 'fastify-plugin'
import cors, { FastifyCorsOptions } from '@fastify/cors'

/**
 * This plugins setup the CORS
 */
export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    // Demo only
    origin: '*',
  })
})
