import { BaseComment } from "./comment.model"

type BaseReply = BaseComment & {
    replyingTo: string
}

export type StateReply = BaseReply & {
    parentId: string;
    repliesIds: string[]
}
export type ViewReply = StateReply & {
    replies: ViewReply[]
}

export type FetchedReply = BaseReply & { replies?: FetchedReply[] };