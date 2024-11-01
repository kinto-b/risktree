
// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
export function unsafeHash(x: string): string {
    let hash = 0;
    for (let i = 0, len = x.length; i < len; i++) {
        let chr = x.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return "x" + hash.toString(32).replace("-", "");
}

export function is_whitespace(x: string): boolean {
    return x.trim().length == 0;
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-this-alias */

/**
 * Reduce calls to the passed function.
 *
 * @param func - Function to debounce.
 * @param threshold - The delay to avoid recalling the function.
 * @param execAsap - If true, the Function is called at the start of the threshold, otherwise the Function is called at the end of the threshold.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, threshold: number, execAsap = false): T {
    let timeout: any;

    return function debounced(this: any, ...args: any[]): any {
        const self = this;

        if (timeout) clearTimeout(timeout);
        else if (execAsap) func.apply(self, args);

        timeout = setTimeout(delayed, threshold || 100);

        function delayed(): void {
            if (!execAsap) func.apply(self, args);
            timeout = null;
        }
    } as T;
}