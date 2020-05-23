import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedgerService } from './ledger.service';
import { LedgerImportComponent } from './import/import.component';
import { MatStepperModule, MatSelectModule, MatIconModule, MatInputModule, MatButtonModule } from '@angular/material';
import { I18nModule } from 'app/layout/components/i18n/i18n.module';
import { TranslateModule } from '@ngx-translate/core';
import { routing } from './ledger.routing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierModule } from 'angular-notifier';
import { SetupModule } from 'app/setup/setup.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { LedgerImportService } from './import/import.service';



@NgModule({
  declarations: [LedgerImportComponent],
  imports: [
    CommonModule,
    I18nModule,
    
    TranslateModule,
    routing,
    FormsModule,
    MatInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    NotifierModule,
    
    // Material
    MatStepperModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,

    SetupModule,
    FuseSharedModule,
  ],
  providers: [
    LedgerService, LedgerImportService
  ]
})
export class LedgerModule { }
