const Struct = require('struct');
const getErrorMessage = require('./error');

/**
 * burst API
 * @module burst-ledger-app
 */

const CLA = 0x80;
const Commands = {
  // specific timeouts:
  INS_GET_VERSION: 0x01, // TIMEOUT_CMD_NON_USER_INTERACTION
  INS_AUTH_SIGN_TXN: 0x03, // TIMEOUT_CMD_PUBKEY
  INS_ENCRYPT_DECRYPT_MSG: 0x04, // TIMEOUT_CMD_PUBKEY
  INS_SHOW_ADDRESS: 0x05, // TIMEOUT_CMD_NON_USER_INTERACTION
  INS_GET_PUBLIC_KEY: 0x06 // TIMEOUT_CMD_NON_USER_INTERACTION
};

const P1_SIGN_INIT = 0x01;
const P1_SIGN_CONTINUE = 0x02;
const P1_SIGN_AUTHORIZE = 0x10;
const P1_SIGN_FINISH = 0x03;

const TIMEOUT_CMD_PUBKEY = 10000;
const TIMEOUT_CMD_NON_USER_INTERACTION = 10000;
const TIMEOUT_CMD_USER_INTERACTION = 150000;

const HASH_LENGTH = 32;

/**
 * Class for the interaction with the Ledger Burst application.
 *
 * @example
 * import BurstLedgerApp from "burst-ledger-app";
 * const burst = new BurstLedgerApp(transport);
 */
class BurstLedgerApp {
  constructor(transport) {
    transport.decorateAppAPIMethods(
      this,
      [
        'getVersion',
        'authSignTransaction',
        'encryptDecryptMessage',
        'showAddress',
        'getPublicKey'
      ],
      'BURST'
    );

    this.transport = transport;
    this.config = undefined;
    this.security = 0;
    this.pathArray = undefined;
  }

  /**
   * @return the version of the app instaled on the Ledger device
   * @throws Exception
   */
  async getVersion() {
    return this._sendCommand(Commands.INS_GET_VERSION, 0, 0, undefined, TIMEOUT_CMD_NON_USER_INTERACTION)
  }


	/**
	 * @param index
	 * @return the public key for the given account index
	 * @throws Exception
	 */
  async getPublicKey(index) {

    const pubkeyInStruct = this._createPubkeyInput(index);

    const response = await this._sendCommand(
      Commands.INS_GET_PUBLIC_KEY,
      0,
      0,
      pubkeyInStruct.buffer(),
      TIMEOUT_CMD_PUBKEY
    );

    const pubkeyOutStruct = new Struct().word8('code').chars('address', HASH_LENGTH, 'hex');
    
    pubkeyOutStruct.setBuffer(response);

    return pubkeyOutStruct.fields.address;
  }

	/**
   * Signs an unsigned transaction with the account at index.
   * Todo: support large payloads (>250B)
   * @param index - the ledger index of the account to sign with
	 * @param unsignedTransactionBytes - unsigned transaction bytes from server
	 * @return signed transaction bytes
	 * @throws Exception
	 */
  async signTransaction(index, unsignedTransactionBytes) {

    const byteLen = unsignedTransactionBytes.length / 2;
    let pos = 0;

    while (byteLen > pos) {

      const { signOutStruct, delta } = await this.initateAndContinueExchange(byteLen, pos, unsignedTransactionBytes);

      if (signOutStruct.fields.res1 != 0 && signOutStruct.fields.res1 != 15) return null;

      pos += delta;

    }

    const signOutStruct = await this.finishExchange(index);

    return {
      success: signOutStruct.fields.success,
      signature: signOutStruct.fields.signature,
      unsignedTransactionBytes: unsignedTransactionBytes
    };

  }

  async initateAndContinueExchange(byteLen, pos, unsignedTransactionBytes) {

    const delta = Math.round(Math.min(250, byteLen - pos));

    let P1 = pos == 0 ? P1_SIGN_INIT : P1_SIGN_CONTINUE;

    if (byteLen == pos + delta) P1 |= P1_SIGN_AUTHORIZE;

    const signInStruct = new Struct().chars('utx', delta, 'hex');
    signInStruct.allocate();

    const utx = unsignedTransactionBytes.slice();
    
    // todo: figure this out to support large messages
    // signInStruct.set('utx', utx.slice(pos, 
    //   (delta*2 > unsignedTransactionBytes.length) ? 
    // unsignedTransactionBytes.length-1 : delta * 2));

    signInStruct.set('utx', utx);

    const response = await this._sendCommand(Commands.INS_AUTH_SIGN_TXN, P1, 0, signInStruct.buffer(), TIMEOUT_CMD_PUBKEY);

    const signOutStruct = new Struct().word8('res1').word8('res2').word8('res3');
    signOutStruct.setBuffer(response);

    return { signOutStruct, delta };
  }

  async finishExchange(index) {
    const finishStruct = this._createPubkeyInput(index);
    console.log(finishStruct.buffer());
    const response = await this._sendCommand(Commands.INS_AUTH_SIGN_TXN, P1_SIGN_FINISH, 0, finishStruct.buffer(), TIMEOUT_CMD_USER_INTERACTION);
    const signOutStruct = new Struct()
      .word8('success')
      .chars('signature', 64, 'hex');
    signOutStruct.setBuffer(response);
    return signOutStruct;
  }

  _createPubkeyInput(index) {
    let struct = new Struct();
    struct = struct.word8('zero1').word8('zero2').word8('index');
    struct.allocate();
    struct.fields.index = index;
    return struct;
  }

  async _reset(partial = false) {
    await this._sendCommand(
      Commands.INS_RESET,
      partial ? 1 : 0,
      0,
      undefined,
      TIMEOUT_CMD_NON_USER_INTERACTION
    );
  }

  async _sendCommand(ins, p1, p2, data, timeout) {
    const transport = this.transport;
    try {
      transport.setExchangeTimeout(timeout);
      return await transport.send(CLA, ins, p1, p2, data);
    } catch (error) {
      // update the message, if status code is present
      if (error.statusCode) {
        error.message = getErrorMessage(error.statusCode) || error.message;
      }
      throw error;
    }
  }
}


module.exports = BurstLedgerApp;