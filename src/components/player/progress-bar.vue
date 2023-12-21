<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrapper"
           :style="btnStyle"
           @touchstart.prevent="onTouchStart"
           @touchmove.prevent="onTouchMove"
           @touchend.prevent="onTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    }
  },
  computed: {
    progressStyle() {
      return `width:${this.offset}px`
    },
    btnStyle() {
      return `transform:translate3d(${this.offset}px,0,0)`
    }
  },
  watch: {
    progress(newProgress) {
      this.setOffset(newProgress)
    }
  },
  created() {
    this.touch = {}
  },
  emits: ['progress-changing', 'progress-changed'],
  methods: {
    setOffset(progress) {
      // 实际歌曲进度条 = 进度条总长度 220px - 进度圆形小按钮 16px
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 计算偏移量，其中 progress = currentTime / currentSong.duration
      this.offset = barWidth * progress
    },
    // 拖动进度条事件
    onTouchStart(e) {
      // 进度条更新前，记录原始位置
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    onTouchMove(e) {
      // 进度条更新时，实时计算进度
      const delta = e.touches[0].pageX - this.touch.x1
      const tempWidth = this.touch.beginWidth + delta
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      this.offset = barWidth * progress
      this.$emit('progress-changing', progress)
    },
    onTouchEnd() {
      // 进度条停止后，更新进度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    // 点击进度条事件
    onClick(e) {
      const rect = this.$el.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
