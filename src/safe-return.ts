/**
 * @module
 * This module contains functions to search the database.
 *
 * @remarks reference: https://betterprogramming.pub/typescript-with-go-rust-errors-no-try-catch-heresy-da0e43ce5f78
 *
 */

// TODO: incorporate safe functions in article

// --- local types ---
interface SafeBase {
	success: boolean
}

// --- export types ---
/**
 * Represents a safe data object with a success flag and data of type T.
 * @template T - The type of the data.
 */
export interface SafeData<T> extends SafeBase {
    success: true
    data: T
  }

/**
 * Represents an error response in the SafeReturn module.
 */
export interface SafeError extends SafeBase {
    success: false;
    error: string;
  }

/**
 * Represents a safe value or an error.
 * @typeparam T The type of the safe value.
 */
export type Safe<T> =
  | SafeData<T>
  | SafeError


/**
 * Represents a safe return value of type `T`.
 *
 * @template T - The type of the safe return value.
 */
export type SafeReturn<T> = Safe<T> // TODO: retire SafeReturn for shortness

// --- local functions ---


/**
 * Executes a synchronous function and returns a Safe object containing the result.
 * If an error occurs during execution, it is converted to a Safe object using the errorToSafe function.
 *
 * @template T - The type of the data returned by the function.
 * @param {() => T} func - The function to execute.
 * @param {string} [err] - An optional error message to include in the Safe object if an error occurs.
 * @returns {Safe<T>} - A Safe object containing the result of the function execution.
 */
function safeSync<T>(func: () => T, err?: string): Safe<T> {
	try {
		const data = func()

		return { data, success: true }
	} catch (e) {
		return errorToSafe(e, err)
	}
}

async function safeAsync<T> (promise: Promise<T>, err?: string): Promise<Safe<T>> {
	try {
		const data = await promise
		return { data, success: true }
	} catch (e) {
		return errorToSafe(e, err)
	}
}

// --- export functions ---
export function safe<T> (promise: Promise<T>, err?: string): Promise<Safe<T>>
export function safe<T> (func: () => T, err?: string): Safe<T>
export function safe<T> (promiseOrFunc: Promise<T> | (() => T), err?: string,): Promise<Safe<T>> | Safe<T> {
	if (promiseOrFunc instanceof Promise) {
		return safeAsync(promiseOrFunc, err);
	}
	return safeSync(promiseOrFunc, err);
}

/**
 * Converts an error object or error message to a SafeError object.
 * @param e - The error object or error message.
 * @param err - An optional error message to use if `e` is not an instance of Error.
 * @returns A SafeError object representing the converted error.
 */
export function errorToSafe (e: unknown, err?: string): SafeError {
	if (err !== undefined) return { success: false, error: err }

	if (e instanceof Error) return { success: false, error: e.message }

	return { success: false, error: "error can't be identified" };
}
