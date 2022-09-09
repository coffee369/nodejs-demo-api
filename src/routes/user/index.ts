import { FastifyPluginAsync } from 'fastify'
import { InputPaginate } from '../../modules/generic/pagination.schema'
import {
  changePasswordHandler,
  deleteUserHandler,
  listUserHandler,
  updateUserEmailHandler,
  updateUserInfoHandler,
  userHandler,
} from '../../modules/user/user.controller'
import {
  DeleteUserOpts,
  InputEmail,
  InputName,
  InputPassword,
  ListUserOpts,
  UpdateEmailOpts,
  UpdateNameOpts,
  UpdatePasswordOpts,
  UserOpts,
} from '../../modules/user/user.schema'

/**
 * User Routes
 * @param fastify
 * @param opts
 */
const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // View user information
  fastify.get('/', UserOpts, userHandler)

  // Update user fisrt and last name
  fastify.patch<{ Body: InputName }>('/', UpdateNameOpts, updateUserInfoHandler)

  // Update email
  fastify.patch<{ Body: InputEmail }>(
    '/email',
    UpdateEmailOpts,
    updateUserEmailHandler
  )

  // Update password
  fastify.patch<{ Body: InputPassword }>(
    '/change-password',
    UpdatePasswordOpts,
    changePasswordHandler
  )

  // View all users
  fastify.get<{ Querystring: InputPaginate }>(
    '/list',
    ListUserOpts,
    listUserHandler
  )

  // Delete user account
  fastify.delete('/', DeleteUserOpts, deleteUserHandler)
}

export default user
