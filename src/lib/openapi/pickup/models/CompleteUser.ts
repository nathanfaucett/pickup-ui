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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface CompleteUser
 */
export interface CompleteUser {
    /**
     * 
     * @type {Date}
     * @memberof CompleteUser
     */
    birthdate: Date;
    /**
     * 
     * @type {string}
     * @memberof CompleteUser
     */
    sex: string;
    /**
     * 
     * @type {boolean}
     * @memberof CompleteUser
     */
    terms_of_service_acknowledge: boolean;
    /**
     * 
     * @type {string}
     * @memberof CompleteUser
     */
    username: string;
}

/**
 * Check if a given object implements the CompleteUser interface.
 */
export function instanceOfCompleteUser(value: object): boolean {
    if (!('birthdate' in value)) return false;
    if (!('sex' in value)) return false;
    if (!('terms_of_service_acknowledge' in value)) return false;
    if (!('username' in value)) return false;
    return true;
}

export function CompleteUserFromJSON(json: any): CompleteUser {
    return CompleteUserFromJSONTyped(json, false);
}

export function CompleteUserFromJSONTyped(json: any, ignoreDiscriminator: boolean): CompleteUser {
    if (json == null) {
        return json;
    }
    return {
        
        'birthdate': (new Date(json['birthdate'])),
        'sex': json['sex'],
        'terms_of_service_acknowledge': json['terms_of_service_acknowledge'],
        'username': json['username'],
    };
}

export function CompleteUserToJSON(value?: CompleteUser | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'birthdate': ((value['birthdate']).toISOString()),
        'sex': value['sex'],
        'terms_of_service_acknowledge': value['terms_of_service_acknowledge'],
        'username': value['username'],
    };
}

