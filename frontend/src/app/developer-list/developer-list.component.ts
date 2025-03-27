import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameFacade } from '../facade/game.facade'; // Using GameFacade for simplicity
import { Subscription } from 'rxjs';
import {Developer} from "../models/game.model";

@Component({
  selector: 'app-developer-list',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for ngFor, etc.
  templateUrl: './developer-list.component.html',
  styleUrls: ['./developer-list.component.css']
})
export class DeveloperListComponent implements OnInit {
  private readonly facade = inject(GameFacade); // Inject the facade
  private devSubscription: Subscription | null = null;

  // Signal to hold the list of developers
  developers: WritableSignal<Developer[]> = signal([]);

  ngOnInit(): void {
    this.devSubscription = this.facade.getDevelopers().subscribe({
      next: (devs) => {
        this.developers.set(devs); // Update the signal with fetched data
        console.log('Developers loaded:', devs);
      },
      error: (err) => {
        console.error('Error loading developers:', err);
        this.developers.set([]); // Clear on error
      }
    });
  }

  ngOnDestroy(): void {
    if (this.devSubscription) {
      this.devSubscription.unsubscribe(); // Clean up subscription
    }
  }
}