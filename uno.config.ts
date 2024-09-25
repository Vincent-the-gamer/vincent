import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts, transformerDirectives } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'bg-base': 'bg-white dark:bg-black',
      'border-base': 'border-[#8884]',
    },
    [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`],
  ],
  rules: [
    [/^slide-enter-(\d+)$/, ([_, n]) => ({
      '--enter-stage': n,
    })],
    [
      /^bg-rgba-([.\d]+)-([.\d]+)-([.\d]+)-([.\d]+)$/,
      ([_, r, g, b, a]) => ({ 'background-color': `rgba(${r}, ${g}, ${b}, ${a})` }),
    ],
    [
      /^box-shadow-([a-zA-Z.\d]+)-([a-zA-Z.\d]+)-([a-zA-Z.\d]+)-([a-zA-Z]+)$/,
      ([_, offsetX, offsetY, blur, color]) => ({ 'box-shadow': `${offsetX} ${offsetY} ${blur} ${color}` }),
    ],
    [
      /^backdrop-blur-([.\d]+)$/,
      ([_, pixels]) => ({ 'backdrop-filter': `blur(${pixels}px)` }),
    ],
  ],
  presets: [
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetAttributify(),
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,800',
        mono: 'DM Mono:400,600',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  safelist: [
    'i-ri-menu-2-fill',
  ],
})
