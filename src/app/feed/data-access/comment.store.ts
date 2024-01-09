import { ComponentStore } from "@ngrx/component-store";
import { ViewComment } from "../utils/models/comment.model";
import { ViewReply } from "../utils/models/reply.model";
import { User } from "../utils/models/User.model";

export interface CommentStoreState {
    comment: ViewComment | ViewReply | null
    currentUser: User | null
    isCurrentUser: boolean

    formState: "opened" | "closed"

    formDefaultValue: string
}

export class CommentStore extends ComponentStore<CommentStoreState> {


    // Selectors
    private readonly comment$ = this.select(state => state.comment);
    private readonly currentUser$ = this.select(state => state.currentUser);

    private readonly formState$ = this.select(state => state.formState);
    private readonly formDefaultValue$ = this.select(state => state.formDefaultValue);

    private readonly isCurrentUser$ = this.select(
        this.currentUser$,
        (currentUser) => currentUser !== null
    )
    private readonly isAReplay$ = this.select(
        this.comment$,
        (comment => comment && 'replyingTo' in comment)
    );
    private readonly votingState$ = this.select(
        this.comment$,
        this.currentUser$,
        (comment, currentUser) => currentUser ? currentUser["dirtyComments"][comment!.id] : null
    );

    public vm$ = this.select(this.state)

    // Updaters
    public readonly toggleFormState = this.updater(state => ({ ...state, formState: state.formState === "opened" ? "closed" : "opened" }));

    public readonly setComment = this.updater((state, comment: ViewComment | ViewReply) => ({ ...state, comment }));
    public readonly setCurrentUser = this.updater((state, currentUser: User) => ({ ...state, currentUser }));
    public readonly setFormDefaultValue = this.updater((state, formDefaultValue: string) => ({ ...state, formDefaultValue }));


}