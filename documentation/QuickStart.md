# Quick Start

<!-- guides to 80% of use cases -->
## Basic Usages
### Get User Profile
> Background: You are working on API for getting user info. The endpoint is `/user`.

**Plugins needed:** None

_The following config works on both TypeScript and Flow._

```typescript
export type GET = {
    '/user': {
        id: number,
        username: string,
        gender: 0 | 1
    }
}
```