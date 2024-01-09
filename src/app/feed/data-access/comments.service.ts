import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { FetchedComment } from "../utils/models/comment.model";

@Injectable({
    providedIn: "root"
})
export class CommentsService {

    // Deps
    private http = inject(HttpClient);

    getComments() {
        return this.http.get<FetchedComment[]>("./assets/data/comments.json")
    }

}