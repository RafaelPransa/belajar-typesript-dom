// 1. Custom Error Hierarchy
export class HttpError extends Error {
    constructor(public readonly status: number, statusText?: string) {
        super(`HTTP error: ${status}${statusText ? ` ${statusText}` : ""}`);
        this.name = "HttpError";
    }
}

export class TimeoutError extends Error {
    constructor(ms: number) {
        super(`Request timed out after ${ms}ms`);
        this.name = "TimeoutError";
    }
}

// 2. Helper Sleep yang Cancellable
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        }

        const onAbort = (): void => {
            clearTimeout(timerId);
            reject(signal?.reason ?? new DOMException("Aborted", "AbortError"));
        };

        const timerId = setTimeout(() => {
            signal?.removeEventListener("abort", onAbort);
            resolve();
        }, ms);

        signal?.addEventListener("abort", onAbort, { once: true });
    });
}

// 3. Retry Policy Options & Type Definition
export interface RetryOptions {
    maxRetries?: number;
    initialDelayMs?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
}

function isRetryableError(error: unknown): boolean {
    if (error instanceof TypeError) return true; // Network failure
    if (error instanceof TimeoutError) return true;
    if (error instanceof HttpError) {
        return error.status === 408 || error.status === 429 || error.status >= 500;
    }
    return false;
}

// 4. Reusable Generic Fetcher
export async function fetchWithRetry<T>(
    input: RequestInfo | URL,
    init?: RequestInit,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        initialDelayMs = 500,
        timeoutMs = 3000,
        signal: externalSignal
    } = options;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (externalSignal?.aborted) {
            throw externalSignal.reason ?? new DOMException("Aborted", "AbortError");
        }

        // Gabungkan timeout signal dan external signal
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => {
            timeoutController.abort(new TimeoutError(timeoutMs));
        }, timeoutMs);

        // Listen abort dari luar jika user membatalkan
        const onExternalAbort = (): void => {
            timeoutController.abort(externalSignal?.reason);
        };
        externalSignal?.addEventListener("abort", onExternalAbort, { once: true });

        try {
            const response = await fetch(input, {
                ...init,
                signal: timeoutController.signal,
            });

            if (!response.ok) {
                throw new HttpError(response.status, response.statusText);
            }

            return (await response.json()) as T;
        } catch (error: unknown) {
            // Jika dibatalkan sengaja oleh user luar, jangan retry
            if (externalSignal?.aborted) {
                throw externalSignal.reason ?? error;
            }

            // Cek jika error diakibatkan timeout controller kita
            const resolvedError =
                timeoutController.signal.aborted &&
                    timeoutController.signal.reason instanceof TimeoutError
                    ? timeoutController.signal.reason
                    : error;

            if (attempt === maxRetries || !isRetryableError(resolvedError)) {
                throw resolvedError;
            }

            // Exponential backoff dengan Full Jitter
            const baseDelay = initialDelayMs * 2 ** (attempt - 1);
            const jitteredDelay = Math.floor(Math.random() * baseDelay);

            console.warn(
                `Attempt ${attempt} failed (${getErrorMessage(resolvedError)}). Retrying in ${jitteredDelay}ms...`
            );

            await sleep(jitteredDelay, externalSignal);
        } finally {
            clearTimeout(timeoutId);
            externalSignal?.removeEventListener("abort", onExternalAbort);
        }
    }

    throw new Error("Unexpected retry loop termination");
}

export function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

const controller = new AbortController();

fetchWithRetry("https://dummyjson.com/products/1", {}, { signal: controller.signal })
    .then((data) => console.log("Hasil data:", data))
    .catch((err) => console.error("Gagal:", getErrorMessage(err)));
