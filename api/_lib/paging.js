// Reads every row a query matches, 1000 at a time (PostgREST's page size), up
// to `cap` rows. `buildQuery` must return a fresh query each call.
// Returns { rows, truncated } or { error }.
export async function fetchAll(buildQuery, cap = 20000) {
  const rows = [];
  for (let from = 0; from < cap; from += 1000) {
    const { data, error } = await buildQuery().range(from, from + 999);
    if (error) return { error };
    rows.push(...data);
    if (data.length < 1000) return { rows, truncated: false };
  }
  return { rows, truncated: true };
}
