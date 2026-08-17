/**
 * Resolves URLs relative to the project root, regardless of where
 * this card is installed (a manual copy under /local/..., a HACS
 * install under /hacsfiles/..., or anywhere else). Works because
 * `import.meta.url` always points to this file's own location.
 */

const ROOT_URL = new URL("../", import.meta.url).href;

export function assetUrl(relativePath) {

    return new URL(relativePath, ROOT_URL).href;

}
