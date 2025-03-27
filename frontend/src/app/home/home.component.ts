import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core'; // Import signal and WritableSignal
import { GameFacade } from '../facade/game.facade';
import { Game } from '../models/game.model';
import { CommonModule } from '@angular/common';
import { GameCardComponent } from '../game-card/game-card.component';
import { Subscription } from 'rxjs';
import {RouterLink} from "@angular/router"; // Import Subscription

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GameCardComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private readonly gameFacade = inject(GameFacade);
  private gameSubscription: Subscription | null = null; // To manage subscription

  // Use a local signal within the component to store the random game
  randomGame: WritableSignal<Game | null> = signal(null);

  ngOnInit(): void {
    // Subscribe to the observable returned by the facade
    this.gameSubscription = this.gameFacade.getRandomGame().subscribe({
      next: (game) => {
        this.randomGame.set(game); // Update the local signal
        console.log('Random game loaded:', game);
      },
      error: (err) => {
        console.error('Error loading random game:', err);
        this.randomGame.set(null); // Clear on error
      }
    });
  }

  // Best practice: Unsubscribe when the component is destroyed
  ngOnDestroy(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }
}