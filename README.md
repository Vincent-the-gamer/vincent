<p align="center">
    <img src="./.github/avatar.png" style="height: 80px;"/>
</p>

<h1 align="center">vincent</h1>

<p align="center">My personal website.</p>

<br>

# New Feature
- Compatible with `GitHub Pages base url`(Magic!).
  
  Example:

  Give a base url: "/vincent/"

  1. switch branch to `github-pages`.
  2. put your pages into `pages/vincent/` folder.

  3. modify `baseUrl.ts`.
  ```ts
    // baseUrl.ts
    export const BASE_URL: string = "/vincent/" //  do not add '/' at the end.
  ```
  4. modify `vite.config.ts`.
  ```ts
    base: BASE_URL,
  ```


# License
<samp>code is licensed under <a href='./LICENSE'>MIT</a>,<br> words and images are licensed under <a href='https://creativecommons.org/licenses/by-nc-sa/4.0/'>CC BY-NC-SA 4.0</a></samp>.