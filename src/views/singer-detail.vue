<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { SINGER_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'

// 提取公用逻辑
export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
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
