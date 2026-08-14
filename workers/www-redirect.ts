export default {
  fetch(request: Request): Response {
    const incomingUrl = new URL(request.url);
    const destination = new URL(incomingUrl.pathname + incomingUrl.search, "https://luxlanding.eu");

    return Response.redirect(destination.toString(), 308);
  },
} satisfies ExportedHandler;
