import { User } from "./User.model"
import { FetchedReply, ViewReply } from "./reply.model"

export type BaseComment = {
    id: string
    content: string
    createdAt: string
    score: number
    user: User
}

export type StateComment = BaseComment & {
    repliesIds: string[]
}

export type FetchedComment = BaseComment & {
    replies: FetchedReply[]
}

export type ViewComment = StateComment & { replies: ViewReply[] };