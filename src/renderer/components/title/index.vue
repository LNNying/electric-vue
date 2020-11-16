<style lang="less" scoped>
    .content-title{
        display: inline-block;
        vertical-align: top;
        height: 15px;
        box-sizing: border-box;
      padding: 2px 0;
        span{
            border-left: #2d8cf0 solid 2px;
            padding: 0 5px;
            line-height: 15px;
            font-size: 12px;
        }
    }
</style>
<template>
    <div class="content-title" :style="{width: `${width}px`}">
        <span>
            <slot></slot>
        </span>
    </div>
</template>
<script>
export default {
  name: 'menu-content-layout-title',
  props: {
    width: {
      type: Number,
      default: 100
    }
  }
}
</script>
