import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

// 开启对 content 以及其子元素 DOM 改变的探测。当这些 DOM 元素发生变化时，将会触发 scroll 的 refresh 方法
BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)
  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })

    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        // 提交坐标
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
