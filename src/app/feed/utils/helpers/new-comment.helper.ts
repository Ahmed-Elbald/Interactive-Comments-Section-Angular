import { v4 as uuid4 } from 'uuid'

import { User } from "../models/User.model";

export function createNewComment(user: User, content: string) {
    return {
        id: uuid4(),
        content,
        score: 0,
        user,
        createdAt: new Date().toString(),
        repliesIds: []
    }
}