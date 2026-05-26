# AGENTS.md - vincent

Agent entrypoint for this repository; Use this file for repo-wide rules only.

## Project Knowledge

This project is a blog website.

- **File Structure**
  - `pages/`: The blog posts and pages of this project.
  - `scripts/`: Assist with build and deployment tasks.
  - `src/`: Source code of this project, written in Vue 3 + TypeScript.

## Code Style

- Vue Components: Always use Composition API and `<script setup lang="ts">`

## Forbidden operations

- CRITICAL: Do NOT run dangerous shell commands: e.g. `rm -rf`, `sudo`.
