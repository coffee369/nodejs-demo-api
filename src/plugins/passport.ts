import fastifyPassport from '@fastify/passport'
import fastifySecureSession from '@fastify/secure-session'
import fp from 'fastify-plugin'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserAuthResponse } from '../modules/user/user.schema'
import { getAuthUser, getUserAllInfo } from '../modules/user/user.service'
import { verifyPassword } from '../utils/auth'

/**
 * Passport integration
 */
export default fp(async (fastify, {}) => {
  /**
   * Setup secure session
   */
  fastify.register(fastifySecureSession, {
    secret: process.env.SESSION_SECRET || '',
    salt: process.env.SESSION_SALT || '',
  })

  /**
   * Initialize fastify passport
   */
  fastify.register(fastifyPassport.initialize())
  fastify.register(fastifyPassport.secureSession())

  /**
   * User serializer and deserializer
   */
  fastifyPassport.registerUserSerializer(
    async (user: UserAuthResponse) => user.id
  )

  fastifyPassport.registerUserDeserializer(async (id: string) => {
    const user = await getAuthUser(id)
    if (!user) {
      throw 'pass'
    }
    return user
  })

  /**
   * Strategies
   * @see https://www.passportjs.org/
   */

  // Using JWTStrategy
  fastifyPassport.use(
    'jwt',
    new JWTStrategy(
      {
        secretOrKey: process.env.JWT_SECRET_KEY || '',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token, done) => {
        const checkUser = await getAuthUser(token.id)
        if (!checkUser) {
          return done(null, false)
        }

        try {
          return done(null, token)
        } catch (error) {
          done(error, null)
        }
      }
    )
  )

  // Using LocalStrategy
  fastifyPassport.use(
    'local',
    new LocalStrategy(async (username, password, done) => {
      if (typeof username !== 'string' || typeof password !== 'string') {
        return done(null, false)
      }

      if (!username || !password) {
        return done(null, false, {
          message: 'empty user or password',
        })
      }

      const user = await getUserAllInfo(username)

      if (!user) {
        return done(null, false, {
          message: 'user not found',
        })
      }

      const checkPassword = await verifyPassword({
        candidatePassword: password,
        userPassword: user.password,
      })

      if (!checkPassword) {
        return done(null, false, {
          message: 'password does not match',
        })
      }

      // Remove unused data
      const { password: pw, createdAt, updatedAt, ...rest } = user

      return done(null, rest)
    })
  )

  // Add more strategy like Facebook, Twitter, etc
})

declare module 'fastify' {
  interface PassportUser extends UserAuthResponse {}
}
