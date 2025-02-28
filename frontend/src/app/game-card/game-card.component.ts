import {Component, Input, numberAttribute} from '@angular/core';

@Component({
  selector: 'game-card',
  imports: [],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent {
  @Input({transform: numberAttribute}) gameId: number | undefined;

  onClick(): void {
    window.location.href=`/game/${this.gameId}`
  }
}
