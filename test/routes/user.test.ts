import { faker } from '@faker-js/faker'
import { test } from 'tap'
import { UserAuthResponse } from '../../src/modules/user/user.schema'
import { build } from '../helper'

const fakeUser = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}
const newUser = fakeUser()

let access_token = ''

test('registration route is working', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/auth/signup',
    method: 'POST',
    payload: newUser,
  })

  const payload: UserAuthResponse = JSON.parse(res.body)
  t.equal(res.statusCode, 201)

  t.strictSame(payload.firstName, newUser.firstName)
  t.strictSame(payload.lastName, newUser.lastName)
  t.strictSame(payload.email, newUser.email)
  t.notSame(payload, newUser)
})

test('registration route will fail if same user', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/auth/signup',
    method: 'POST',
    payload: newUser,
  })

  t.not(res.statusCode, 201)
})

test('login route is working', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/auth/signin',
    method: 'POST',
    payload: {
      username: newUser.email,
      password: newUser.password,
    },
  })

  const payload = JSON.parse(res.body)
  if (!payload) {
    return
  }

  t.equal(res.statusCode, 200)
  t.ok(payload.hasOwnProperty('access_token'))

  access_token = payload.access_token
})

test('auth route is working', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/auth/',
    method: 'GET',
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  })

  t.equal(res.statusCode, 200)
})

test('edit user name is working', async (t) => {
  const app = await build(t)

  const newName = {
    firstName: 'Mario',
    lastName: 'Mario',
  }

  const res = await app.inject({
    url: '/user/',
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${access_token}`,
    },
    payload: { ...newName },
  })

  const payload: UserAuthResponse = JSON.parse(res.body)

  t.equal(res.statusCode, 200)
  t.equal(payload.firstName, newName.firstName)
  t.equal(payload.lastName, newName.lastName)
})

test('delete user route is working', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/user/',
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${access_token}`,
    },
  })

  t.equal(res.statusCode, 200)
})
