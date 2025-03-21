import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Game} from "../models/game.model";

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
}