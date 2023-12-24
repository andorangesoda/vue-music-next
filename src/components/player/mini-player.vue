<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <!-- CD -->
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img :class="cdCls" :src="currentSong.pic" ref="cdImageRef" width="40" height="40">
        </div>
      </div>
      <!-- 歌曲描述 -->
      <div class="slider-wrapper">
        <h2 class="name"> {{currentSong.name}} </h2>
        <p class="desc"> {{currentSong.singer}} </p>
      </div>
      <!-- 播放按钮 -->
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <!-- click.stop 组织事件冒泡，影响其他事件，利用其他组件传递的 togglePlay 函数控制播放 -->
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
        </progress-circle>
      </div>
      <!-- 播放列表 -->
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
      <playlist ref="playlistRef"></playlist>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useCd from './use-cd'
import ProgressCircle from '@/components/player/progress-circle.vue'
import Playlist from '@/components/player/playlist.vue'

export default {
  name: 'mini-player',
  components: {
    ProgressCircle,
    Playlist
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup() {
    const playlistRef = ref(null)
    const store = useStore()
    const { cdCls, cdRef, cdImageRef } = useCd()

    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playingState = computed(() => store.state.playingState)
    const miniPlayIcon = computed(() => playingState.value ? 'icon-pause-mini' : 'icon-play-mini')

    function showNormalPlayer() {
      store.commit('setFullScreen', true)
    }
    function showPlaylist() {
      playlistRef.value.show()
    }

    return {
      fullScreen,
      currentSong,
      showNormalPlayer,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      miniPlayIcon,
      playlistRef,
      showPlaylist
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
