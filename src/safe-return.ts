// reference: https://betterprogramming.pub/typescript-with-go-rust-errors-no-try-catch-heresy-da0e43ce5f78

// TODO: incorporate safe functions in article

// --- local types ---
interface SafeBase {
	success: boolean
}

// --- export types ---
export interface SafeData<T> extends SafeBase {
    success: true
    data: T
  }

export interface SafeError extends SafeBase {
    success: false;
    error: string;
  }

export type Safe<T> =
  | SafeData<T>
  | SafeError


export type SafeReturn<T> = Safe<T> // TODO: retire SafeReturn for shortness

// --- local functions ---
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

export function errorToSafe (e: unknown, err?: string): SafeError {
	if (err !== undefined) return { success: false, error: err }

	if (e instanceof Error) return { success: false, error: e.message }

	return { success: false, error: "error can't be identified" };
}
