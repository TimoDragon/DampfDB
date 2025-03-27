import { Component, OnInit, inject, signal, WritableSignal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute and RouterModule
import { GameFacade } from '../facade/game.facade';
import { WorkshopEntry } from '../models/workshop-entry.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators'; // Import switchMap

@Component({
  selector: 'app-workshop-details',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(GameFacade);
  private entrySubscription: Subscription | null = null;

  // Signal to hold the workshop entry details
  workshopEntry: WritableSignal<WorkshopEntry | null> = signal(null);
  errorMessage: WritableSignal<string | null> = signal(null); // For error handling

  ngOnInit(): void {
    this.entrySubscription = this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            this.errorMessage.set(null); // Clear previous errors
            return this.facade.getWorkshopEntryById(+id); // '+' converts string to number
          } else {
            // Handle case where ID is missing - maybe redirect or show error
            this.errorMessage.set('Workshop Entry ID not found in URL.');
            return []; // Return empty observable to prevent further processing
          }
        })
    ).subscribe({
      next: (entry) => {
        this.workshopEntry.set(entry);
        console.log('Workshop entry details loaded:', entry);
      },
      error: (err) => {
        console.error('Error loading workshop entry details:', err);
        this.workshopEntry.set(null);
        this.errorMessage.set('Failed to load workshop entry details. Please try again later.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.entrySubscription) {
      this.entrySubscription.unsubscribe();
    }
  }
}