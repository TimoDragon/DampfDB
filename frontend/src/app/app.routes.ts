import { Routes } from '@angular/router';
import {GameListComponent} from "./game-list/game-list.component";
import {GameDetailsComponent} from "./game-details/game-details.component";
import {HomeComponent} from "./home/home.component";
import {DeveloperListComponent} from "./developer-list/developer-list.component";
import {WorkshopListComponent} from "./workshop-list/workshop-list.component";
import {WorkshopDetailsComponent} from "./workshop-details/workshop-details.component";

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'games', component: GameListComponent},
    { path: 'game/:gameId', component: GameDetailsComponent },
    { path: 'developers', component: DeveloperListComponent },
    { path: 'workshop', component: WorkshopListComponent },
    { path: 'workshop/:id', component: WorkshopDetailsComponent },
];