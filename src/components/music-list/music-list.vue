<template>
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <i class="icon-back"></i>
    </div>

    <h1 class="title"> {{title}} </h1>

    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <!-- 蒙板 -->
      <div class="filter"></div>
    </div>

    <scroll class="list" :style="scrollStyle">
      <!-- 歌曲列表 -->
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll.vue'
import SongList from '@/components/base/song-list/song-list'

export default {
  name: 'music-list',
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String
  },
  data() {
    return {
      imageHeight: 0
    }
  },
  computed: {
    bgImageStyle() {
      return {
        backgroundImage: `url(${this.pic})`
      }
    },
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`
      }
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    // 元素沿正z轴方向平移2像素
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    // 指定元素变换的原点在顶部
    transform-origin: top;
    background-size: cover;
    padding-bottom: 80%;
    height: 0;
    .filter {
      position: absolute;
      // 水平、垂直居中
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
