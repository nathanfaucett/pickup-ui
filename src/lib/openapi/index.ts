import {
	Configuration,
	type ConfigurationParameters,
  PlaceApi,
  AppApi,
  Oauth2Api,
  UserApi,
} from './pickup';
import { PUBLIC_PICKUP_API_URL } from '$env/static/public';

export const publicPickupApiURL =
	typeof __DEV_PICKUP_API_URL__ !== 'undefined'
		? __DEV_PICKUP_API_URL__
		: PUBLIC_PICKUP_API_URL;

let authToken: string | undefined;

export const defaultConfiguration: ConfigurationParameters = {
	middleware: [
		{
			pre: async (context) => ({
				...context,
				init: {
					...context.init,
					mode: 'cors'
				}
			})
		}
	],
	apiKey(name: string) {
		switch (name) {
			default:
				return `Bearer ${authToken as string}`;
		}
	},
	credentials: 'same-origin'
};

export const defaultPickupConfiguration: ConfigurationParameters = {
	...defaultConfiguration,
	basePath: publicPickupApiURL
};
export const pickupConfiguration = new Configuration(defaultPickupConfiguration);

export const placeApi = new PlaceApi(pickupConfiguration);
export const appApi = new AppApi(pickupConfiguration);
export const oauth2Api = new Oauth2Api(pickupConfiguration);
export const userApi = new UserApi(pickupConfiguration);

export function setAuthToken(newAuthToken?: string) {
	authToken = newAuthToken;
}
export function getAuthToken() {
	return authToken;
}
