<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list.vue'

export default {
  name: 'singer-detail',
  components: { MusicList },
  props: {
    singer: Object
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    pic() {
      return this.singer && this.singer.pic
    },
    title() {
      return this.singer && this.singer.name
    }
  },
  async created() {
    const res = await getSingerDetail(this.singer)
    // 获取url
    this.songs = await processSongs(res.songs)
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  // 定义了元素的层叠顺序（z轴的顺序）。具有较高z-index值的元素将显示在具有较低z-index值的元素之上。
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $color-background;
}
</style>
