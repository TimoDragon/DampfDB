import {Observable} from "rxjs";
import {GameGateway} from "../gateway/game.gateway";
import {Injectable} from "@angular/core";
import {Game} from "../models/game.model";

@Injectable({
    providedIn: 'root'
})
export class GameFacade {
    public constructor(
        private gameGateway: GameGateway,
    ) {
    }

    public getGame(gameId: number): Observable<Game> {
        return this.gameGateway.getGame(gameId);
    }
}