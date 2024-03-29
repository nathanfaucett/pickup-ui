/* tslint:disable */
/* eslint-disable */
/**
 * Pickup API
 * Pickup API
 *
 * The version of the OpenAPI document: 0.1.0
 * Contact: nathanfaucett@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  Health,
  Version,
} from '../models/index';
import {
    HealthFromJSON,
    HealthToJSON,
    VersionFromJSON,
    VersionToJSON,
} from '../models/index';

/**
 * AppApi - interface
 * 
 * @export
 * @interface AppApiInterface
 */
export interface AppApiInterface {
    /**
     * 
     * @summary Get Health Check
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AppApiInterface
     */
    healthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Health>>;

    /**
     * Get Health Check
     */
    healthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Health>;

    /**
     * 
     * @summary Get Version
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AppApiInterface
     */
    versionGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Version>>;

    /**
     * Get Version
     */
    versionGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Version>;

}

/**
 * 
 */
export class AppApi extends runtime.BaseAPI implements AppApiInterface {

    /**
     * Get Health Check
     */
    async healthGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Health>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/health`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => HealthFromJSON(jsonValue));
    }

    /**
     * Get Health Check
     */
    async healthGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Health> {
        const response = await this.healthGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get Version
     */
    async versionGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Version>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/version`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => VersionFromJSON(jsonValue));
    }

    /**
     * Get Version
     */
    async versionGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Version> {
        const response = await this.versionGetRaw(initOverrides);
        return await response.value();
    }

}
