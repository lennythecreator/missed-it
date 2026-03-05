import { publishPing, subscribe } from '@/lib/sse';

export const dynamic = 'force-dynamic';

export async function GET() {
  let unsubscribe: (() => void) | null = null;
  let pingInterval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: string) => controller.enqueue(new TextEncoder().encode(payload));

      send('event: ready\ndata: {}\n\n');
      unsubscribe = subscribe(send);
      pingInterval = setInterval(() => publishPing(), 15000);

      controller.enqueue(new TextEncoder().encode('retry: 3000\n\n'));
    },
    cancel() {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
      if (unsubscribe) {
        unsubscribe();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
