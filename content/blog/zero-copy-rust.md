---
title: Zero-copy Parsing in Rust — A Practical Guide
date: 2024-05-03
excerpt: Exploring how to parse binary protocols without allocating, using lifetime annotations, the Bytes crate, and carefully-placed unsafe code.
---

Parsing binary protocols usually means copying data from the network buffer into your own structs. At high throughput, those allocations add up fast — both in CPU time and memory pressure.

Rust's lifetime system lets you express borrowing relationships that the compiler verifies at compile time. The result is code that is both zero-copy and provably memory-safe, with no garbage collector involved.

## Borrowing from the Buffer

The key insight is that `&[u8]` is just a pointer and a length — it borrows from whatever buffer owns the bytes. As long as that buffer lives longer than the parsed value, no copy is needed:

```rust
use bytes::Bytes;

// Zero-copy: &[u8] borrows from the original buffer
fn parse_frame(buf: &[u8]) -> Result<Frame<'_>, ParseError> {
  let (header, rest) = buf.split_at(HEADER_LEN);
  let length = u32::from_be_bytes(header[0..4].try_into()?);
  Ok(Frame {
    header: header.try_into()?,
    body: &rest[..length as usize],
  })
}
```

The `'_` lifetime on `Frame` tells the compiler that the frame borrows from its input. The caller cannot drop the buffer while the frame is alive. The compiler enforces this.

## When to Use `Bytes`

`&[u8]` only works when you control the buffer's lifetime. For async code where frames outlive the read buffer, use `Bytes` from the `bytes` crate. `Bytes` is reference-counted and supports zero-copy slicing:

```rust
fn split_frame(buf: &mut Bytes) -> Bytes {
  // No copy — increments the reference count and returns
  // a new Bytes pointing into the same allocation
  buf.split_to(FRAME_LEN)
}
```

## Unsafe Code

Sometimes you need unsafe. The rule: keep the unsafe block as small as possible and document the invariant you are upholding. The compiler cannot check it, so you must.

## Takeaways

Zero-copy is not a micro-optimization — at network speeds it determines whether your system is CPU-bound or memory-bound. Rust's type system makes zero-copy safe by construction, which is the real win.
