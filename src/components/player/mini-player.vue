<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img :class="cdCls" :src="currentSong.pic" ref="cdImageRef" width="40" height="40">
        </div>
      </div>
      <div class="slider-wrapper">
        <h2 class="name"> {{currentSong.name}} </h2>
        <p class="desc"> {{currentSong.singer}} </p>
      </div>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <!-- click.stop 组织事件冒泡，影响其他事件，利用其他组件传递的 togglePlay 函数控制播放 -->
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
        </progress-circle>
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import useCd from './use-cd'
import ProgressCircle from '@/components/player/progress-circle.vue'

export default {
  name: 'mini-player',
  components: {
    ProgressCircle
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup() {
    const store = useStore()
    const { cdCls, cdRef, cdImageRef } = useCd()

    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playingState = computed(() => store.state.playingState)
    const miniPlayIcon = computed(() => playingState.value ? 'icon-pause-mini' : 'icon-play-mini')

    function showNormalPlayer() {
      store.commit('setFullScreen', true)
    }

    return {
      fullScreen,
      currentSong,
      showNormalPlayer,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      miniPlayIcon
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0)
  }
}
</style>
