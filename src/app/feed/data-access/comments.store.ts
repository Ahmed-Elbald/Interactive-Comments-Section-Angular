import { Injectable, inject } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, map, of, switchMap, tap } from "rxjs";

import { CommentsStoreState } from "../utils/models/state.model";
import { StateComment } from "../utils/models/comment.model";
import { denormalize } from "../utils/helpers/denormalize.helper";
import { CommentsService } from "./comments.service";
import { normalize } from "../utils/helpers/normalize.helper";
import { StateReply } from "../utils/models/reply.model";
import { CommentFormData } from "../utils/models/comment-form.model";
import { extractContent } from "../utils/helpers/extract-content.helper";
import { createNewComment } from "../utils/helpers/new-comment.helper";
import { VotingData } from "../utils/models/voting-data.model";
import { MessagesService } from "../../shared/services/messages.service";
import { LOCAL_STORAGE } from "../../app.config";
import { DialogService } from "../../shared/services/dialog.service";
import { DeleteCommentDialogComponent } from "../ui/delete-comment-dialog/delete-comment-dialog.component";

const initialState: CommentsStoreState = {
    currentUser: {
        image: {
            png: "./assets/images/avatars/image-juliusomo.png",
            webp: "./assets/images/avatars/image-juliusomo.webp"
        },
        username: "juliusomo",
        dirtyComments: {}
    },

    comments: {}
}

@Injectable()
export class CommentsStore extends ComponentStore<CommentsStoreState> {

    // Deps 
    private commentsService = inject(CommentsService);
    private messagesService = inject(MessagesService);
    private dialog = inject(DialogService);
    private storage = inject(LOCAL_STORAGE);

    constructor() { super(initialState) }

    // Selectors
    private readonly normalizedComments$ = this.select(state => state.comments);

    public readonly currentUser$ = this.select(state => state.currentUser);
    public readonly comments$ = this.select(
        this.normalizedComments$,
        denormalize
    );

    // Updaters
    private readonly addComment = this.updater((state, comment: StateComment) => ({
        ...state,
        comments: { ...state.comments, [comment.id]: comment }
    }));

    private readonly addReply = this.updater(
        (state, { reply, parentId }: { reply: Omit<StateReply, "replyingTo">, parentId: string }) => {
            const parent = state.comments[parentId];
            return {
                ...state,
                comments: {
                    ...state.comments,
                    [reply.id]: { ...reply, replyingTo: parent.user.username },
                    [parentId]: { ...parent, repliesIds: [...parent.repliesIds, reply.id] }
                }
            }
        });

    private readonly updateComment = this.updater((state, { content, id }: { content: string, id: string }) => ({
        ...state,
        comments: { ...state.comments, [id]: { ...state.comments[id], content } }
    }));

    private readonly changeScore = this.updater((state, { value, id }: Omit<Required<VotingData>, "isCurrentUser">) => ({
        ...state,
        comments: { ...state.comments, [id]: { ...state.comments[id], score: state.comments[id].score + value } }
    }));

    private readonly deleteComment = this.updater((state, id: string) => ({
        ...state,
        comments: (({ [id]: _, ...rest }) => rest)(state.comments)
    }));

    // Effects
    public readonly init = this.effect($ => $.pipe(
        switchMap(() => {
            const localState = this.storage.getItem("interactiveCommentsSection");

            if (localState) // If there's a previous state
                return of(JSON.parse(localState))

            return this.commentsService.getComments().pipe(
                map(fetchedComments => normalize(fetchedComments))
            )
        }),
        tap((state: Partial<CommentsStoreState>) => {
            this.patchState({ ...state }); // Update state
            this.save(this.state$) // Trigger state effects to save to local storage
        })
    ));

    public readonly save = this.effect((state$: Observable<CommentsStoreState>) => state$.pipe(
        tap(state => {
            this.storage.setItem("interactiveCommentsSection", JSON.stringify(state))
        })
    ));

    public readonly submitCommentForm = this.effect((comment$: Observable<CommentFormData>) => comment$.pipe(
        tap(({ content, commentId, parentCommentId: parentId }) => {
            content = extractContent(content);
            if (!commentId) { // If it's a new comment/reply

                const baseComment = createNewComment(
                    this.get(state => state.currentUser),
                    content
                )

                if (parentId) // If it's a reply
                    this.addReply({ reply: { ...baseComment, parentId: parentId }, parentId })
                else // If it's a comment
                    this.addComment(baseComment)

            } else { // If it's an older comment/reply being edited
                this.updateComment({ content, id: commentId! })
                this.messagesService.addMsg("your comment was updated", "success")
            }
        })
    ));

    public readonly changeScoreHanlder = this.effect((votingData$: Observable<Required<VotingData>>) => votingData$.pipe(
        tap(({ value, id, isCurrentUser }) => {

            if (isCurrentUser) { // If the comment/reply belongs to the current user
                this.messagesService.addMsg(`Sorry, you can not ${value === 1 ? 'upvote' : 'downvote'} your comment`);
                return;
            }

            const targetedCommentScore = this.get(state => state.currentUser).dirtyComments![id];
            if (targetedCommentScore) { // If the user has upvoted/downvoted the comment/reply before
                if ((value === 1 && targetedCommentScore === 1) || (value === -1 && targetedCommentScore === -1)) {
                    this.messagesService.addMsg(`You have already ${value === 1 ? 'upvoted' : 'downvoted'} this comment`)
                    return;
                }
            }

            // Change the score and add the comment/reply to the current user's 'dirtyComments'
            this.changeScore({ value, id });
            this.patchState((state) => ({
                currentUser: {
                    ...state.currentUser,
                    dirtyComments: { ...state.currentUser.dirtyComments, [id]: (targetedCommentScore ? targetedCommentScore + value : value) as 1 | -1 | 0 }
                }
            }))

        })
    ));

    public readonly deleteCommentHandler = this.effect((commentId$: Observable<string>) => commentId$.pipe(
        switchMap((id) => this.dialog.open(DeleteCommentDialogComponent).pipe(
            map((response) => [response, id] as const)
        )),
        tap(([response, id]) => {
            if (response) { // If the user has confirmed deleting
                this.deleteComment(id);
                this.messagesService.addMsg("Your comment was deleted", "success")
            }

            // Close the dialog
            this.dialog.close();
        })
    ))

}