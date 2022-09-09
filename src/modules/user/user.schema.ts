import fastifyPassport from '@fastify/passport'
import { Static, Type } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'
import { sessionOpts } from '../../utils/auth'
import {
  AuthorizationSchema,
  FastifyDefaultSchema,
  GenericSchema,
  Nullable,
  UnauthorizedSchema,
} from '../generic/generic.schema'
import { MetaSchema, PaginateRequestSchema } from '../generic/pagination.schema'
import { tableCore } from '../generic/table.schema'
import { ProfileSchema } from '../profile/profile.schema'

/**
 * Main user schema
 * @description: Treat the schema definition as application code.
 * @see: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
 */
const userCore = {
  email: Type.String({
    format: 'email',
    minLength: 1,
    maxLength: 255,
  }),
  firstName: Type.String({
    minLength: 1,
    maxLength: 255,
  }),
  lastName: Type.String({
    minLength: 1,
    maxLength: 255,
  }),
  password: Type.String({
    minLength: 7,
    maxLength: 255,
  }),
  ...tableCore,
}
const UserSchema = Type.Object(userCore)

/**
 * Request
 */
export const CreateUserSchema = Type.Strict(
  Type.Pick(UserSchema, ['firstName', 'lastName', 'email', 'password'])
)
export const UpdateNameSchema = Type.Strict(
  Type.Pick(UserSchema, ['firstName', 'lastName'])
)
export const ChangePasswordSchema = Type.Strict(
  Type.Object({
    newPassword: Type.String({
      minLength: 7,
    }),
    oldPassword: Type.String(),
  })
)
export const UpdateEmailSchema = Type.Strict(Type.Pick(UserSchema, ['email']))

/**
 * Response
 */

export const UserInfoSchema = Type.Omit(UserSchema, ['password'])
export const UserAuthSchema = Type.Omit(UserSchema, [
  'password',
  'createdAt',
  'updatedAt',
])

const userProfileCore = Type.Object({
  ...userCore,
  profile: Nullable(ProfileSchema),
})

const UserProfileSchema = Type.Omit(userProfileCore, ['password'])

const EmailTokenSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  access_token: Type.String(),
  ...tableCore,
})

export const UserArraySchema = Type.Array(UserProfileSchema)
export const UserListSchema = Type.Object({
  meta: MetaSchema,
  users: UserArraySchema,
})

/**
 * Request and/or Response Types / Validation
 */
export type InputSignUp = Static<typeof CreateUserSchema>
export type InputName = Static<typeof UpdateNameSchema>
export type InputPassword = Static<typeof ChangePasswordSchema>
export type InputEmail = Static<typeof UpdateEmailSchema>
export type UserAuthResponse = Static<typeof UserAuthSchema>

/**
 * Route Options
 */
export const SignUpOpts: RouteShorthandOptions = {
  schema: {
    body: CreateUserSchema,
    response: {
      201: UserInfoSchema,
      400: GenericSchema,
    },
  },
}

export const UserAuthOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    response: {
      200: UserAuthSchema,
      401: UnauthorizedSchema,
    },
  },
}

export const DeleteUserOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    response: {
      200: GenericSchema,
      401: UnauthorizedSchema,
    },
  },
}

export const UpdateNameOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    body: UpdateNameSchema,
    response: {
      200: UserInfoSchema,
      401: UnauthorizedSchema,
      422: FastifyDefaultSchema,
    },
  },
}

export const UpdateEmailOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    body: UpdateEmailSchema,
    response: {
      200: EmailTokenSchema,
      401: UnauthorizedSchema,
      400: FastifyDefaultSchema,
      422: FastifyDefaultSchema,
    },
  },
}

export const UpdatePasswordOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    body: ChangePasswordSchema,
    response: {
      200: GenericSchema,
      401: UnauthorizedSchema,
      422: FastifyDefaultSchema,
    },
  },
}

export const UserOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    response: {
      200: UserProfileSchema,
      401: UnauthorizedSchema,
    },
  },
}

export const ListUserOpts: RouteShorthandOptions = {
  preValidation: [fastifyPassport.authenticate('jwt', sessionOpts)],
  schema: {
    headers: AuthorizationSchema,
    querystring: PaginateRequestSchema,
    response: {
      200: UserListSchema,
      401: UnauthorizedSchema,
    },
  },
}
