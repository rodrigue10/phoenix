import {Component, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Account, SuggestedFees} from '@burstjs/core';
import {
  convertAddressToNumericId,
  convertNQTStringToNumber,
  convertNumberToNQTString,
  sumNQTStringToNumber,
  convertStringToHexString
} from '@burstjs/util';
import {NgForm} from '@angular/forms';
import {TransactionService} from 'app/main/transactions/transaction.service';
import {NotifierService} from 'angular-notifier';
import {I18nService} from 'app/layout/components/i18n/i18n.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {WarnSendDialogComponent} from '../warn-send-dialog/warn-send-dialog.component';
import {
  Recipient,
  RecipientValidationStatus
} from '../../../layout/components/burst-recipient-input/burst-recipient-input.component';
import {StoreService} from '../../../store/store.service';
import {takeUntil} from 'rxjs/operators';
import {UnsubscribeOnDestroy} from '../../../util/UnsubscribeOnDestroy';
import { ActivatedRoute } from '@angular/router';
import { burstAddressPattern } from 'app/util/burstAddressPattern';
import { LedgerService } from 'app/ledger/ledger.service';
import { AppService } from 'app/app.service';
import { verifySignature, generateSignedTransactionBytes } from '@burstjs/crypto';


interface QRData {
  recipient: Recipient;
  amountNQT: string;
  feeNQT: string;
  immutable: boolean;
  feeSuggestionType: string;
  encrypt: boolean;
  messageIsText: boolean;
  message?: string;
}

const isNotEmpty = (value: string) => value && value.length > 0;

@Component({
  selector: 'app-send-burst-form',
  templateUrl: './send-burst-form.component.html',
  styleUrls: ['./send-burst-form.component.scss']
})
export class SendBurstFormComponent extends UnsubscribeOnDestroy implements OnInit, AfterViewInit {
  @ViewChild('sendBurstForm', { static: true }) public sendBurstForm: NgForm;
  @ViewChild('amount', { static: true }) public amount: string;
  @ViewChild('message', { static: true }) public message: string;
  @ViewChild('fullHash', { static: false }) public fullHash: string;
  @ViewChild('encrypt', { static: true }) public encrypt: boolean;
  @ViewChild('pin', { static: true }) public pin: string;
  @ViewChild('messageIsText', { static: true }) public messageIsText: boolean;

  @Input() account: Account;
  @Input() fees: SuggestedFees;

  advanced = false;
  showMessage = false;
  burstAddressPatternRef = burstAddressPattern;
  deadline = '24';
  immutable: string | boolean = false;

  public recipient = new Recipient();
  public fee: string;
  isSending = false;
  language: string;
  ledgerIsConnected = false;
  ledgerIsSigning = false;

  constructor(
    private warnDialog: MatDialog,
    private transactionService: TransactionService,
    private notifierService: NotifierService,
    private i18nService: I18nService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private ledgerService: LedgerService,
    private appService: AppService
  ) {
    super();
    this.storeService.settings
      .pipe(
        takeUntil(this.unsubscribeAll)
      )
      .subscribe(async ({language}) => {
          this.language = language;
        }
      );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.fee = convertNQTStringToNumber(this.fees['standard'].toString()).toString();
    });
    
    this.ledgerService.connected
    .pipe(
      takeUntil(this.unsubscribeAll)
    )
    .subscribe((connected) => {
      this.ledgerIsConnected = connected;
    });

    this.appService.onIpcMessage('ledger-sign-transaction-response', ({signature, unsignedTransactionBytes}) => {
      console.log(signature);
      try {

        if (!verifySignature(convertStringToHexString(signature), convertStringToHexString(unsignedTransactionBytes), this.account.keys.publicKey)) {
          throw new Error('The signed message could not be verified! Transaction not broadcasted!');
        }

        const signedMessage = generateSignedTransactionBytes(unsignedTransactionBytes, signature);
        this.transactionService.broadcastTransaction(signedMessage);

        this.notifierService.notify('success', this.i18nService.getTranslation('success_send_money'));
        this.sendBurstForm.resetForm();
      } catch (e) {
        console.log(e);
        this.notifierService.notify('error', e || this.i18nService.getTranslation('error_send_money'));
      }

      this.immutable = false;
      this.isSending = false;
      this.ledgerIsSigning = false;
    })
  }

  ngAfterViewInit(): void {
    this.messageIsText = true;

    if (this.route.snapshot.queryParams) {
      setTimeout(() => {
        this.onRecipientChange(new Recipient(this.route.snapshot.queryParams.receiver));
        if (this.route.snapshot.queryParams.feeNQT) {
          this.fee = convertNQTStringToNumber(this.route.snapshot.queryParams.feeNQT).toString();
        }

        if (this.route.snapshot.queryParams.amountNQT) {
          this.amount = convertNQTStringToNumber(this.route.snapshot.queryParams.amountNQT).toString();
        }
        this.message = this.route.snapshot.queryParams.message;
        this.encrypt = this.route.snapshot.queryParams.encrypt;
        this.immutable = this.route.snapshot.queryParams.immutable || this.immutable;
        if (this.immutable === 'false') {
          this.immutable = false;
        }
        if (this.route.snapshot.queryParams.messageIsText === 'false') {
          this.messageIsText = false;
        }
        if (this.route.snapshot.queryParams.feeSuggestionType && this.fees[this.route.snapshot.queryParams.feeSuggestionType]) {
          this.fee = convertNQTStringToNumber(this.fees[this.route.snapshot.queryParams.feeSuggestionType]).toString();
        }
        this.showMessage = !!this.message;
      }, 500); // delay needed for ng5 slider to catch up
    }
  }

  getTotal(): number {
    return parseFloat(this.amount) + parseFloat(this.fee) || 0;
  }

  onSubmit(event): void {
    event.stopImmediatePropagation();

    if (this.recipient.status !== RecipientValidationStatus.VALID) {
      const dialogRef = this.openWarningDialog([this.recipient]);
      dialogRef.afterClosed().subscribe(ok => {
        if (ok) {
          if (this.account.type === 'ledger') {
            this.sendBurstUsingLedger(this.recipient.addressRaw);
          } else {
            this.sendBurst(this.recipient.addressRaw);
          }
        }
      });
    } else {
      if (this.account.type === 'ledger') {
        this.sendBurstUsingLedger(this.recipient.addressRS);
      } else {
        this.sendBurst(this.recipient.addressRS);
      }
    }
  }

  async sendBurst(addressRS: string): Promise<void> {
    try {
      this.isSending = true;
      await this.transactionService.sendBurst({
        amount: convertNumberToNQTString(parseFloat(this.amount)),
        fee: convertNumberToNQTString(parseFloat(this.fee)),
        recipientId: convertAddressToNumericId(addressRS),
        keys: this.account.keys,
        pin: this.pin,
        message: this.message,
        shouldEncryptMessage: this.encrypt,
        messageIsText: this.messageIsText,
        deadline: 1440
      });
      this.notifierService.notify('success', this.i18nService.getTranslation('success_send_money'));
      this.sendBurstForm.resetForm();
    } catch (e) {
      this.notifierService.notify('error', this.i18nService.getTranslation('error_send_money'));
    }
    this.immutable = false;
    this.isSending = false;
  }


  async sendBurstUsingLedger(addressRS: string): Promise<void> {
    try {
      this.isSending = true;
      this.ledgerIsSigning = true;
      await this.transactionService.sendBurstUsingLedger({
        amount: convertNumberToNQTString(parseFloat(this.amount)),
        fee: convertNumberToNQTString(parseFloat(this.fee)),
        recipientId: convertAddressToNumericId(addressRS),
        publicKey: this.account.keys.publicKey,
        ledgerIndex: this.account.ledgerIndex,
        message: this.message,
        shouldEncryptMessage: this.encrypt,
        messageIsText: this.messageIsText,
        deadline: 1440
      });
    } catch (e) {
      this.notifierService.notify('error', this.i18nService.getTranslation('error_send_money'));
      this.immutable = false;
      this.isSending = false;
      this.ledgerIsSigning = false;
    }
  }

  private openWarningDialog(recipients: Array<Recipient>): MatDialogRef<any> {
    return this.warnDialog.open(WarnSendDialogComponent, {
      width: '400px',
      data: recipients
    });
  }

  hasSufficientBalance(): boolean {
    return convertNQTStringToNumber(this.account.balanceNQT) - this.getTotal() >= 0;
  }

  canSubmit(): boolean {
    return isNotEmpty(this.recipient.addressRaw) &&
      isNotEmpty(this.amount) &&
      ((this.account.type === 'ledger' && this.ledgerIsConnected && !this.ledgerIsSigning) 
        || isNotEmpty(this.pin)) &&
      this.hasSufficientBalance();
  }

  onRecipientChange(recipient: Recipient): void {
    this.recipient = recipient;
  }

  onQRUpload(qrData: QRData): void {
    this.amount = convertNQTStringToNumber(qrData.amountNQT).toString();
    this.fee = convertNQTStringToNumber(qrData.feeNQT).toString();
    this.immutable = qrData.immutable;
    this.encrypt = qrData.encrypt;
    this.message = qrData.message;
    this.messageIsText = qrData.messageIsText;
    if (qrData.feeSuggestionType && this.fees[qrData.feeSuggestionType]) {
      this.fee = convertNQTStringToNumber(this.fees[qrData.feeSuggestionType]).toString();
    }
  }

  onSpendAll(): void {
    const maxAmount = sumNQTStringToNumber(this.account.balanceNQT, `-${convertNumberToNQTString(+this.fee || 0)}`);
    this.amount = `${maxAmount}`;
  }
}
