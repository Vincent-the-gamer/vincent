---
title: 抛弃Vuex和Redux, 使用Pinia和Zustand
date: 2023-02-25
lang: zh
---

## Vuex和Redux恶心人的地方

### 前言

自从Pinia出以后，咱就不在Vue上用Vuex了，因为那个mutation感觉很多此一举，现在Pinia出了，可以直接在actions定义方法，在getters定义计算属性了，然后我就想到了Redux也是一样的毛病，你要定义一堆Reducers，贼麻烦，别说React-Redux啥的，那玩意还得封装一个容器组件，折腾。

于是，咱就在想，React能不能用Pinia，然后我搜了一圈，搜出来一个zustand，用了用还真香。



### Pinia和Zustand是啥？

次时代状态管理工具咯，Pinia和Zustand真正实现了完全简单化，只需要定义state，和操作这些state的函数，就可以实现响应式数据

* Pinia的store定义

  ~~~typescript
  import { defineStore } from "pinia"
  export const use啥啥啥store = defineStore("storeId", {
    state: () => {
      return {
         text: "我去！初音未来！"
      }
    },
    actions: {
      setText(text: string){
        this.text = text;
      }
    },
    getters: {
      getText(){
        return this.text;
      }
    }
  })
  ~~~

  在组件里使用Pinia创建的store:

  ~~~typescript
  import { use啥啥啥store } from "你的路径"
  const 啥啥啥store = use啥啥啥store();
  
  // 使用函数和属性
  const text = 啥啥啥store.text; // 直接访问
  const text2 = 啥啥啥store.getText; // 使用getter
  啥啥啥store.setText("女神异闻录5"); // 调用action
  ~~~

  

* Zustand的store定义(注意括号，每一个函数返回一个对象，省略return需要用小括号包裹)

  ~~~typescript
  import { create } from "zustand"
  
  export const use啥啥啥store = create((set, get) => ({
    count: 0,
    add: () => set((state: any) => ( {count: state.count + 1} ))
  }));
  ~~~

*  在组件里使用Zustand创建的store:

  ~~~typescript
  import { use啥啥啥store } from "你的路径"
  
  // 把整个store拿过来, 这样会导致该组件在每一个状态变化时都要进行更新。
  const 啥啥啥store = use啥啥啥store();
  
  // 按需使用函数和属性, 这样就只有使用到的值改变时，组件会更新。
  const count = use啥啥啥store((state: any) => state.count); 
  const add = use啥啥啥store((state: any) => state.add);
  ~~~



只能说，实属很方便了，反正咱再也不想用Vuex和Redux了，哼╭(╯^╰)╮

