---
title: 抛弃Vuex和Redux, 使用Pinia和Jotai
date: 2023-12-21
lang: zh
plum: true
---

# Vuex和Redux恶心人的地方

## 前言

自从Pinia出以后，咱就不在Vue上用Vuex了，因为那个mutation感觉很多此一举，现在Pinia出了，可以直接在actions定义方法，在getters定义计算属性了，然后我就想到了Redux也是一样的毛病，你要定义一堆Reducers，贼麻烦，别说React-Redux啥的，那玩意还得封装一个容器组件，折腾。

于是，咱就在想，React能不能用Pinia，然后, 经过详细的分析，我发现了Jotai。

## Pinia和Jotai是啥？

次时代状态管理工具咯，Pinia和Jotai真正实现了完全简单化，只需要定义state，和操作这些state的函数，就可以实现响应式数据

- Pinia的store定义

  ```typescript
  import { defineStore } from 'pinia'
  export const use啥啥啥store = defineStore('storeId', {
    state: () => {
      return {
        text: '我去！初音未来！'
      }
    },
    actions: {
      setText(text: string) {
        this.text = text
      }
    },
    getters: {
      getText() {
        return this.text
      }
    }
  })
  ```

  在组件里使用Pinia创建的store:

  ```typescript
  import { use啥啥啥store } from '你的路径'
  const 啥啥啥store = use啥啥啥store()

  // 使用函数和属性
  const text = 啥啥啥store.text // 直接访问
  const text2 = 啥啥啥store.getText // 使用getter
  啥啥啥store.setText('女神异闻录5') // 调用action
  ```

* Jotai可以定义Store，也可以不定义，比如你有一个需要共享的状态，只需要

  ```typescript
  import { atom } from 'jotai'

  const priceAtom = atom(10)
  ```

  这样就可以在不同组件里使用这个共享的状态:

  ```typescript
  const [value, setValue] = useAtom(anAtom)
  ```

  没错，就像是在useState一样，但是这个状态是全局共享的。

  当然，你也可以在jotai中创建store:

  ```typescript
  const myStore = createStore()

  const countAtom = atom(0)
  myStore.set(countAtom, 1)
  const unsub = myStore.sub(countAtom, () => {
    console.log('countAtom value is changed to', myStore.get(countAtom))
  })
  ```

只能说，实属很方便了，反正咱再也不想用Vuex和Redux了，哼╭(╯^╰)╮
