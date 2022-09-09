import fastifyPassport from '@fastify/passport'
import { Static, Type } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'
import { sessionOpts } from '../../utils/auth'
import {
  AuthorizationSchema,
  FastifyDefaultSchema,
  GenericSchema,
  UnauthorizedSchema,
} from '../generic/generic.schema'

/**
 * Request
 */
export const LoginSchema = Type.Strict(
  Type.Object({
    username: Type.String({
      minLength: 1,
      maxLength: 255,
    }),
    password: Type.String({
      minLength: 1,
      maxLength: 255,
    }),
  })
)

/**
 * Response
 */
const LoginResponseSchema = Type.Strict(
  Type.Object({
    access_token: Type.String(),
  })
)

/**
 * Request and/or Response Types / Validation
 */
export type InputLogin = Static<typeof LoginSchema>
export type LoginResponse = Static<typeof LoginResponseSchema>

/**
 * Routes Options
 */
export const LoginOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('local', sessionOpts)],
  schema: {
    body: LoginSchema,
    response: {
      401: UnauthorizedSchema,
      400: FastifyDefaultSchema,
      200: LoginResponseSchema,
    },
  },
}

export const LogoutOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    response: {
      401: FastifyDefaultSchema,
      200: GenericSchema,
    },
  },
}
