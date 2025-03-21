import {Component, Input, numberAttribute} from '@angular/core';
import {Game} from "../models/game.model";

@Component({
  selector: 'game-card',
  imports: [],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent {
  @Input() game: Game | undefined;

  onClick(): void {
    window.location.href=`/game/${this.game?.gameID}`
  }


}
