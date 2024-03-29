import jwt from 'jsonwebtoken';
import {env} from '$env/dynamic/private';

export type JWT<T> = string & { _type: T };

export function sign<T>(claims: T) {
	return new Promise<JWT<T>>((resolve, reject) =>
		jwt.sign(claims as object, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN }, (error, encoded) => {
			if (error) {
				reject(error);
			} else {
				resolve(encoded as JWT<T>);
			}
		})
	);
}

export function verify<T>(token: JWT<T>) {
	return new Promise<T>((resolve, reject) =>
		jwt.verify(token, env.JWT_SECRET, function (error, decoded) {
			if (error) {
				reject(error);
			} else {
				resolve(decoded as T);
			}
		})
	);
}
