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
        <!--
          The signature and the search trigger share one fixed cluster so both
          stay pinned to the top-left corner while the page scrolls.
        -->
        <div class="brand">
            <RouterLink
                class="logo select-none outline-none"
                to="/"
                focusable="false"
            >
                <SvgAvatar />
            </RouterLink>
            <div class="brand-search" print:hidden>
                <LocalSearch />
            </div>
        </div>
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
            <div class="spacer" print:hidden />
            <div class="right" print:op0>
                <RouterLink to="/posts" title="Blog/博客">
                    <span class="lt-md:hidden">Blog/博客</span>
                    <div i-cib-micro-blog md:hidden />
                </RouterLink>
                <RouterLink to="/projects" title="Tools/工具合集">
                    <span class="lt-md:hidden">Tools/工具合集</span>
                    <div i-ri-lightbulb-line md:hidden />
                </RouterLink>
                <RouterLink to="/lpd" title="Launchpad">
                    <span class="gradient-text" lt-md:hidden>Launchpad</span>
                    <div i-material-symbols-grid-on-sharp md:hidden />
                </RouterLink>
                <RouterLink to="/games" title="Game History/游戏历程">
                    <span lt-md:hidden>Game History/游戏历程</span>
                    <div i-solar-gameboy-linear md:hidden />
                </RouterLink>
                <RouterLink to="/waifus" title="Waifus/老婆列表">
                    <span lt-md:hidden>Waifus/老婆列表</span>
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

/*
 * Signature + search trigger, pinned together. The SVG inside the logo is a
 * 98×27 signature, so the box is as wide as the signature itself: the flex gap
 * then starts where the visible logo ends instead of halfway through it.
 */
.brand {
    position: fixed;
    top: 1.25rem;
    left: 1.25rem;
    z-index: 50;
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
}

.logo {
    display: block;
    flex: none;
    width: 6.16rem;
    height: 3rem;
}

.brand-search {
    display: flex;
    flex: none;
}

.nav {
    padding: 2rem;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    box-sizing: border-box;
}

/*
 * Reserves the fixed brand cluster's footprint. If the links no longer fit
 * beside it they wrap onto their own row instead of sliding underneath the
 * logo and the search trigger.
 */
.nav .spacer {
    flex: none;
    width: 13.5rem;
    height: 1.5rem;
}

@media (max-width: 768px) {
    /* The trigger drops its label and shortcut below md. */
    .nav .spacer {
        width: 9.5rem;
    }
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
    flex: none;
    margin-left: auto;
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
