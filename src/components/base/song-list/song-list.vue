<template>
  <ul class="song-list">
    <li class="item" v-for="(song, index) in songs" :key="song.id" @click="selectSong(song,index)">
      <div class="content">
        <h2 class="name"> {{song.name}} </h2>
        <p class="desc"> {{getSongDesc(song)}} </p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['select'],
  methods: {
    getSongDesc(song) {
      // console.log(song)
      return `${song.singer}·${song.album}`
    },
    selectSong(song, index) {
      // emit 用于在 Vue 组件中触发自定义事件，从而在父组件(例如, music-list.vue)中监听并执行相应逻辑
      this.$emit('select', { song, index })
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .content {
      // 即 flex: 1 1 0%; 使子元素等分容器剩余空间
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
