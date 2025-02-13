# @signumjs/util

Useful utilities and tools for building Signum blockchain applications

## Installation

`@signumjs/util` can be used with NodeJS or Web. Two formats are available

### Using with NodeJS and/or modern web frameworks

Install using [npm](https://www.npmjs.org/):

```
npm install @signumjs/util
```

or using [yarn](https://yarnpkg.com/):

``` yarn
yarn add @signumjs/util
```

#### Example

```js
import {Amount} from '@signumjs/util'

const value = Amount.fromSigna(1000)
console.log(value.toString())
```

### Using in classic `<script>`

Each package is available as bundled standalone library using UMD.
This way _signumJS_ can be used also within `<script>`-Tags.
This might be useful for Wordpress and/or other PHP applications.

Just import the package using the HTML `<script>` tag.

`<script src='https://cdn.jsdelivr.net/npm/@signumjs/util/dist/signumjs.util.min.js'></script>`

#### Example

```js
const {Amount} = sig$util
const value = Amount.fromSigna(1000)
console.log(value.toString())
```

See more here:

[@signumjs/util Online Documentation](https://burst-apps-team.github.io/phoenix/modules/util.html)

---

## API Reference
## Modules

<dl>
<dt><a href="#module_util">util</a></dt>
<dd><p>Enum to determine the representation format of [BurstValue] string</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>A Value Object to facilitate SIGNA and Planck conversions/calculations.</p>
<p>Note: This class uses a big number representation (ES5 compatible) under the hood, so
number limits and numeric calculations are much more precise than JS number type</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>Utility function to retry async functions.</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>A Value Object to facilitate Burst Timestamp conversions.</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>Symbol/Character for SIGNA unit</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>Symbol/Character for Planck (the smallest possible unit)</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>The smallest possible fee</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd><p>One SIGNA expressed in Planck</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts/Decodes a Base36 encoded string into hex string. UTF-8 is supported
Inverse function [[convertHexStringToBase36String]]</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts/Decodes a Base64 encoded string to string. UTF-8 is supported
Inverse function [[convertStringToBase64String]]</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts byte array to hexadecimal string
Inverse operation of [[convertHexStringToByteArray]]</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts a byte array into string
Inverse function [[convertStringToByteArray]]</p></dd>
<dt><a href="#module_util">util</a> ⇒</dt>
<dd><p>Arbitrary length decimal to hexadecimal conversion</p></dd>
<dt><a href="#module_util">util</a> ⇒</dt>
<dd><p>Toggles the endianess of a hex string.
<code>0xBEEF</code> &gt; <code>0xEFBE</code>
If string is little Endianess it turns into Big Endianess, and vice versa</p>
<blockquote>
<p>This method is mainly used for Smart Contract messaging and data inspection</p>
</blockquote></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts/Decodes a Hex encoded string into Base36 string. UTF-8 is supported
Inverse function [[convertBase36StringToHexString]]</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Converts an hexadecimal string to byte array</p></dd>
<dt><a href="#module_util">util</a> ⇒</dt>
<dd><p>Arbitrary length hexadecimal to decimal conversion
https://stackoverflow.com/questions/21667377/javascript-hexadecimal-string-to-decimal-string</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts a Hexadecimally encoded string into String
Inverse function [[convertStringToHexString]]</p></dd>
<dt><del><a href="#module_util">util</a> ⇒</del></dt>
<dd><p>Helper method to convert a Planck Value (BURST * 1E-8) String to BURST number</p></dd>
<dt><del><a href="#module_util">util</a> ⇒</del></dt>
<dd></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts/Encodes a String into Base64 (URI) encoded string. UTF-8 is supported.
Inverse function [[convertBase64StringToString]]</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Converts a string into byte array
Inverse function [[convertByteArrayToString]]</p></dd>
<dt><a href="#module_util">util</a> ⇒ <code>string</code></dt>
<dd><p>Converts/Encode a String into Hexadecimally encoded
Inverse function [[convertHexStringToString]]</p></dd>
<dt><a href="#module_util">util</a> ⇒</dt>
<dd><p>Creates a deeplink according the <a href="https://github.com/burst-apps-team/CIPs/blob/master/cip-0022.md">CIP22 spec</a></p>
<p><code>signum.[domain]://v1?action=[action]&amp;payload=[encodedData]</code></p>
<p>Deeplinks are a way to call/open applications and do certain actions within it, e.g. Phoenix wallet
can redirect to the &quot;Send Burst&quot; screen a fill out the form according the passed payload.</p></dd>
<dt><a href="#module_util">util</a></dt>
<dd></dd>
<dt><a href="#module_util">util</a> ⇒</dt>
<dd><p>Parses a deeplink according the <a href="https://github.com/burst-apps-team/CIPs/blob/master/cip-0022.md">CIP22 spec</a></p>
<p><code>burst[.domain]://v1?action=[action]&amp;payload=[encodedData]</code></p></dd>
<dt><a href="#module_util">util</a></dt>
<dd></dd>
<dt><del><a href="#module_util">util</a> ⇒</del></dt>
<dd><p>Sums various NQT values and returns in Burst</p></dd>
</dl>

## Constants

<dl>
<dt><a href="#GenesisBlockTime">GenesisBlockTime</a></dt>
<dd><p>Original work Copyright (c) 2020 Burst Apps Team
Modfied work Copyright (c) 2021 Signum Network</p></dd>
<dt><a href="#MandatoryPattern">MandatoryPattern</a></dt>
<dd><p>Original work Copyright (c) 2019 Burst Apps Team</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#encodePayload">encodePayload()</a></dt>
<dd></dd>
</dl>

<a name="module_util"></a>

## util
<p>Enum to determine the representation format of [BurstValue] string</p>

<a name="module_util"></a>

## util
<p>A Value Object to facilitate SIGNA and Planck conversions/calculations.</p>
<p>Note: This class uses a big number representation (ES5 compatible) under the hood, so
number limits and numeric calculations are much more precise than JS number type</p>

<a name="module_util"></a>

## util
<p>Utility function to retry async functions.</p>


| Param | Description |
| --- | --- |
| args | <p>The argument object*</p> |

<a name="module_util"></a>

## util
<p>A Value Object to facilitate Burst Timestamp conversions.</p>

<a name="module_util"></a>

## util
<p>Symbol/Character for SIGNA unit</p>

<a name="module_util"></a>

## util
<p>Symbol/Character for Planck (the smallest possible unit)</p>

<a name="module_util"></a>

## util
<p>The smallest possible fee</p>

<a name="module_util"></a>

## util
<p>One SIGNA expressed in Planck</p>

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts/Decodes a Base36 encoded string into hex string. UTF-8 is supported
Inverse function [[convertHexStringToBase36String]]</p>

**Returns**: <code>string</code> - <p>The hex representation of input string</p>  

| Param | Description |
| --- | --- |
| b36 | <p>The string to be decoded (either URI encoded or not)</p> |

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts/Decodes a Base64 encoded string to string. UTF-8 is supported
Inverse function [[convertStringToBase64String]]</p>

**Returns**: <code>string</code> - <p>The original string</p>  

| Param | Description |
| --- | --- |
| b64 | <p>The string to be decoded (either URI encoded or not)</p> |

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts byte array to hexadecimal string
Inverse operation of [[convertHexStringToByteArray]]</p>

**Returns**: <code>string</code> - <p>A hex string representing the byte array input</p>  

| Param | Description |
| --- | --- |
| bytes | <p>The (unsigned) byte array to be converted</p> |
| uppercase | <p>If <em>true</em>, converts hex string with uppercase characters (Default: false)</p> |

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts a byte array into string
Inverse function [[convertStringToByteArray]]</p>

**Returns**: <code>string</code> - <p>The converted string</p>  

| Param | Description |
| --- | --- |
| byteArray | <p>The byte array to be converted</p> |
| startIndex | <p>The starting index of array to be converted (Default: 0)</p> |
| length | <p>The number of bytes to be considered, <em>iff</em> startIndex is given. If <em>null</em> the byte array's length is considered</p> |

<a name="module_util"></a>

## util ⇒
<p>Arbitrary length decimal to hexadecimal conversion</p>

**Returns**: <p>A hexadecimal string</p>  
**Note:**: Negative numbers are expressed as Two's Complement (https://en.wikipedia.org/wiki/Two%27s_complement)
Credits to AJ ONeal for the two's complements stuff
https://coolaj86.com/articles/convert-decimal-to-hex-with-js-bigints/  

| Param | Description |
| --- | --- |
| decimal | <p>A decimal string or BigNumber representation</p> |
| padding | <p>If set the hex string will be padded to given number, 8 or 16 or more</p> |

<a name="module_util"></a>

## util ⇒
<p>Toggles the endianess of a hex string.
<code>0xBEEF</code> &gt; <code>0xEFBE</code>
If string is little Endianess it turns into Big Endianess, and vice versa</p>
<blockquote>
<p>This method is mainly used for Smart Contract messaging and data inspection</p>
</blockquote>

**Returns**: <p>The converted string as hex string</p>  

| Param | Description |
| --- | --- |
| hexString | <p>The hex string to be converted</p> |

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts/Decodes a Hex encoded string into Base36 string. UTF-8 is supported
Inverse function [[convertBase36StringToHexString]]</p>

**Returns**: <code>string</code> - <p>The hex representation of input string</p>  

| Param | Description |
| --- | --- |
| hex | <p>The string to be decoded (either URI encoded or not)</p> |

<a name="module_util"></a>

## util ⇒ <code>Array.&lt;number&gt;</code>
<p>Converts an hexadecimal string to byte array</p>

**Returns**: <code>Array.&lt;number&gt;</code> - <p>An byte array representing the hexadecimal input</p>  

| Param | Description |
| --- | --- |
| hex | <p>The hexadecimal string to be converted</p> |

<a name="module_util"></a>

## util ⇒
<p>Arbitrary length hexadecimal to decimal conversion
https://stackoverflow.com/questions/21667377/javascript-hexadecimal-string-to-decimal-string</p>

**Returns**: <p>A decimal string</p>  

| Param | Description |
| --- | --- |
| hexStr | <p>A hexadecimal string</p> |

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts a Hexadecimally encoded string into String
Inverse function [[convertStringToHexString]]</p>

**Returns**: <code>string</code> - <p>The string represented by the Hex String</p>  

| Param | Description |
| --- | --- |
| hex | <p>The Hex string to be converted</p> |

<a name="module_util"></a>

## ~~util ⇒~~
***Deprecated***

<p>Helper method to convert a Planck Value (BURST * 1E-8) String to BURST number</p>

**Returns**: <p>A number expressed in Burst (not NQT)</p>  
**Throws**:

- <p>exception if argument is invalid</p>


| Param | Description |
| --- | --- |
| amount | <p>The amount in Planck (aka NQT)</p> |

<a name="module_util"></a>

## ~~util ⇒~~
***Deprecated***

**Returns**: <p>a NQT number string</p>  

| Param | Description |
| --- | --- |
| n | <p>the number</p> |

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts/Encodes a String into Base64 (URI) encoded string. UTF-8 is supported.
Inverse function [[convertBase64StringToString]]</p>

**Returns**: <code>string</code> - <p>The Base64 String representing the input string. The string is already URI encoded, i.e. can be used directly in browsers</p>  

| Param | Description |
| --- | --- |
| str | <p>The string to be converted</p> |
| isURICompatible | <p>Determine whether the resulting string shall be URI compatible, or not. Default is <code>true</code></p> |

<a name="module_util"></a>

## util ⇒ <code>Array.&lt;number&gt;</code>
<p>Converts a string into byte array
Inverse function [[convertByteArrayToString]]</p>

**Returns**: <code>Array.&lt;number&gt;</code> - <p>A byte array representing the string input</p>  

| Param | Description |
| --- | --- |
| str | <p>The string  to be converted</p> |

<a name="module_util"></a>

## util ⇒ <code>string</code>
<p>Converts/Encode a String into Hexadecimally encoded
Inverse function [[convertHexStringToString]]</p>

**Returns**: <code>string</code> - <p>The Hex String representing the input string</p>  

| Param | Description |
| --- | --- |
| str | <p>The Hex string to be converted</p> |

<a name="module_util"></a>

## util ⇒
<p>Creates a deeplink according the <a href="https://github.com/burst-apps-team/CIPs/blob/master/cip-0022.md">CIP22 spec</a></p>
<p><code>signum.[domain]://v1?action=[action]&amp;payload=[encodedData]</code></p>
<p>Deeplinks are a way to call/open applications and do certain actions within it, e.g. Phoenix wallet
can redirect to the &quot;Send Burst&quot; screen a fill out the form according the passed payload.</p>

**Returns**: <p>The Deeplink</p>  
**See**: <p>[[parseDeeplink]] as inverse function</p>  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>CreateDeeplinkArgs</code> | <p>The arguments for the deeplink</p> |

<a name="module_util"></a>

## util
<a name="module_util"></a>

## util ⇒
<p>Parses a deeplink according the <a href="https://github.com/burst-apps-team/CIPs/blob/master/cip-0022.md">CIP22 spec</a></p>
<p><code>burst[.domain]://v1?action=[action]&amp;payload=[encodedData]</code></p>

**Returns**: <p>The parsed deeplink parts.</p>  
**Throws**:

- <p>Error if parsing fails</p>

**See**: <p>[[createDeeplink]] as inverse function</p>  

| Param | Type | Description |
| --- | --- | --- |
| deeplink | <code>string</code> | <p>The deeplink to be parsed</p> |
| encoderFormat |  | <p>Optional encoding format, used to decode the payload. Default: Base64</p> |

<a name="module_util"></a>

## util
<a name="module_util"></a>

## ~~util ⇒~~
***Deprecated***

<p>Sums various NQT values and returns in Burst</p>

**Returns**: <p>The sum of all amounts in BURST</p>  

| Param | Description |
| --- | --- |
| nqts | <p>Variable amount list with NQT string</p> |

<a name="GenesisBlockTime"></a>

## GenesisBlockTime
<p>Original work Copyright (c) 2020 Burst Apps Team
Modfied work Copyright (c) 2021 Signum Network</p>

**Kind**: global constant  
<a name="MandatoryPattern"></a>

## MandatoryPattern
<p>Original work Copyright (c) 2019 Burst Apps Team</p>

**Kind**: global constant  
<a name="encodePayload"></a>

## encodePayload()
**Kind**: global function  
**Internal**:   
