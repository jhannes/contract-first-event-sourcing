# Contract first event sourcing

This project demonstrates how to use an OpenAPI specification to create an event sourced
interaction between a React/TypeScript frontend and a Jetty/Java backend

## Shortcomings

- [ ] reconnecting the websocket. In particular, refreshing while subscribing loses the subscriptions
- [ ] Only clients that subscribe to a snapshot should see deltas on that snapshot
- [ ] Update of persons on incident
