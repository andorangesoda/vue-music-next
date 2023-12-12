<template>
  <scroll class="index-list">
    <ul>
      <li class="group" v-for="group in data" :key="group.title">
        <h2 class="title"> {{group.title}} </h2>
        <ul>
          <li class="item" v-for="item in group.list" :key="item.id" @click="onItemClick(item)">
            <img v-if="item.pic" class="avatar" :src="item.pic">
            <img v-else class="avatar" src="@/assets/images/default.png">
            <span class="name"> {{item.name}} </span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'

export default {
  name: 'index-list',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['select'],
  setup (props, { emit }) {
    function onItemClick(item) {
      emit('select', item)
    }
    return { onItemClick }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  hight: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
}
</style>
