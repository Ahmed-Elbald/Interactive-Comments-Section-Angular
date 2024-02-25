
export interface CommentAuthorImage {
    png: string
    webp: string
}

export interface User {
    image: CommentAuthorImage
    username: string
    dirtyInteractions: { [key: string]: 1 | 0 | -1 } // Comments/Replies that the user has interacted with (by up/downvoting)
}