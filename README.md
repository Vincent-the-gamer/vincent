<p align="center">
    <img src="./.github/avatar.png" style="height: 80px;"/>
</p>

<h1 align="center">vincent</h1>

<p align="center">My personal website.</p>

<br>

# Visit

[https://blog.vince-g.xyz/](https://blog.vince-g.xyz/)

# Router Mode

## Web History + SSG (Default)

```typescript
export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ router, app, isClient }) => {
    ....
  },
)
```

then

```shell
pnpm run build
```

## Web Hash History + SPA

```typescript
export const createApp = ViteSSG(
  App,
  {
    routes,
    history: createWebHashHistory()
  },
  ({ router, app, isClient }) => {
    ....
  },
)
```

then

```shell
pnpm run spa-build
```

# License

Code is licensed under [MIT](./LICENSE).

Words and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
