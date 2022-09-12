import { hashPassword } from '../../utils/auth'
import { db } from '../../utils/db'
import { PaginationQuery } from '../generic/pagination.schema'
import { InputName, InputSignUp } from './user.schema'

/** Create operation(s) */
export const createUser = async ({
  firstName,
  lastName,
  email,
  password: newPassword,
}: InputSignUp) => {
  const password = await hashPassword(newPassword)

  return await db.user.create({
    data: { firstName, lastName, email, password },
  })
}

/**
 * Read operations
 */

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  })
}

export const getAuthUser = async (id: string) => {
  return await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  })
}

/**
 * ! User password is expose
 * @return Promise<User | null>
 */
export const getUserAllInfo = async (email: string) => {
  return await db.user.findUnique({
    where: { email },
  })
}

export const getUserInfoById = async (id: string) => {
  return await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  })
}

export const getAllUsers = async (query?: PaginationQuery) => {
  return await db.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
    ...query,
  })
}

export const countAllUsers = async () => {
  return await db.user.count()
}

/**
 * Update operations
 */

export const updateUserInfo = async (
  id: string,
  { firstName, lastName }: InputName
) => {
  return await db.user.update({
    where: { id },
    data: {
      firstName,
      lastName,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const updateUserEmail = async (id: string, email: string) => {
  return await db.user.update({
    where: { id },
    data: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const updatePassword = async (id: string, newPassword: string) => {
  const password = await hashPassword(newPassword)

  return await db.user.update({
    where: { id },
    data: { password },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

/**
 * Delete operations
 */
export const deleteUser = async (id: string) => {
  return await db.user.delete({
    where: { id },
  })
}
