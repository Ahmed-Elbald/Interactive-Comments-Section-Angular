import { User } from "./User.model";
import { StateInteraction } from "./interaction.model";

export interface ThreadStoreState {
    currentUser: User,
    interactions: { [key: string]: StateInteraction }
}