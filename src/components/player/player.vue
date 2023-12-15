<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <!-- 背景图 -->
      <div class="background">
        <img :src="currentSong.pic">
      </div>
      <!-- 顶部导航 -->
      <div class="top">
        <div class="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title"> {{currentSong.name}} </h1>
        <h2 class="subtitle"> {{currentSong.singer}} </h2>
      </div>
    </div>
    <!-- 通过ref 拿到这个audio -->
    <audio ref="audioRef"></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'

export default {
  name: 'player',
  setup() {
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const audioRef = ref(null)

    // 初始化时会执行一次，然后当监听的数据发生变化(即当前歌曲切换)时，watch 的回调函数会触发
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      // 调用播放
      audioEl.play()
    })

    return {
      fullScreen,
      currentSong,
      audioRef
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      // 置于底层
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
}
</style>
