import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LedgerService {

  public connected: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor() { }

  public setConnected(connected) {
    console.log(connected);
    this.connected.next(connected);
  }
}
