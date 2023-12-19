import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playingState)
  const cdCls = computed(() => playing.value ? 'playing' : '')

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      // 当唱片停止时，同步唱片的角度
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    // 获取计算属性样式的 transform
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    // 如果不是 'none'，则将内部元素的 transform 属性和外层容器的 transform 属性合并，然后赋值给外层容器的 transform 属性。
    wrapper.style.transform = wrapperTransform === 'none'
      ? innerTransform
      : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
