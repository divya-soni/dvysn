---
title: Shrinking Docker Images by 80% with Multi-stage Builds
date: 2024-07-14
excerpt: Practical techniques for dramatically reducing Docker image size — multi-stage builds, distroless base images, and aggressive layer caching.
---

The typical Node.js Docker image balloons to over a gigabyte because it includes the entire build toolchain, dev dependencies, and a full OS. None of that belongs in production.

Multi-stage builds let you compile in a fat image and copy only the artifacts to a minimal runtime image. Combine that with distroless base images and you eliminate an entire class of supply chain vulnerabilities.

## Before and After

Here is the same application, before and after optimization:

```dockerfile
# Before: 1.2GB
FROM node:20
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["node", "dist/index.js"]

# After: 98MB — multi-stage + distroless
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/index.js"]
```

An 88% reduction in image size.

## Why Distroless?

A standard Alpine image gives you a shell, package manager, and utilities. A distroless image contains only your application runtime and its dependencies — nothing else. No shell means no shell injection. No package manager means no way to install tools after a container escape.

## Layer Caching

Copy your `package.json` and `package-lock.json` first, before copying source code. Docker caches each layer. If you copy everything at once, any source change invalidates the npm install cache and you pay the full install cost on every build.

## Takeaways

Image size is a proxy for attack surface. Every layer you remove is a vulnerability that cannot be exploited. Start with multi-stage builds, move to distroless, and measure the result.
