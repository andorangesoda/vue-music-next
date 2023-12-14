<template>
  <!-- 在组件的逻辑中通过这个 ref 引用对象来访问和操作该 DOM 元素。 -->
  <div ref="rootRef">
    <!-- 插槽，放置要进行滚动的代码-->
    <slot></slot>
  </div>
</template>
<script>
import { ref } from 'vue'
import useScroll from '@/components/base/scroll/use-scroll'

export default {
  name: 'scroll',
  props: {
    // 自定义一个点击属性，默认值为true，覆盖scroll的自带点击属性（默认为false）
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  // 声明可以触发的自定义事件
  emits: ['scroll'],
  setup(props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)
    return { rootRef, scroll }
  }
}
</script>
