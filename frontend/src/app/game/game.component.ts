import {Component, Input, input, OnInit, signal} from '@angular/core';

@Component({
  selector: 'app-game',
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  @Input() gameId: string | undefined;

  protected onClick(): void {

  }
}
