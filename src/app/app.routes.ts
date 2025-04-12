import { Routes } from '@angular/router';
import { HomeComponent } from './Shared/home/home.component';
import { RegisterComponent } from './Shared/Auth/register/register.component';
import { RegisterFormComponent } from './Shared/Auth/register-form/register-form.component';
import { VerificationComponent } from './Shared/Auth/verification/verification.component';
import { DashboardComponent } from './PERSONAL/dashboard/dashboard.component';
import { IndexComponent } from './PERSONAL/index/index.component';
import { MyCardsComponent } from './PERSONAL/my-cards/my-cards.component';
import { NotificationsComponent } from './PERSONAL/notifications/notifications.component';
import { ActivityComponent } from './PERSONAL/activity/activity.component';
import { AddCardComponent } from './PERSONAL/add-card/add-card.component';
import { SettingsComponent } from './PERSONAL/settings/settings.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register-form', component: RegisterFormComponent },
    { path: 'verification', component: VerificationComponent },
    
    {
        path: 'personal',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default child route
            { path: 'dashboard', component: IndexComponent },
            { path: 'my-cards', component: MyCardsComponent },
            { path: 'add-card', component: AddCardComponent }, // Example child route
            { path: 'activity', component: ActivityComponent },
            { path: 'notifications', component: NotificationsComponent },
            { path: 'settings', component: SettingsComponent },



        ]
    }
];
