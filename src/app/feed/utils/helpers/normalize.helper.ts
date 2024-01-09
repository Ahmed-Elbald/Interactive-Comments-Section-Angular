import { v4 as uuid4 } from 'uuid'

import { FetchedComment } from "../models/comment.model";
import { FetchedReply } from '../models/reply.model';
import { CommentsStoreState } from '../models/state.model';

export function normalize(fetchedComments: (FetchedComment | FetchedReply)[]) {

    const normalizedState: Pick<CommentsStoreState, "comments"> = {
        comments: {}
    }

    recurse(fetchedComments);
    return normalizedState;

    function recurse(fetchedComments: (FetchedComment | FetchedReply)[], parentId?: string) {
        for (let comment of fetchedComments) {

            // Store replies before deleting
            const replies = (comment.replies || []).map(reply => ({ ...reply, id: uuid4() }));
            // Delete replies before destructuring
            delete (comment as Partial<FetchedComment>).replies;

            // Add new comment/reply
            const id = parentId ? comment.id : uuid4();
            normalizedState["comments"][id] = {
                ...comment,
                id,
                repliesIds: replies?.map(reply => reply.id),
                parentId
            }

            // Recursion => When there are replies
            if (replies.length !== 0)
                recurse(replies, id)

        }
    }
}