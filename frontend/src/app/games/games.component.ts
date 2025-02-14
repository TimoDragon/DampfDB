import { Component } from '@angular/core';
import {GameComponent} from "../game/game.component";

@Component({
  selector: 'app-games',
    imports: [
        GameComponent
    ],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {

  protected readonly onclick = onclick;
}
