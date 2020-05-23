import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum StepsEnum {
    Index,
    Record
}

@Injectable()
export class LedgerImportService {

    step: number;
    publicKey: string;

    constructor() { }

    public previousStep(): void {
        this.step = Math.max(0, this.step - 1);
    }

    public setStep(step: StepsEnum): void {
        this.step = step;
    }

    public getStep(): StepsEnum {
        return this.step;
    }

    public setPublicKey(publicKey: string): void {
        this.publicKey = publicKey;
    }

    public getPublicKey(): string {
        return this.publicKey;
    }

    public reset(): void {
        this.step = StepsEnum.Index;
        this.publicKey = undefined;
    }
}
