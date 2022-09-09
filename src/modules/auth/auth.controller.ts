import { FastifyReply, FastifyRequest } from 'fastify'
import { InputSignUp } from '../user/user.schema'
import { createUser, getAuthUser, getUserByEmail } from '../user/user.service'
import { InputLogin } from './auth.schema'

// Sign Up (Register)
export const signUpHandler = async (
  request: FastifyRequest<{ Body: InputSignUp }>,
  reply: FastifyReply
) => {
  const body = request.body

  const userExist = await getUserByEmail(body.email)

  if (userExist) {
    return reply.badRequest('User exists already')
  }

  const user = await createUser(body)

  /**
   * Remove password for response
   * You can also remove from the route options
   */
  const { password, ...rest } = user

  reply.code(201).send(rest)
}

// Sign In (Login)
export const signInHandler = async (
  request: FastifyRequest<{ Body: InputLogin }>,
  reply: FastifyReply
) => {
  const user = await getUserByEmail(request.body.username)

  if (!user) {
    return reply.unauthorized()
  }

  // JWT sign
  const access_token = await reply.jwtSign(user, {
    expiresIn: 604800, // 1 week
  })

  reply.send({ access_token })
}

// User auth
export const userAuthHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authUser = request.user
  if (!authUser) {
    return reply.unauthorized()
  }

  const user = await getAuthUser(authUser.id)

  if (!user) {
    return reply.notFound()
  }

  reply.send(user)
}

// Sign Out (Logout)
export const logoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.unauthorized()
  }

  try {
    // Logout session if using cookies
    request.session.delete()
  } catch (e) {
    return reply.internalServerError()
  }

  reply.send({ message: 'User logged out' })
}
