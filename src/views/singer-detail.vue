<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

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
    computedSinger() {
      let res = ''
      const singer = this.singer
      if (singer) {
        res = singer
      } else {
        // 页面刷新时，没有singer，此时需要从缓存中获取
        const cacheSinger = storage.session.get(SINGER_KEY)
        if (cacheSinger && cacheSinger.mid === this.$route.params.id) {
          res = cacheSinger
        }
      }
      return res
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created() {
    const singer = this.computedSinger
    if (!singer) {
      // 未获取到歌手时，跳转到地址中匹配的第一个路径
      const path = this.$route.matched[0].path
      this.$router.push({ path })
      return
    }
    const res = await getSingerDetail(singer)
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
