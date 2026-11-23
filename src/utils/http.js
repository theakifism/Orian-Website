/**
 * Parse a JSON API response without leaking the browser's raw SyntaxError
 * (often "Unexpected token '<'" when a hosting error page is returned).
 */
export async function readJsonResponse(response) {
  try {
    const data = await response.json();
    if (data && typeof data === 'object') return data;
  } catch {
    // Convert non-JSON/HTML responses into a stable, user-facing error below.
  }

  throw new Error('The server returned an unexpected response. Please reload and try again.');
}
