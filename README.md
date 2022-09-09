# Node.js Demo API

Node.js API demo using Fastify framework. Written in TypeScript.

Tech Stack

- Fastify
- Prisma - for database ORM
- Sinclair/Typebox - for schema validation
- FastifyPassport - Passport.js plugin, for user authentication
- FastifySwagger - Fastify plugin for serving a Swagger UI

---

### Getting Started

Install the dependencies

```bash
# on the the CLI, run
yarn

# or remove the yarn.lock file then install using pnpm or npm

# Recommended
pnpm install

# NPM
npm install
```

After cloning the project, copy the .env.example to .env

```bash
# .env

# Fastify passport
FASTIFY_PORT=3001

# Prisma database connection
DATABASE_URL='mysql://dbUser:dbPassword@dbHost/dbName'

# a secret with minimum length of 32 characters
# https://github.com/fastify/fastify-secure-session#using-a-secret
SESSION_SECRET=averylongphrasebiggerthanthirtytwochars

# a secret with minimum length 16 characters
SESSION_SALT=YXwr7%F5ZY!9env8

JWT_SECRET_KEY=secret
```

Setup the prisma client

```bash
# Generate the client
npx prisma generate

# Sync the database (not recommended in the production)
npx prisma db push
```

Running the project locally

```bash
npm run dev
```