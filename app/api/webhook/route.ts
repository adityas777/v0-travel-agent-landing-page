export async function POST(request: Request) {
  try {
    const data = await request.json();

    const response = await fetch(
      'https://mom1323.app.n8n.cloud/webhook-test/0908830e-e739-4ad8-9d90-a58b418cd4e1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      return Response.json({ success: true });
    } else {
      console.error('[v0] N8N webhook error:', response.status, response.statusText);
      return Response.json(
        { success: false, error: 'Webhook request failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('[v0] Webhook proxy error:', error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
