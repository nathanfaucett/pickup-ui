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
  CompleteUser,
  UpdateUser,
  User,
} from '../models/index';
import {
    CompleteUserFromJSON,
    CompleteUserToJSON,
    UpdateUserFromJSON,
    UpdateUserToJSON,
    UserFromJSON,
    UserToJSON,
} from '../models/index';

export interface UserCompletePatchRequest {
    complete: CompleteUser;
}

export interface UserPatchRequest {
    update: UpdateUser;
}

/**
 * UserApi - interface
 * 
 * @export
 * @interface UserApiInterface
 */
export interface UserApiInterface {
    /**
     * 
     * @summary complete current user
     * @param {CompleteUser} complete complete user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApiInterface
     */
    userCompletePatchRaw(requestParameters: UserCompletePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>>;

    /**
     * complete current user
     */
    userCompletePatch(complete: CompleteUser, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User>;

    /**
     * 
     * @summary Get current user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApiInterface
     */
    userGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>>;

    /**
     * Get current user
     */
    userGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User>;

    /**
     * 
     * @summary update current user
     * @param {UpdateUser} update complete user
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApiInterface
     */
    userPatchRaw(requestParameters: UserPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>>;

    /**
     * update current user
     */
    userPatch(update: UpdateUser, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User>;

}

/**
 * 
 */
export class UserApi extends runtime.BaseAPI implements UserApiInterface {

    /**
     * complete current user
     */
    async userCompletePatchRaw(requestParameters: UserCompletePatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters['complete'] == null) {
            throw new runtime.RequiredError(
                'complete',
                'Required parameter "complete" was null or undefined when calling userCompletePatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // Authorization authentication
        }

        const response = await this.request({
            path: `/user/complete`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: CompleteUserToJSON(requestParameters['complete']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * complete current user
     */
    async userCompletePatch(complete: CompleteUser, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userCompletePatchRaw({ complete: complete }, initOverrides);
        return await response.value();
    }

    /**
     * Get current user
     */
    async userGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // Authorization authentication
        }

        const response = await this.request({
            path: `/user`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * Get current user
     */
    async userGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * update current user
     */
    async userPatchRaw(requestParameters: UserPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters['update'] == null) {
            throw new runtime.RequiredError(
                'update',
                'Required parameter "update" was null or undefined when calling userPatch().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // Authorization authentication
        }

        const response = await this.request({
            path: `/user`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateUserToJSON(requestParameters['update']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * update current user
     */
    async userPatch(update: UpdateUser, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userPatchRaw({ update: update }, initOverrides);
        return await response.value();
    }

}