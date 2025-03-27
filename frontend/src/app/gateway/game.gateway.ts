import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Developer, Game} from "../models/game.model";
import {WorkshopEntry} from "../models/workshop-entry.model";

@Injectable({
    providedIn: 'root'
})
export class GameGateway {
    private baseUrl = "http://localhost:5000/api"

    public constructor(
        private http: HttpClient,
    ) {
    }

    public getGame(gameId: number): Observable<Game> {
        return this.http.get<Game>(`${this.baseUrl}/game/${gameId}`)
    }

    public getGames(): Observable<Game[]> {
        return this.http.get<Game[]>(`${this.baseUrl}/games`);
    }

    public getRandomGame(): Observable<Game> {
        return this.http.get<Game>(`${this.baseUrl}/games/random`);
    }

    public getDevelopers(): Observable<Developer[]> {
        return this.http.get<Developer[]>(`${this.baseUrl}/developers`);
    }

    public getWorkshopEntries(): Observable<WorkshopEntry[]> {
        // Add cache buster if you want fresh data on each load
        const cacheBuster = new Date().getTime();
        return this.http.get<WorkshopEntry[]>(`${this.baseUrl}/workshop?cb=${cacheBuster}`);
    }

    public getWorkshopEntryById(id: number): Observable<WorkshopEntry> {
        return this.http.get<WorkshopEntry>(`${this.baseUrl}/workshop/${id}`);
    }
}