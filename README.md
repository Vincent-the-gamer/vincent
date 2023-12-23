<p align="center">
    <img src="./.github/avatar.png" style="height: 80px;"/>
</p>

<h1 align="center">vincent</h1>

<p align="center">My personal website.</p>

<br>

# Visit
[https://vincent-the-gamer.github.io/vincent-me/](https://vincent-the-gamer.github.io/vincent-me/)

# Router Mode

## Web History + SSG(Default)
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

## Web Hash History + Static Deploy
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
pnpm run static-build
```


# License
<samp>code is licensed under <a href='./LICENSE'>MIT</a>,<br> words and images are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>CC BY-NC-SA 4.0</a></samp>.