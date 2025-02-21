import {Component, Input} from '@angular/core';

@Component({
  selector: 'game-card',
  imports: [],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css'
})
export class GameCardComponent {
  @Input() gameId: string | undefined;


}
