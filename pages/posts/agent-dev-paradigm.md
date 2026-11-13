---
title: Agent Development Paradigm
date: 2026-11-13
art: dots
---

> [!TIP] Tip
> Chinese version: [Click here](/posts/agent-dev-paradigm-zh)

## Preface

This paradigm is built on top of Git repositories. GitHub is used as the example here, but it applies to any Git repository.

## Preparation

- Two Git repository accounts. One is your primary account, the one you use as a developer — you almost certainly already have this, since back in the age of hand-written code everyone wrote code themselves. The other is registered specifically for the AI Agent; setting up an SSH key for it in advance is recommended.
- A capable AI Agent and LLM (large language model). The efficiency and quality of the work depend on the LLM, and the same LLM paired with different Agents may also produce different results. I usually use DeepSeek Harness with the official DeepSeek API.
- Project constraints: see my repository - [agent-global](https://github.com/Vincent-the-gamer/agent-global). Its `AGENTS-pr.md` mainly tells the Agent that the workspace must stay inside the project, and that git commits are only allowed in the form of Pull Requests — committing to the main branch on its own is forbidden. I also provide some basic Skills that you can pick and choose from.
- GitHub CLI, login your agent's github account first, then make it easy for agent to create PR. (GitHub Only)

## Getting Started

Just have the Agent pull the project you want it to develop. If the project does not have the `AGENTS.md` described above, you can ask it to write one in, and then develop according to your normal requirements. Usually it will not create a PR on its own; once you have accepted the feature, just ask it to open a PR.
