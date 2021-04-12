/**
 * Copyright (c) 2019 Burst Apps Team
 */

import {Http, HttpError, HttpClientFactory} from '@burstjs/http';
import {BurstServiceSettings} from './burstServiceSettings';
import {AxiosRequestConfig} from 'axios';
import {DefaultApiEndpoint} from '../constants';

// BRS is inconsistent in it's error responses
interface ApiError {
    readonly errorCode?: number;
    readonly errorDescription?: string;
    readonly error?: string;
}

class SettingsImpl implements BurstServiceSettings {
    constructor(settings: BurstServiceSettings) {
        this.apiRootUrl = settings.apiRootUrl || DefaultApiEndpoint;
        this.nodeHost = settings.nodeHost;
        this.httpClient = settings.httpClient || HttpClientFactory.createHttpClient(settings.nodeHost, settings.httpClientOptions);
        this.trustedNodeHosts = settings.trustedNodeHosts || [];
    }

    readonly apiRootUrl: string;
    readonly httpClient: Http;
    readonly nodeHost: string;
    readonly trustedNodeHosts: string[];
}

/**
 * Generic BRS Web Service class.
 *
 * @module core
 */
export class BurstService {
    /**
     * Creates Service instance
     * @param settings The settings for the service
     */
    constructor(settings: BurstServiceSettings) {

        this.settings = new SettingsImpl(settings);
        const {apiRootUrl} = this.settings;
        if (apiRootUrl) {
            this._relPath = apiRootUrl.endsWith('/') ? apiRootUrl.substr(0, apiRootUrl.length - 1) : apiRootUrl;
        }
    }

    public settings: BurstServiceSettings;
    private readonly _relPath: string = DefaultApiEndpoint;

    private static throwAsHttpError(url: string, apiError: ApiError): void {
        const errorCode = apiError.errorCode && ` (Code: ${apiError.errorCode})` || '';
        throw new HttpError(url,
            400,
            `${apiError.errorDescription || apiError.error}${errorCode}`,
            apiError);
    }

    /**
     * Mounts a BRS conform API (V1) endpoint of format `<host>?requestType=getBlock&height=123`
     *
     * @see https://burstwiki.org/wiki/The_Burst_API
     *
     * @param {string} method The method name for `requestType`
     * @param {any} data A JSON object which will be mapped to url params
     * @return {string} The mounted url (without host)
     */
    public toBRSEndpoint(method: string, data: any = {}): string {
        const request = `${this._relPath}?requestType=${method}`;
        const params = Object.keys(data)
            .filter(k => data[k] !== undefined)
            .map(k => `${k}=${encodeURIComponent(data[k])}`)
            .join('&');
        return params ? `${request}&${params}` : request;
    }


    /**
     * Requests a query to BRS
     * @param {string} method The BRS method according https://burstwiki.org/wiki/The_Burst_API
     * @param {any} args A JSON object which will be mapped to url params
     * @param {any | AxiosRequestConfig} options The optional request configuration for the passed Http client
     * @return {Promise<T>} The response data of success
     * @throws HttpError in case of failure
     */
    public async query<T>(method: string, args: any = {}, options?: any | AxiosRequestConfig): Promise<T> {
        const brsUrl = this.toBRSEndpoint(method, args);
        const {response} = await this.settings.httpClient.get(brsUrl, options);
        if (response.errorCode) {
            BurstService.throwAsHttpError(brsUrl, response);
        }
        return response;

    }

    /**
     * Send data to BRS
     * @param {string} method The BRS method according https://burstwiki.org/wiki/The_Burst_API.
     *        Note that there are only a few POST methods
     * @param {any} args A JSON object which will be mapped to url params
     * @param {any} body An object with key value pairs to submit as post body
     * @param  {any | AxiosRequestConfig} options The optional request configuration for the passed Http client
     * @return {Promise<T>} The response data of success
     * @throws HttpError in case of failure
     */
    public async send<T>(method: string, args: any = {}, body: any = {}, options?: any | AxiosRequestConfig): Promise<T> {
        const brsUrl = this.toBRSEndpoint(method, args);
        const {response} = await this.settings.httpClient.post(brsUrl, body, options);
        if (response.errorCode || response.error || response.errorDescription) {
            BurstService.throwAsHttpError(brsUrl, response);
        }
        return response;
    }

    /**
     * Automatically selects the best host, according to its response time, i.e. the fastest node host will be returned (and set as nodeHost internally)
     * @param reconfigure An optional flag to set automatic reconfiguration. Default is `false`
     * Attention: Reconfiguration works only, if you use the default http client. Otherwise, you need to reconfigure manually!
     * @param checkMethod The optional API method to be called. This applies only for GET methods. Default is `getBlockchainStatus`
     * @throws Error If `trustedNodeHosts` is empty
     */
    public async selectBestHost(reconfigure = false, checkMethod = 'getBlockchainStatus'): Promise<string> {
        if (!this.settings.trustedNodeHosts.length) {
            throw new Error('No trustedNodeHosts configured');
        }
        const checkEndpoint = this.toBRSEndpoint(checkMethod);
        const requests = this.settings.trustedNodeHosts.map(host => {
            const absoluteUrl = host.endsWith('/') ? `${host}${checkEndpoint}` : `${host}/${checkEndpoint}`;
            return this.settings.httpClient.get(absoluteUrl)
                .then(() => host)
                .catch(() => null);
        });

        const bestHost = await Promise.race(requests);
        if (reconfigure) {
            this.settings = new SettingsImpl({
                ...this.settings,
                httpClient: HttpClientFactory.createHttpClient(bestHost, this.settings.httpClientOptions),
                nodeHost: bestHost,
            });
        }
        return bestHost;
    }
}
