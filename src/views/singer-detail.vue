<template>
  <div class="singer-detail">
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'

export default {
  name: 'singer-detail',
  props: {
    singer: Object
  },
  async created() {
    const res = await getSingerDetail(this.singer)
    console.log(res.songs)
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
