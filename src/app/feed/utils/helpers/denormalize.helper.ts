import { StateInteraction, ViewInteraction } from "../models/interaction.model";
import { ThreadStoreState } from "../models/state.model";

// Denormalize state interactions to display them
// StateInteraction => ViewInteraction
export function denormalize
    (interactions: ThreadStoreState["interactions"]) {

    const denormalizedState: ViewInteraction[] = [];

    // Clone state so that we don't mutate it.
    const interactionsClone = { ...interactions };

    // Denormalize state and reture it.
    for (const id in interactionsClone) {
        const interaction = interactionsClone[id] as StateInteraction;
        denormalizedState.push({
            ...interaction,
            replies: getReplies(interaction.repliesIds)
        });
    }
    return denormalizedState


    function getReplies(repliesIds: string[]) {

        const replyTree: ViewInteraction[] = [];
        if (repliesIds.length === 0) { // If there's no replies
            return replyTree;
        }

        for (const id in interactionsClone) { // For every interaction
            if (repliesIds.includes(id)) { // If this is a reply to the current comment
                const reply = interactionsClone[id] as StateInteraction;
                replyTree.push({
                    ...reply,
                    replies: getReplies(reply.repliesIds), // Do the same for the reply
                });

                // Delete the reply so that we don't duplicate it.
                delete interactionsClone[id];
            }
        }

        return replyTree

    }

}