import { Component } from '@angular/core';
import {GameCardComponent} from "../game-card/game-card.component";

@Component({
  selector: 'game-list',
    imports: [
        GameCardComponent
    ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent {

  protected readonly onclick = onclick;

  onClick(): void {

  }
}
