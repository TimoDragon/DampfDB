import {Component, OnInit, Signal, signal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameFacade} from "../facade/game.facade";
import {Game} from "../models/game.model";

@Component({
  selector: 'app-game-details',
  imports: [],
  templateUrl: './game-details.component.html',
  styleUrl: './game-details.component.css'
})
export class GameDetailsComponent implements OnInit {
  gameId: number | null = null;
  protected game = signal<Game | null>(null);

  constructor(
      private route: ActivatedRoute,
      private gameFacade: GameFacade,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.gameId = Number.parseInt(params.get('gameId') ?? '0');
    });

    if (this.gameId === null) {
      return;
    }

    this.gameFacade.getGame(this.gameId).subscribe(g => {
      this.game.set(g);
    });
  }
}
