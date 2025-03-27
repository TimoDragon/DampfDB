import { Component, OnInit, inject, signal, WritableSignal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameFacade } from '../facade/game.facade'; // Using GameFacade
import { WorkshopEntry } from '../models/workshop-entry.model';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink

@Component({
  selector: 'app-workshop-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.css']
})
export class WorkshopListComponent implements OnInit, OnDestroy {
  private readonly facade = inject(GameFacade); // Inject the facade
  private entrySubscription: Subscription | null = null;

  // Signal to hold the list of workshop entries
  workshopEntries: WritableSignal<WorkshopEntry[]> = signal([]);

  ngOnInit(): void {
    this.entrySubscription = this.facade.getWorkshopEntries().subscribe({
      next: (entries) => {
        this.workshopEntries.set(entries); // Update the signal
        console.log('Workshop entries loaded:', entries);
      },
      error: (err) => {
        console.error('Error loading workshop entries:', err);
        this.workshopEntries.set([]); // Clear on error
      }
    });
  }

  ngOnDestroy(): void {
    if (this.entrySubscription) {
      this.entrySubscription.unsubscribe(); // Clean up subscription
    }
  }
}