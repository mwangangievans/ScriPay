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
import { MerchantsComponent } from './B2B/merchants/merchants.component';
import { OnboardingComponent } from './B2B/onboarding/onboarding.component';
import { UserManagementComponent } from './B2B/user-management/user-management.component';
import { ConfigurationComponent } from './B2B/configuration/configuration.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Register' } },
  { path: 'register-form', component: RegisterFormComponent, data: { title: 'Register Form' } },
  { path: 'verification', component: VerificationComponent, data: { title: 'Verification' } },
  { path: 'register-b2b', component: RegisterB2bComponent, data: { title: 'B2B Registration' } },
  { path: 'Onboarding', component: OnboardingComponent, data: { title: 'Onboarding' } },
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },


  {
    path: 'personal',
    component: DashboardComponent,
    data: { title: 'Personal Dashboard' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: IndexComponent, data: { title: 'Dashboard' } },
      { path: 'my-cards', component: MyCardsComponent, data: { title: 'My Cards' } },
      { path: 'add-card', component: AddCardComponent, data: { title: 'Add Card' } },
      { path: 'activity', component: ActivityComponent, data: { title: 'Activity' } },
      { path: 'notifications', component: NotificationsComponent, data: { title: 'Notifications' } },
      { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
      { path: 'send-money', component: SendMoneyComponent, data: { title: 'Send Money' } },
    ]
  },
  {
    path: 'b2b',
    component: DashboardB2bComponent,
    data: { title: 'Dashboard' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: IndexComponent, data: { title: 'Dashboard' } },
      // { path: 'analytics', component: AnalitycsComponent, data: { title: 'Analytics' } },
      { path: 'analytics', component: ActivityComponent, data: { title: 'Analytics' } },
      { path: 'wallet', component: WalletComponent, data: { title: 'Wallet' } },
      { path: 'payments', component: PaymentsComponent, data: { title: 'Payments' } },
      { path: 'merchants', component: MerchantsComponent, data: { title: 'Merchants' } },
      { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
      { path: 'configurations', component: ConfigurationComponent, data: { title: 'Payment Configuration' } },
      { path: 'user-management', component: UserManagementComponent, data: { title: 'User management' } },


    ]
  }
];
