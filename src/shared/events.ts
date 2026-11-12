import type { Logger } from "pino";

// A typed event "name tag". The payload type lives only at compile time.
export type DomainEvent<TPayload> = {
  readonly name: string;
  readonly __payload?: TPayload;
};

export function defineEvent<TPayload>(name: string): DomainEvent<TPayload> {
  return { name };
}

type Handler<TPayload> = (payload: TPayload) => Promise<void> | void;

// In-process event bus used for communication between modules that must not
// depend on each other directly. Can later be swapped for a message broker.
export class EventBus {
  private readonly handlers = new Map<string, Handler<any>[]>();

  constructor(private readonly logger: Logger) {}

  subscribe<TPayload>(
    event: DomainEvent<TPayload>,
    handler: Handler<TPayload>,
  ) {
    const list = this.handlers.get(event.name) ?? [];
    list.push(handler);
    this.handlers.set(event.name, list);
  }

  async publish<TPayload>(event: DomainEvent<TPayload>, payload: TPayload) {
    for (const handler of this.handlers.get(event.name) ?? []) {
      try {
        await handler(payload);
      } catch (error) {
        // A failing subscriber must not break the publisher's use case.
        this.logger.error({ err: error, event: event.name }, "Event handler failed");
      }
    }
  }
}
