import { Static, Type } from '@sinclair/typebox'

export const PaginateRequestSchema = Type.Strict(
  Type.Object({
    page: Type.Optional(Type.Number()),
    perpage: Type.Optional(Type.Number()),
  })
)

export const MetaSchema = Type.Object({
  current_page: Type.Number(),
  pages: Type.Number(),
  perpage: Type.Number(),
})

export const PaginateSchema = Type.Object({
  skip: Type.Number(),
  take: Type.Number(),
})

/**
 * Types / validation
 */
export type InputPaginate = Static<typeof PaginateRequestSchema>
export type PaginationQuery = Static<typeof PaginateSchema>
