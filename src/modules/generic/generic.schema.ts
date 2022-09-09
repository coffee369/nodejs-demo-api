import { TSchema, Type } from '@sinclair/typebox'

export const GenericSchema = Type.Object({
  message: Type.String(),
})

export const FastifyDefaultSchema = Type.Object({
  statusCode: Type.Optional(Type.Number()),
  error: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
})

export const UnauthorizedSchema = Type.String()

export const AuthorizationSchema = Type.Strict(
  Type.Object({
    authorization: Type.String(),
  })
)

export const Nullable = <T extends TSchema>(type: T) =>
  Type.Union([type, Type.Null()])
