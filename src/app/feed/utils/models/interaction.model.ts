import { User } from "./User.model"

export type InteractionBase = {
  id: string
  content: string
  createdAt: string
  score: number
  user: User
  replyingTo: string | null
}

export type StateInteraction = InteractionBase & {
  repliesIds: string[]
  parentId: string | null
}

export type FetchedInteraction = InteractionBase & {
  replies: FetchedInteraction[]
}

export type ViewInteraction = StateInteraction & { replies: ViewInteraction[] };