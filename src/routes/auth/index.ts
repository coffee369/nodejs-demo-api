import { FastifyPluginAsync } from 'fastify'
import {
  logoutHandler,
  signInHandler,
  signUpHandler,
  userAuthHandler,
} from '../../modules/auth/auth.controller'
import {
  InputLogin,
  LoginOpts,
  LogoutOpts,
} from '../../modules/auth/auth.schema'
import {
  InputSignUp,
  SignUpOpts,
  UserAuthOpts,
} from '../../modules/user/user.schema'

/**
 * Authentication Routes
 * @param fastify
 * @param opts
 */
const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Sign Up
  fastify.post<{
    Body: InputSignUp
  }>('/signup', SignUpOpts, signUpHandler)

  // Login
  fastify.post<{ Body: InputLogin }>('/signin', LoginOpts, signInHandler)

  // View authenticated user
  fastify.get('/', UserAuthOpts, userAuthHandler)

  // Logout (if using session / cookies)
  fastify.post('/signout', LogoutOpts, logoutHandler)
}

export default auth
