<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img :class="cdCls" :src="currentSong.pic" ref="cdImageRef" width="40" height="40">
        </div>
      </div>
      <div>
        <h2 class="name"> {{currentSong.name}} </h2>
        <p class="desc"> {{currentSong.singer}} </p>
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import useCd from './use-cd'

export default {
  name: 'mini-player',
  setup() {
    const store = useStore()
    const { cdCls, cdRef, cdImageRef } = useCd()

    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)

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
      cdImageRef
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
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0)
  }
}
</style>
