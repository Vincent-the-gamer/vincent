<script setup lang="ts">
import SvgAvatar from "./icons/SvgAvatar.vue";

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

const { y: scroll } = useWindowScroll();
</script>

<template>
    <header class="header z-40">
        <RouterLink
            class="w-12 h-12 absolute xl:fixed m-5 select-none outline-none"
            to="/"
            focusable="false"
        >
            <SvgAvatar />
        </RouterLink>
        <button
            title="Scroll to top"
            fixed
            right-3
            bottom-3
            w-10
            h-10
            hover:op100
            rounded-full
            hover-bg-hex-8883
            transition
            duration-300
            z-100
            print:hidden
            :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
            @click="toTop()"
        >
            <div i-ri-arrow-up-line />
        </button>
        <nav class="nav">
            <div class="spacer" />
            <div class="right" print:op0>
                <RouterLink to="/posts" title="博客">
                    <span class="lt-md:hidden">博客</span>
                    <div i-cib-micro-blog md:hidden />
                </RouterLink>
                <RouterLink to="/projects" title="项目/工具">
                    <span class="lt-md:hidden">项目/工具</span>
                    <div i-ri-lightbulb-line md:hidden />
                </RouterLink>
                <RouterLink to="/lpd" title="Launchpad">
                    <span class="gradient-text" lt-md:hidden>Launchpad</span>
                    <div i-material-symbols-grid-on-sharp md:hidden />
                </RouterLink>
                <RouterLink to="/games" title="游戏历程">
                    <span lt-md:hidden>游戏历程</span>
                    <div i-solar-gameboy-linear md:hidden />
                </RouterLink>
                <RouterLink to="/waifus" title="老婆列表">
                    <span lt-md:hidden>老婆列表</span>
                    <div i-icon-park-outline-girl md:hidden />
                </RouterLink>
                <a
                    href="https://github.com/Vincent-the-gamer"
                    target="_blank"
                    title="GitHub"
                    class="lt-md:hidden"
                >
                    <div i-uil-github-alt />
                </a>
                <ToggleTheme />
            </div>
        </nav>
    </header>
</template>

<style scoped>
.header h1 {
    margin-bottom: 0;
}

.logo {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
}

.nav {
    padding: 2rem;
    width: 100%;
    display: grid;
    grid-template-columns: auto max-content;
    box-sizing: border-box;
}

.nav > * {
    margin: auto;
}

.nav img {
    margin-bottom: 0;
}

.nav a {
    position: relative;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s ease;
    opacity: 0.6;
    outline: none;
}

.nav a:hover {
    opacity: 1;
    text-decoration-color: inherit;
}

/* 0.6 is comfortable on a light surface but too faint on dark. */
html.dark .nav a {
    opacity: 0.72;
}

html.dark .nav a:hover,
html.dark .nav a.router-link-active {
    opacity: 1;
}

/* Current page indicator */
.nav a.router-link-active {
    opacity: 1;
}

.nav a.router-link-active::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.35rem;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
    transform-origin: center;
    animation: nav-underline 0.3s ease both;
}

@keyframes nav-underline {
    from {
        transform: scaleX(0);
        opacity: 0;
    }
    to {
        transform: scaleX(1);
        opacity: 0.55;
    }
}

@media (prefers-reduced-motion: reduce) {
    .nav a.router-link-active::after {
        animation: none;
        transform: scaleX(1);
        opacity: 0.55;
    }
}

/* Keyboard focus stays clearly visible even where outline:none is set. */
.header a:focus-visible,
.header button:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 3px;
    border-radius: 6px;
    opacity: 1;
}

.nav .right {
    display: grid;
    grid-gap: 1.2rem;
    grid-auto-flow: column;
}

.nav .right > * {
    margin: auto;
}

/* gradient text */
.gradient-text {
    background: linear-gradient(120deg, #ff006a, #4c00ff);
    color: transparent;
    background-clip: text;
    .dark & {
        background: linear-gradient(120deg, #00ffff, #ffff00);
        color: transparent;
        background-clip: text;
    }
}
</style>
