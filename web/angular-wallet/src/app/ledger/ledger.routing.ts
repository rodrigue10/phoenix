import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LedgerImportComponent } from './import/import.component';

const routes: Routes = [
  { path: 'ledger/import', component: LedgerImportComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
