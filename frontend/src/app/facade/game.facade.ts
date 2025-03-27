import {Observable} from "rxjs";
import {GameGateway} from "../gateway/game.gateway";
import {Injectable} from "@angular/core";
import {Developer, Game} from "../models/game.model";
import {WorkshopEntry} from "../models/workshop-entry.model";

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

    public getGames(): Observable<Game[]> {
        return this.gameGateway.getGames();
    }

    public getRandomGame(): Observable<Game> {
        return this.gameGateway.getRandomGame();
    }

    public getDevelopers(): Observable<Developer[]> {
        return this.gameGateway.getDevelopers();
    }

    public getWorkshopEntries(): Observable<WorkshopEntry[]> {
        return this.gameGateway.getWorkshopEntries();
    }

    public getWorkshopEntryById(id: number): Observable<WorkshopEntry> {
        return this.gameGateway.getWorkshopEntryById(id);
    }
}