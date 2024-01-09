import { User } from "./User.model";
import { StateComment } from "./comment.model";
import { StateReply } from "./reply.model";

export interface CommentsStoreState {
    currentUser: User,
    comments: { [key: string]: StateComment | StateReply }
}