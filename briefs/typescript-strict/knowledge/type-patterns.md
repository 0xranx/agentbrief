# TypeScript Type Patterns

## Pattern: unknown vs any

```typescript
// BAD: any hides bugs
function parse(data: any) { return data.name; }

// GOOD: unknown + type guard
function parse(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name;
  }
  throw new Error('Invalid data');
}
```

## Pattern: satisfies vs as

```typescript
// BAD: as assertion -- bypasses type checking
const user = response as User;

// GOOD: satisfies -- validates without widening
const user = response satisfies User;
```

## Pattern: Exhaustive Switch

```typescript
// BAD: non-exhaustive switch
type Status = 'active' | 'inactive' | 'pending';
function label(s: Status) {
  switch (s) {
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    // 'pending' silently unhandled!
  }
}

// GOOD: exhaustive with never check
function label(s: Status): string {
  switch (s) {
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    case 'pending': return 'Pending';
    default: {
      const _exhaustive: never = s;
      throw new Error(`Unhandled status: ${_exhaustive}`);
    }
  }
}
```

## Pattern: Discriminated Unions

```typescript
// BAD: optional fields for different states
interface ApiResponse {
  data?: User;
  error?: string;
  loading?: boolean;
}

// GOOD: discriminated union
type ApiResponse =
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: string };
```

## Pattern: Constrained Generics

```typescript
// BAD: unconstrained generic
function getProperty<T>(obj: T, key: string) {
  return (obj as any)[key];
}

// GOOD: constrained generic with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Pattern: Return Type Annotations

```typescript
// BAD: inferred return type on exported function
export function createUser(name: string) {
  return { id: crypto.randomUUID(), name, createdAt: new Date() };
}

// GOOD: explicit return type on exported function
export function createUser(name: string): User {
  return { id: crypto.randomUUID(), name, createdAt: new Date() };
}
```

## Pattern: Type Guards

```typescript
// BAD: type assertion
function isUser(obj: unknown): boolean {
  return (obj as User).name !== undefined;
}

// GOOD: type predicate
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    typeof (obj as Record<string, unknown>).name === 'string'
  );
}
```
