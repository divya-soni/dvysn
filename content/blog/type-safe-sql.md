---
title: Type-safe SQL in TypeScript Without an ORM
date: 2024-09-22
excerpt: How to get full TypeScript inference on your SQL queries using tagged template literals and a lightweight code generation step — no ORM required.
---

ORMs solve a real problem — writing raw SQL strings that could blow up at runtime is painful. But most ORMs trade one problem for another: a leaky abstraction that fights you when you need a complex query.

Tagged template literals let us write real SQL while getting the compiler to check the output shape. A code generation step reads your schema and produces the exact TypeScript interfaces you need.

## The Core Primitive

A tagged template function is just a function that receives the string parts and interpolated values separately. This lets us build a parameterized query without string concatenation:

```typescript
function sql<T>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Query<T> {
  return { strings, values };
}

// Usage — fully typed
const users = await db.query(
  sql<User>`SELECT * FROM users WHERE id = ${userId}`
);
// users: User[]
```

## Code Generation

The magic comes from generating TypeScript interfaces from your database schema at build time. Given a `users` table, the generator produces:

```typescript
// Generated — do not edit
interface User {
  id: number;
  email: string;
  created_at: Date;
}

// Type error caught at compile time — not runtime
const user = await findUser(42);
console.log(user.nonexistent); // TS Error: Property does not exist
```

Run the generator as part of your build step and commit the output. Your editor gets full autocomplete on every column.

## Why Not an ORM?

ORMs introduce a translation layer between your intent and the SQL that runs. Complex queries often require dropping to raw SQL anyway, at which point you've paid the abstraction cost for nothing.

With this approach, you write the SQL you mean, the database executes exactly that, and TypeScript verifies the result shape.

## Takeaways

Compile-time guarantees are always preferable to runtime checks when you can get them. A small investment in code generation pays dividends every time the schema changes — the compiler tells you everywhere that needs updating.
