import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt'
import fp from 'fastify-plugin'
import 'dotenv/config'

const options = {
  secret: process.env.JWT_SECRET_KEY || '',
  decoratorName: 'userAuth',
}

/**
 * This plugin adds JWT utils for Fastify
 */
export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(fastifyJwt, options)
})
