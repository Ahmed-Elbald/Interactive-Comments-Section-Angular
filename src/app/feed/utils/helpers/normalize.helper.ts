import { v4 as uuid4 } from 'uuid'

import { ThreadStoreState } from '../models/state.model';
import { FetchedInteraction } from '../models/interaction.model';

// Normalize the fetched interactions to store them in the state
// FetchedInteraction => StateInteraction
export function normalize(FetchedInteractions: FetchedInteraction[]) {

    const normalizedState: Pick<ThreadStoreState, "interactions"> = {
        interactions: {}
    }

    recurse(FetchedInteractions);
    return normalizedState;

    function recurse(FetchedInteractions: FetchedInteraction[], parentId?: string) {
        for (const interaction of FetchedInteractions) {

            // Store replies before deleting
            const replies = (interaction.replies || []).map(reply => ({ ...reply, id: uuid4() }));
            // Delete replies before destructuring
            delete (interaction as Partial<FetchedInteraction>).replies;

            // Add new interaction
            const id = parentId ? interaction.id : uuid4();
            normalizedState["interactions"][id] = {
                ...interaction,
                id,
                repliesIds: replies?.map(reply => reply.id),
                parentId: parentId || null
            }

            // Recursion => When there are replies
            if (replies.length !== 0)
                recurse(replies, id)

        }
    }
}