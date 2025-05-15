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
import { SendMoneyComponent } from './PERSONAL/send-money/send-money.component';
import { AnalitycsComponent } from './B2B/analitycs/analitycs.component';
import { WalletComponent } from './B2B/wallet/wallet.component';
import { PaymentsComponent } from './B2B/payments/payments.component';
import { RegisterB2bComponent } from './Shared/Auth/register-b2b/register-b2b.component';
import { IndexB2bComponent } from './B2B/index-b2b/index-b2b.component';
import { DashboardB2bComponent } from './B2B/dashboard-b2b/dashboard-b2b.component';
import { LoginComponent } from './Shared/Auth/login/login.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-form', component: RegisterFormComponent },
  { path: 'verification', component: VerificationComponent },
  { path: 'register-b2b', component: RegisterB2bComponent },
  { path: 'login', component: LoginComponent },



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
      { path: 'send-money', component: SendMoneyComponent },
    ]
  },
  {
    path: 'b2b',
    component: DashboardB2bComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default child route
      { path: 'dashboard', component: IndexB2bComponent },
      { path: 'analytics', component: AnalitycsComponent },
      { path: 'wallet', component: WalletComponent }, // Example child route
      { path: 'payments', component: PaymentsComponent },

    ]
  }
];
