import { ViewComment, StateComment } from "../models/comment.model";
import { ViewReply, StateReply } from "../models/reply.model";
import { CommentsStoreState } from "../models/state.model";

export function denormalize
    (comments: CommentsStoreState["comments"]) {

    const denormalizedState: ViewComment[] = [];

    // Clone state so that we don't mutate it.
    const commentsClone = { ...comments };

    // Denormalize state and reture it.
    for (let id in commentsClone) {
        const comment = commentsClone[id] as StateComment;
        denormalizedState.push({
            ...comment,
            replies: getReplies(comment.repliesIds)
        });
    }
    return denormalizedState


    function getReplies(repliesIds: string[]) {

        const replyTree: ViewReply[] = [];
        if (repliesIds.length === 0) { // If there's no replies
            return replyTree;
        }

        for (let id in commentsClone) { // For every comment/reply
            if (repliesIds.includes(id)) { // If this is a reply to the current comment
                const reply = commentsClone[id] as StateReply;
                replyTree.push({
                    ...reply,
                    replies: getReplies(reply.repliesIds), // Do the same for the reply
                });

                // Delete the reply so that we don't duplicate it.
                delete commentsClone[id];
            }
        }

        return replyTree

    }

}