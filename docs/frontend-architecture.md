# Frontend Architecture Conventions

This document defines the baseline architecture for the SiwaUI application and library.
The goal is to keep the foundation enterprise-ready, predictable, and easy to extend.

## Layers

The application is split into clear layers:

1. `src/app/core/store`
   Root and feature state built with NgRx actions, reducers, selectors, effects, and facades.
2. `src/app/core/services`
   Infrastructure and domain API services.
3. `src/app/pages`
   Route-level presentation components.
4. `projects/siwa-ui/src/lib`
   Reusable library concerns only.

## Component Rules

Page and layout components should:

- read state from facades/selectors
- dispatch user intent through facades
- keep only UI-local state locally, such as dialog visibility or form controls
- avoid direct endpoint knowledge
- avoid orchestrating async business flows with manual `subscribe(...)`

Components may still use framework services directly when the concern is purely presentational,
for example Angular form builders or PrimeNG confirmation dialogs.

## Store Rules

Feature state uses the same NgRx pattern everywhere:

- `*.actions.ts`
- `*.reducer.ts`
- `*.selectors.ts`
- `*.effects.ts`
- `*.facade.ts`
- `*.models.ts`

Use root store only for cross-application concerns, such as:

- auth session
- locale
- application bootstrap state

Use lazy route-scoped providers for feature state that is only needed inside a route group,
such as admin pages and auth page flows.

## Effects Rules

Effects are responsible for:

- reacting to actions
- calling domain services
- mapping API results to store actions
- cross-cutting orchestration such as navigation or SignalR connection lifecycle

Effects should not:

- construct raw endpoint strings
- know transport-level URL structure
- duplicate query-parameter mapping logic
- own reusable DTO contracts

If an effect needs HTTP data, it should depend on a domain API service instead of `ApiService`.

## Service Rules

There are two service categories:

1. Domain API services
   Examples: `UsersApiService`, `RolesApiService`, `AuditLogApiService`
2. Infrastructure services
   Examples: `AuthService`, `SignalRService`, `PasswordPolicyService`

Domain API services should:

- own endpoint paths
- own request and query construction
- return typed contracts
- stay free of store concerns

Infrastructure services may manage cross-cutting concerns such as:

- token/session mechanics
- SignalR lifecycle
- cached validation policy
- global logging

## API Contract Rules

Shared API building blocks live under `src/app/core/models`.

Use shared contracts for repeated patterns:

- `PagedQuery`
- `PagedResponse<T>`
- `ApiErrorPayload`
- `ApiErrorMessage`
- shared query param types

Feature-specific DTOs remain in the feature `*.models.ts` files when they carry domain meaning.

## Error Handling Rules

The frontend follows the backend error contract:

1. `ErrorMessage.message` is leading when present
2. otherwise `ErrorMessage.code` is used
3. otherwise the UI falls back to HTTP or unknown error keys

Hardcoded user-facing error strings in components should be avoided.

## Library Boundary Rules

`projects/siwa-ui` is for reusable library capabilities only.

Do not place app-specific store slices or app route state in the library.
If the library exposes state, it must follow the same NgRx conventions as the app.

## Testing Rules

Each feature should be validated at the right levels:

- unit or component tests for reducers, effects, facades, and route components
- integration-style tests through the real store wiring where valuable
- Playwright e2e tests for key route flows

Architecture refactors should be validated with:

- `npm run build`
- `npm test`
- targeted Playwright coverage when route behavior changes

## Decision Checklist

Before adding new stateful functionality, ask:

1. Is this app-wide state or route-local state?
2. Does the component really need async orchestration, or only UI state?
3. Should this HTTP logic live in a domain service?
4. Can I reuse `PagedQuery`, `PagedResponse<T>`, or shared error contracts?
5. Is this app-specific or should it live in the reusable library?
