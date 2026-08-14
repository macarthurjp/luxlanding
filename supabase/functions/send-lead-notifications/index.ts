// Retained as a tombstone so callers receive an explicit response while the
// former unauthenticated email relay is phased out. Lead emails are now sent
// only inside the validated submit-lead function.
Deno.serve((request) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  return new Response(
    JSON.stringify({ error: "This endpoint has been retired." }),
    { status: 410, headers },
  );
});
