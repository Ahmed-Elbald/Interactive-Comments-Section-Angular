import { Injectable, inject } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, map, of, switchMap, tap } from "rxjs";

import { ThreadStoreState } from "../utils/models/state.model";
import { denormalize } from "../utils/helpers/denormalize.helper";
import { ThreadService } from "./thread.service";
import { normalize } from "../utils/helpers/normalize.helper";
import { InteractionFormData } from "../utils/models/interaction-form.model";
import { extractContent } from "../utils/helpers/extract-content.helper";
import { createNewInteraction } from "./../utils/helpers/new-interaction.helper";
import { VotingData } from "../utils/models/voting-data.model";
import { MessagesService } from "../../shared/services/messages.service";
import { LOCAL_STORAGE } from "../../app.config";
import { DialogService } from "../../shared/services/dialog.service";
import { DeleteInteractionDialogComponent } from "../ui/delete-interaction-dialog/delete-interaction-dialog.component";
import { StateInteraction } from "../utils/models/interaction.model";

// INITIAL STATE
const initialState: ThreadStoreState = {
    currentUser: {
        image: {
            png: "./assets/images/avatars/image-juliusomo.png",
            webp: "./assets/images/avatars/image-juliusomo.webp"
        },
        username: "juliusomo",
        dirtyInteractions: {}
    },

    interactions: {}
}

// STORE
@Injectable()
export class ThreadStore extends ComponentStore<ThreadStoreState> {

    // Deps 
    private threadService = inject(ThreadService);
    private messagesService = inject(MessagesService);
    private dialog = inject(DialogService);
    private storage = inject(LOCAL_STORAGE);

    // Initializing
    constructor() { super(initialState) }

    // Selectors
    private readonly normalizedInteractions$ = this.select(state => state.interactions);

    public readonly currentUser$ = this.select(state => state.currentUser);
    public readonly interactions$ = this.select(
        this.normalizedInteractions$,
        denormalize
    );

    // Updaters
    private readonly addComment = this.updater((state, comment: StateInteraction) => ({
        ...state,
        interactions: { ...state.interactions, [comment.id]: comment }
    }));

    private readonly addReply = this.updater(
        (state, { reply, parentId }: { reply: StateInteraction, parentId: string }) => {
            const parent = state.interactions[parentId];
            return {
                ...state,
                interactions: {
                    ...state.interactions,
                    [reply.id]: { ...reply, replyingTo: parent.user.username }, // Add the reply
                    [parentId]: { ...parent, repliesIds: [...parent.repliesIds, reply.id] } // Add the reply ID to its parent's replies list
                }
            }
        });

    private readonly updateInteraction = this.updater((state, { content, id }: { content: string, id: string }) => ({
        ...state,
        interactions: { ...state.interactions, [id]: { ...state.interactions[id], content } }
    }));

    private readonly changeScore = this.updater((state, { value, id }: Omit<Required<VotingData>, "isCurrentUser">) => ({
        ...state,
        interactions: { ...state.interactions, [id]: { ...state.interactions[id], score: state.interactions[id].score + value } }
    }));

    private readonly deleteInteraction = this.updater((state, id: string) => ({
        ...state,
        interactions: (({ [id]: _, ...rest }) => rest)(state.interactions)
    }));

    // Effects
    public readonly init = this.effect($ => $.pipe(
        switchMap(() => {
            const localState = this.storage.getItem("interactiveCommentsSection");

            if (localState) // If there's a previous state
                return of(JSON.parse(localState))

            return this.threadService.getInteractions().pipe(
                map(fetchedInteractions => normalize(fetchedInteractions))
            )
        }),
        tap((state: Partial<ThreadStoreState>) => {
            this.patchState({ ...state }); // Update state
            this.save(this.state$) // Trigger state effects to save to local storage
        })
    ));

    public readonly save = this.effect((state$: Observable<ThreadStoreState>) => state$.pipe(
        tap(state => {
            this.storage.setItem("interactiveCommentsSection", JSON.stringify(state))
        })
    ));

    public readonly submitInteractionForm = this.effect((interaction$: Observable<InteractionFormData>) => interaction$.pipe(
        tap(({ content, interactionId, parentInteractionId: parentId }) => {
            content = extractContent(content);
            if (!interactionId) { // If it's a new interaction

                const newInteraction = createNewInteraction(
                    this.get(state => state.currentUser),
                    content
                )

                if (parentId) // If it's a reply
                    this.addReply({ reply: { ...newInteraction, parentId: parentId }, parentId })
                else // If it's a comment
                    this.addComment(newInteraction)

            } else { // If it's an older interaction being edited
                this.updateInteraction({ content, id: interactionId! })
                this.messagesService.addMsg(`your ${parentId ? 'reply' : 'comment'} was updated`, "success")
            }
        })
    ));

    public readonly changeScoreHanlder = this.effect((votingData$: Observable<Required<VotingData>>) => votingData$.pipe(
        tap(({ value, id, isCurrentUser }) => {

            if (isCurrentUser) { // If the interaction belongs to the current user
                this.messagesService.addMsg(`Sorry, you can not ${value === 1 ? 'upvote' : 'downvote'} your ${this.interactionType(id)}`);
                return;
            }

            const targetedInteractionScore = this.get(state => state.currentUser).dirtyInteractions![id];
            if (targetedInteractionScore) { // If the user has upvoted/downvoted the interaction before
                if ((value === 1 && targetedInteractionScore === 1) || (value === -1 && targetedInteractionScore === -1)) {
                    this.messagesService.addMsg(`You have already ${value === 1 ? 'upvoted' : 'downvoted'} this ${this.interactionType(id)}`)
                    return;
                }
            }

            // Change the score and add the interaction to the current user's 'dirtyInteractions'
            this.changeScore({ value, id });
            this.patchState((state) => ({
                currentUser: {
                    ...state.currentUser,
                    dirtyInteractions: { ...state.currentUser.dirtyInteractions, [id]: (targetedInteractionScore ? targetedInteractionScore + value : value) as 1 | -1 | 0 }
                }
            }))

        })
    ));

    public readonly deleteInteractionHandler = this.effect((interactionId$: Observable<string>) => interactionId$.pipe(
        switchMap((id) => this.dialog.open(
            DeleteInteractionDialogComponent, { interactionType: this.interactionType(id) }
        ).pipe(
            map((response) => [response, id] as const)
        )),
        tap(([response, id]) => {
            if (response) { // If the user has confirmed deleting
                this.messagesService.addMsg(`Your ${this.interactionType(id)} was deleted`, "success")
                this.deleteInteraction(id);
            }

            // Close the dialog
            this.dialog.close();
        })
    ))

    // Helpers
    private interactionType = (id: string): "comment" | "reply" => {
        return this.get(state => state.interactions[id].parentId) ? "reply" : "comment"
    }

}