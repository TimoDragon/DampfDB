import { Component } from '@angular/core';
import {GameCardComponent} from "../game-card/game-card.component";
import {Game} from "../models/game.model";
import {GameFacade} from "../facade/game.facade";

@Component({
  selector: 'game-list',
    imports: [
        GameCardComponent
    ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent {
  protected games: Game[] | undefined;

  protected readonly onclick = onclick;

  public constructor(
      private readonly gameFacade: GameFacade,
  ) {
  }

  ngOnInit(): void {
    this.loadGames();
  }

  onClick(): void {

  }

  loadGames(): void {
    this.gameFacade.getGames().subscribe((games: Game[]) => {
      this.games = games;
    });
  }
}
