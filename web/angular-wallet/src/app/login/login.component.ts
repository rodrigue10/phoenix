import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {destroy, initialize} from '../../particles';
import particleConf from '../../particles/config';
import { LedgerService } from 'app/ledger/ledger.service';
import { UnsubscribeOnDestroy } from 'app/util/UnsubscribeOnDestroy';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends UnsubscribeOnDestroy implements OnInit, OnDestroy {

  version = environment.version;
  ledgerIsConnected = false;

  constructor(private ledgerService: LedgerService) {
    super();
  }

  ngOnInit(): void {

    this.ledgerService.connected
    .pipe(
      takeUntil(this.unsubscribeAll)
    )
    .subscribe((connected) => {
      console.log(connected);
      this.ledgerIsConnected = connected;
    });
    initialize('login-particles', particleConf);
  }

  ngOnDestroy(): void {
    destroy();
  }
}
