import { Component, OnInit, ViewChild, ApplicationRef, NgZone, OnDestroy } from '@angular/core';
import { LedgerImportService, StepsEnum } from './import.service';
import { convertNumericIdToAddress } from '@burstjs/util';
import { MatStepper } from '@angular/material';
import { AppService } from 'app/app.service';
import { AccountService } from 'app/setup/account/account.service';
import { getAccountIdFromPublicKey } from '@burstjs/crypto/out';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { I18nService } from 'app/layout/components/i18n/i18n.service';
import {destroy, initialize} from '../../../particles';
import particleConf from '../../../particles/config';

@Component({
  selector: 'app-ledger-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss', '../../login/login.component.scss', '../../login/login-active/login-active.component.scss']
})
export class LedgerImportComponent implements OnInit, OnDestroy {
  
  indexes: Array<number>;
  selectedIndex: number;

  @ViewChild(MatStepper, {static: true}) stepper: MatStepper;

  constructor(
    public ledgerImportService: LedgerImportService,
    private appService: AppService,
    private accountService: AccountService,
    private appRef: ApplicationRef,
    private zone: NgZone,
    private notificationService: NotifierService,
    private router: Router,
    private i18nService: I18nService) { }

  ngOnInit() {

    initialize('login-particles', particleConf);

    this.indexes = Array.from(Array(10).keys());

    this.appService.onIpcMessage('ledger-get-public-key-response', this.handleGetPublicKeyResponse.bind(this));
    this.appService.onIpcMessage('ledger-get-public-key-error', this.handleGetPublicKeyError.bind(this));
    this.appService.onIpcMessage('ledger', this.handleGenericMessage.bind(this));
  }

  handleGetPublicKeyResponse(publicKey) {
    console.log(publicKey);
    const id = getAccountIdFromPublicKey(publicKey);
    const address = convertNumericIdToAddress(id);
    this.ledgerImportService.setPublicKey(publicKey);
    setTimeout(x => {
      this.ledgerImportService.setStep(StepsEnum.Record);
      this.zone.run(() => {});
    }, 10);
  }

  handleGetPublicKeyError(error) {
    this.notificationService.notify('error', this.i18nService.getTranslation('ledger_error_connect'));
  }

  handleGenericMessage(msg) {
    console.log(msg);
  }

  public next(): void {
    this.appService.sendIpcMessage('ledger-get-public-key', this.selectedIndex);
  }

  public reset() {
    this.ledgerImportService.reset();
  }

  public finish() {
    this.accountService.createLedgerAccount(this.ledgerImportService.getPublicKey(), this.selectedIndex).then((success) => {
      this.notificationService.notify('success', this.i18nService.getTranslation('account_added'));
      this.ledgerImportService.reset();
      this.router.navigate(['/']);
    },
    (error) => {
      this.notificationService.notify('error', error.toString());
    });;
  }

  public getAccountIdFromPublicKey(publicKey) {
    return getAccountIdFromPublicKey(publicKey);
  }

  public convertNumericIdToAddress(id) {
    return convertNumericIdToAddress(id);
  }

  ngOnDestroy() {
    destroy();
  }

}
