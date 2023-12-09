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
    }
  },
  setup(props) {
    const rootRef = ref(null)
    useScroll(rootRef, props)
    return { rootRef }
  }
}
</script>
