import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { FetchedInteraction } from "../utils/models/interaction.model";

@Injectable({
    providedIn: "root"
})
export class ThreadService {

    // Deps
    private http = inject(HttpClient);

    // Public methods
    getInteractions() {
        return this.http.get<FetchedInteraction[]>("./assets/data/interactions.json")
    }

}