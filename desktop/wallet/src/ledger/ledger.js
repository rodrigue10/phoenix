/* 
Copyright 2020 Burst Apps Team
Original copyright 2020 IOTA Foundation
*/
const Transport = require('@ledgerhq/hw-transport-node-hid');
const { ipcMain, remote } = require('electron');
const BurstLedgerApp = require('./burst-ledger-app');

const Errors = {
    LEDGER_ZERO_VALUE: 'Cannot send 0 value transfers with a Ledger device.',
    LEDGER_DISCONNECTED: 'Ledger device disconnected.',
    LEDGER_CANCELLED: 'Transaction cancelled on Ledger device.',
    LEDGER_DENIED: 'Ledger transaction denied by user',
    LEDGER_INVALID_INDEX: 'Incorrect Ledger device connected or the Ledger mnemonic has changed.'
}


class Ledger {
    constructor(win) {
        this.connected = false;
        this.listeners = [];
        this.wallet = win.webContents;
        this.subscription = Transport.default.listen({
            next: (e) => {
                this.onMessage(e.type);
            }
        });

        this.init();
    }

    async init() {
        await this.setupConnection();
        this.addListener(async (res) => {
            console.log(res);
            if (res) {
                this.burst = await this.setupConnection();
                this.wallet.send('ledger-connected');
            } else {
                this.wallet.send('ledger-disconnected');
            }
        });
        ipcMain.on('ledger-get-public-key', async (_context, index) => {
            try {
                const publicKey = await this.burst.getPublicKey(index);
                console.log(publicKey);
                this.wallet.send('ledger-get-public-key-response', publicKey);
            }
            catch (e) {
                this.wallet.send('ledger-get-public-key-error', e);
            }
        });
        ipcMain.on('ledger-sign-transaction', async (_context, args) => {
            try {
                const signedTransactionResponse = await this.burst.signTransaction(args[0], args[1]);
                console.log(signedTransactionResponse);
                this.wallet.send('ledger-sign-transaction-response', signedTransactionResponse);
            }
            catch (e) {
                this.wallet.send('ledger-sign-transaction-error', e);
            }
        });
    }

    async setupConnection() {
        if (!this.connected) {
            this.wallet.send('ledger', { awaitConnection: true });
            await this.awaitConnection();
            this.wallet.send('ledger', { awaitConnection: false });
        }

        if (!this.connected) {
            throw new Error('Ledger connection error');
        }

        if (this.burst) {
            this.transport.close();
            this.burst = null;
        }

        await this.awaitApplication();

        return this.burst;
    }

    /**
     * Wait for succesfull Ledger connection callback
     * @returns {promise}
     */
    async awaitConnection() {
        return new Promise((resolve, reject) => {
            const callbackSuccess = (connected) => {
                if (connected) {
                    resolve();
                    this.removeListener(callbackSuccess);
                    ipcMain.removeListener('ledger', callbackAbort);
                }
            };
            this.addListener(callbackSuccess);

            const callbackAbort = (e, message) => {
                if (message && message.abort) {
                    this.removeListener(callbackSuccess);
                    ipcMain.removeListener('ledger', callbackAbort);
                    reject(Errors.LEDGER_CANCELLED);
                }
            };
            ipcMain.on('ledger', callbackAbort);
        });
    }

    async awaitApplication() {
        return new Promise((resolve, reject) => {
            let timeout = null;
            let rejected = false;

            const callback = async () => {
                try {
                    this.transport = await Transport.default.create();
                    this.burst = new BurstLedgerApp(this.transport);

                    this.wallet.send('ledger', { awaitApplication: false });
                    clearTimeout(timeout);

                    console.log('ledger callback');

                    resolve(true);
                } catch (error) {
                    if (this.transport) {
                        this.transport.close();
                    }
                    this.burst = null;
                    console.log('ledger error', error);

                    this.wallet.send('ledger', { awaitApplication: true });

                    if (rejected) {
                        return;
                    }

                    // Retry application await on error 0x6e00 - Phoenix application not open
                    if (error.statusCode === 0x6e00) {
                        timeout = setTimeout(() => callback(), 4000);
                    } else {
                        this.wallet.send('ledger', { awaitApplication: false });
                        reject(error);
                    }
                }
            };

            callback();

            const callbackAbort = (_e, message) => {
                if (message && message.abort) {
                    rejected = true;

                    ipcMain.removeListener('ledger', callbackAbort);

                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    reject(Errors.LEDGER_CANCELLED);
                }
            };

            ipcMain.on('ledger', callbackAbort);
        });
    }

    /**
     * Proxy connection status to event listeners
     * @param {string} status -
     */
    onMessage(status) {
        this.connected = status === 'add';
        this.listeners.forEach((listener) => listener(this.connected));

        if (!this.connected && this.burst) {
            this.transport.close();
            this.burst = null;
        }
    }

    /**
     * Add an connection event listener
     * @param {function} callback - Event callback
     */
    addListener(callback) {
        this.listeners.push(callback);
        if (this.connected) {
            callback(this.connected);
        }
    }

    /**
     * Remove an connection event listener
     * @param {function} callback - Target event callback to remove
     */
    removeListener(callback) {
        this.listeners.forEach((listener, index) => {
            if (callback === listener) {
                this.listeners.splice(index, 1);
            }
        });
    }
}

module.exports = Ledger;