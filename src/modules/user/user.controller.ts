import { FastifyReply, FastifyRequest } from 'fastify'
import { verifyPassword } from '../../utils/auth'
import { InputPaginate } from '../generic/pagination.schema'
import { InputEmail, InputName, InputPassword } from './user.schema'
import {
  countAllUsers,
  deleteUser,
  getAllUsers,
  getAuthUser,
  getUserAllInfo,
  getUserByEmail,
  getUserInfoById,
  updatePassword,
  updateUserEmail,
  updateUserInfo,
} from './user.service'

// Get User Info
export const userHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.unauthorized()
  }
  const user = await getUserInfoById(request.user.id)

  if (!user) {
    return reply.notFound()
  }

  reply.code(200).send(user)
}

// Update user info
export const updateUserInfoHandler = async (
  request: FastifyRequest<{ Body: InputName }>,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.unauthorized()
  }

  const updateUser = await updateUserInfo(request.user.id, request.body)

  if (!updateUser) {
    return reply.internalServerError()
  }

  reply.send({
    ...updateUser,
  })
}

// Update user
export const updateUserEmailHandler = async (
  request: FastifyRequest<{ Body: InputEmail }>,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.unauthorized()
  }

  const isDuplicate = await getUserByEmail(request.body.email)

  if (isDuplicate) {
    return reply.code(422).send({
      message: 'User already exists',
    })
  }

  const user = await updateUserEmail(request.user.id, request.body.email)

  // JWT sign
  const access_token = await reply.jwtSign(user, {
    expiresIn: 604800, // 1 week
  })

  reply.send({
    ...user,
    access_token,
  })
}

export const changePasswordHandler = async (
  request: FastifyRequest<{ Body: InputPassword }>,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.unauthorized()
  }

  const user = await getUserAllInfo(request.user.email)

  if (!user) {
    return reply.notFound()
  }

  const { oldPassword, newPassword } = request.body

  const checkPassword = await verifyPassword({
    candidatePassword: oldPassword,
    userPassword: user.password,
  })

  if (!checkPassword) {
    return reply.unprocessableEntity('Password does not match')
  }

  const updatedPassword = await updatePassword(user.id, newPassword)

  if (!updatedPassword) {
    return reply.internalServerError()
  }

  reply.send({ message: 'Password change' })
}

export const listUserHandler = async (
  request: FastifyRequest<{ Querystring: InputPaginate }>,
  reply: FastifyReply
) => {
  const { page, perpage } = request.query

  let selectedPage = typeof page === 'undefined' ? 0 : Number(page)
  let selectedPerPage = typeof perpage === 'undefined' ? 5 : Number(perpage)

  if (!Number.isInteger(selectedPage) || !Number.isInteger(selectedPerPage)) {
    return reply.unprocessableEntity('Not a integer')
  }

  const take = selectedPerPage === 0 ? 30 : selectedPerPage
  const skip = selectedPage === 0 ? selectedPage : (selectedPage - 1) * take

  const query = {
    take,
    skip,
  }

  const users = await getAllUsers(query)
  const total = await countAllUsers()

  reply.send({
    meta: {
      current_page: selectedPage === 0 ? selectedPage + 1 : selectedPage,
      pages: Math.ceil(total / take),
      perpage: take,
    },
    users,
  })
}

export const deleteUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user
  if (!user) {
    return reply.unauthorized()
  }

  const checkUser = await getAuthUser(user.id)

  if (!checkUser) {
    return reply.notFound()
  }

  await deleteUser(user.id)
    .then(() => {
      // Logout session if using cookies
      request.session.delete()

      reply.code(200).send({ message: 'User deleted' })
    })
    .catch((e) => {
      return reply.internalServerError(JSON.stringify(e))
    })
}
