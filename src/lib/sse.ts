type Subscriber = (payload: string) => void;

const subscribers = new Set<Subscriber>();

export function subscribe(handler: Subscriber) {
  subscribers.add(handler);
  return () => subscribers.delete(handler);
}

export function publish(event: string, data: unknown) {
  const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (const handler of subscribers) {
    handler(payload);
  }
}

export function publishPing() {
  const payload = `event: ping\n` + `data: {}\n\n`;
  for (const handler of subscribers) {
    handler(payload);
  }
}
