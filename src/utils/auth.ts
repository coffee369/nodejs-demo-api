import * as bcrypt from 'bcryptjs'

/**
 *
 * @param {string} password
 * @returns password - new hash password
 */
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10)
}

/**
 * @param {object} CandidateAndUserPassword
 */
export const verifyPassword = async ({
  candidatePassword,
  userPassword,
}: {
  candidatePassword: string
  userPassword: string
}) => {
  return await bcrypt.compare(candidatePassword, userPassword)
}

/**
 * Opts for routes
 */
export const sessionOpts = {
  authInfo: false,
  session: false,
}
