import {Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {SuggestedFees, Account, AddressPrefix} from '@signumjs/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from 'app/setup/account/account.service';
import {NotifierService} from 'angular-notifier';
import {I18nService} from 'app/layout/components/i18n/i18n.service';
import {burstAddressPattern} from 'app/util/burstAddressPattern';
import {isKeyDecryptionError} from '../../../util/exceptions/isKeyDecryptionError';
import {NetworkService} from '../../../network/network.service';

@Component({
  selector: 'app-add-alias',
  templateUrl: './add-alias.component.html',
  styleUrls: ['./add-alias.component.scss']
})
export class AddAliasComponent implements OnInit {
  @ViewChild('setAliasForm', {static: false}) public setAliasForm: NgForm;
  @ViewChild('alias', {static: false}) public alias: string;
  @ViewChild('description', {static: false}) public description: string;
  @ViewChild('fullHash', {static: false}) public fullHash: string;
  @ViewChild('pin', {static: false}) public pin: string;
  @ViewChild('uri', {static: false}) public uri: string;
  @ViewChild('accountAliasURI', {static: true}) public accountAliasURI: string;
  @Output() submit = new EventEmitter<any>();

  public feeNQT: string;
  advanced = false;
  showMessage = false;
  burstAddressPatternRef = burstAddressPattern;
  type = 'uri';
  account: Account;
  deadline = '24';
  fees: SuggestedFees;
  addressPrefix: AddressPrefix.MainNet | AddressPrefix.TestNet;

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private notifierService: NotifierService,
              private networkService: NetworkService,
              private i18nService: I18nService) {
  }

  ngOnInit(): void {
    this.account = this.route.snapshot.data.account as Account;
    this.fees = this.route.snapshot.data.suggestedFees as SuggestedFees;

    this.addressPrefix = this.networkService.isMainNet() ? AddressPrefix.MainNet : AddressPrefix.TestNet;
    this.accountAliasURI = this.account.accountRS;
  }

  async onSubmit(event): Promise<void> {
    event.stopImmediatePropagation();
    try {
      await this.accountService.setAlias({
        aliasName: this.alias,
        aliasURI: this.getAliasURI(),
        feeNQT: this.feeNQT,
        deadline: parseFloat(this.deadline) * 60,
        pin: this.pin,
        keys: this.account.keys,
      });
      this.notifierService.notify('success', this.i18nService.getTranslation('success_alias_register'));
      this.setAliasForm.resetForm();
    } catch (e) {
      if (isKeyDecryptionError(e)) {
        this.notifierService.notify('error', this.i18nService.getTranslation('wrong_pin'));
      } else {
        this.notifierService.notify('error', this.i18nService.getTranslation('error_unknown'));
      }
    }
  }

  private getAliasURI(): string {
    switch (this.type) {
      case 'acct':
        return `${this.type}:${this.accountAliasURI.toLowerCase()}@burst`;
      default:
        return this.uri;
    }
  }
}
