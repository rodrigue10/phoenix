const Struct = require('struct');
const getErrorMessage = require('./error');

/**
 * burst API
 * @module hw-app-burst
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
const TIMEOUT_CMD_PUBKEY = 10000;
const TIMEOUT_CMD_NON_USER_INTERACTION = 10000;
const TIMEOUT_CMD_USER_INTERACTION = 150000;

const HASH_LENGTH = 32;

/**
 * Class for the interaction with the Ledger Burst application.
 *
 * @example
 * import BurstLedgerApp from "hw-app-burst";
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

    console.log(response);
    const pubkeyOutStruct = new Struct().word8('code').chars('address', HASH_LENGTH, 'hex');
    pubkeyOutStruct.setBuffer(response);

    return pubkeyOutStruct.fields.address;
  }








  static _validatePath(path) {
    let pathArray;
    try {
      pathArray = bippath.fromString(path).toPathArray();
    } catch (e) {
      throw new Error('"path" invalid: ' + e.message);
    }

    if (!pathArray || pathArray.length < 2 || pathArray.length > 5) {
      throw new Error('"path" invalid: ' + 'Invalid path length');
    }

    return pathArray;
  }

  _assertInitialized() {
    if (!this.security) {
      throw new Error('seed not yet initialized');
    }
  }

  async _setSeed() {
    const setSeedInStruct = new Struct();
    this._addSeedFields(setSeedInStruct);

    setSeedInStruct.allocate();
    this._initSeedFields(setSeedInStruct);

    await this._sendCommand(
      Commands.INS_SET_SEED,
      0,
      0,
      setSeedInStruct.buffer(),
      TIMEOUT_CMD_NON_USER_INTERACTION
    );
  }

  _createPubkeyInputLegacy(index) {
    let struct = new Struct();
    struct = struct.word32Ule('index');

    struct.allocate();

    struct.fields.index = index;

    return struct;
  }

  _createPubkeyInput(index) {
    let struct = new Struct();
    struct = struct.word32Ule('index');
    struct.allocate();
    struct.fields.index = index;
    return struct;
  }

  static _validateRemainder(transfers, inputs, remainder) {
    const balance = inputs.reduce((a, i) => a + i.balance, 0);
    const payment = transfers.reduce((a, t) => a + t.value, 0);

    if (balance < payment) {
      throw new Error('insufficient balance');
    } else if (balance > payment) {
      if (!remainder) {
        throw new Error('"remainder" is required');
      }
      return {
        address: remainder.address,
        value: balance - payment,
        keyIndex: remainder.keyIndex
      };
    }

    // ignore the remainder, if there is no change
    return undefined;
  }

  async _sign(index, sliceLength) {
    const signInStruct = new Struct().word32Ule('index');

    signInStruct.allocate();
    signInStruct.fields.index = index;

    const response = await this._sendCommand(
      Commands.INS_SIGN,
      0,
      0,
      signInStruct.buffer(),
      TIMEOUT_CMD_PUBKEY
    );

    const signOutStruct = new Struct()
      .chars('signature', sliceLength)
      .word8Sle('fragmentsRemaining');
    signOutStruct.setBuffer(response);

    return {
      signature: signOutStruct.fields.signature,
      fragmentsRemaining: signOutStruct.fields.fragmentsRemaining
    };
  }

  _createTxInputLegacy(address, address_idx, value, tag, tx_idx, tx_len, time) {
    let struct = new Struct();
    struct = struct
      .chars('address', HASH_LENGTH)
      .word32Ule('address_idx')
      .word64Sle('value')
      .chars('tag', TAG_LENGTH)
      .word32Ule('tx_idx')
      .word32Ule('tx_len')
      .word32Ule('time');

    struct.allocate();

    const fields = struct.fields;
    fields.address = address;
    fields.address_idx = address_idx;
    fields.value = value;
    fields.tag = tag;
    fields.tx_idx = tx_idx;
    fields.tx_len = tx_len;
    fields.time = time;

    return struct;
  }

  _createTxInput(address, address_idx, value, tag, tx_idx, tx_len, time) {
    let struct = new Struct();
    if (tx_idx == 0) {
      this._addSeedFields(struct);
    }
    struct = struct
      .chars('address', HASH_LENGTH)
      .word32Ule('address_idx')
      .word64Sle('value')
      .chars('tag', TAG_LENGTH)
      .word32Ule('tx_idx')
      .word32Ule('tx_len')
      .word32Ule('time');

    struct.allocate();

    if (tx_idx == 0) {
      this._initSeedFields(struct);
    }
    const fields = struct.fields;
    fields.address = address;
    fields.address_idx = address_idx;
    fields.value = value;
    fields.tag = tag;
    fields.tx_idx = tx_idx;
    fields.tx_len = tx_len;
    fields.time = time;

    return struct;
  }

  async _transaction(address, address_idx, value, tag, tx_idx, tx_len, time) {
    const txInStruct = this._createTxInput(
      address,
      address_idx,
      value,
      tag,
      tx_idx,
      tx_len,
      time
    );

    let timeout = TIMEOUT_CMD_NON_USER_INTERACTION;
    if (tx_idx == tx_len) {
      timeout = TIMEOUT_CMD_USER_INTERACTION;
    }

    const response = await this._sendCommand(
      Commands.INS_TX,
      tx_idx == 0 ? 0x00 : 0x80,
      0,
      txInStruct.buffer(),
      timeout
    );

    const txOutStruct = new Struct()
      .word8('finalized')
      .chars('bundleHash', HASH_LENGTH);
    txOutStruct.setBuffer(response);

    return {
      finalized: txOutStruct.fields.finalized,
      bundleHash: txOutStruct.fields.bundleHash
    };
  }

  async _getSignatureFragments(index, sliceLength) {
    const numSlices = (this.security * 2187) / sliceLength;

    let signature = '';
    for (let i = 1; i <= numSlices; i++) {
      const result = await this._sign(index, sliceLength);
      signature += result.signature;

      // the remaining fragments must match the num slices
      if ((i === numSlices) != (result.fragmentsRemaining === 0)) {
        throw new Error('wrong signture length');
      }
    }

    // split into segments of exactly 2187 chars
    return signature.match(/.{2187}/g);
  }

  async _addSignatureFragmentsToBundle(bundle) {
    for (let i = 0; i < bundle.bundle.length; i++) {
      const tx = bundle.bundle[i];

      // only sign inputs
      if (tx.value >= 0) {
        continue;
      }

      // compute all the signature fragments for that input transaction
      const signatureFragments = await this._getSignatureFragments(
        i,
        SIGNATURE_FRAGMENT_SLICE_LENGTH
      );
      // and set the first fragment
      tx.signatureMessageFragment = signatureFragments.shift();

      // set the signature fragments for all successive meta transactions
      const address = tx.address;
      for (let j = 1; j < this.security; j++) {
        if (++i >= bundle.bundle.length) {
          return;
        }

        const tx = bundle.bundle[i];
        if (tx.address === address && tx.value === 0) {
          tx.signatureMessageFragment = signatureFragments.shift();
        }
      }
    }
  }

  async _signBundle(bundle, addressKeyIndices) {
    let finalized = false;
    let bundleHash = '';
    for (const tx of bundle.bundle) {
      const keyIndex = addressKeyIndices[tx.address]
        ? addressKeyIndices[tx.address]
        : 0;
      const result = await this._transaction(
        tx.address,
        keyIndex,
        tx.value,
        tx.obsoleteTag,
        tx.currentIndex,
        tx.lastIndex,
        tx.timestamp
      );
      finalized = result.finalized;
      bundleHash = result.bundleHash;
    }

    if (!finalized) {
      throw new Error('bundle not finalized');
    }
    if (bundleHash !== bundle.bundle[0].bundle) {
      throw new Error('wrong bundle hash');
    }

    await this._addSignatureFragmentsToBundle(bundle);
  }

  _hasDuplicateAddresses(transfers, inputs, remainder) {
    const set = new Set();
    transfers.forEach(t => set.add(t.address));
    inputs.forEach(i => set.add(i.address));
    if (remainder && set.has(remainder.address)) {
      return true;
    }

    return set.length === transfers.length + inputs.length;
  }


  _createAppConfigOutputLegacy() {
    const struct = new Struct()
      .word8('app_flags')
      .word8('app_version_major')
      .word8('app_version_minor')
      .word8('app_version_patch');

    return struct;
  }

  _createAppConfigOutput() {
    const struct = new Struct()
      .word8('app_version_major')
      .word8('app_version_minor')
      .word8('app_version_patch')
      .word8('app_max_bundle_size')
      .word8('app_flags');

    return struct;
  }

  async _getAppConfig() {
    const response = await this._sendCommand(
      Commands.INS_GET_APP_CONFIG,
      0,
      0,
      undefined,
      TIMEOUT_CMD_NON_USER_INTERACTION
    );

    let getAppConfigOutStruct = this._createAppConfigOutput();
    // check whether the response matches the struct plus 2 bytes status code
    if (response.length < getAppConfigOutStruct.length() + 2) {
      getAppConfigOutStruct = this._createAppConfigOutputLegacy();
    }
    getAppConfigOutStruct.setBuffer(response);

    const fields = getAppConfigOutStruct.fields;
    return {
      app_max_bundle_size: fields.app_max_bundle_size,
      app_flags: fields.app_flags,
      app_version:
        fields.app_version_major +
        '.' +
        fields.app_version_minor +
        '.' +
        fields.app_version_patch
    };
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