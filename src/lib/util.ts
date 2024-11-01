
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
