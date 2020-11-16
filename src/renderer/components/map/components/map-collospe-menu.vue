<style lang="less" scoped>
.flex-layout {
    display: flex;
    position: relative;
    height: calc(~'100vh');
    width: 100%;
    overflow: hidden;
}

.left-menu {
    flex: none;
    position: relative;
    box-sizing: border-box;
    transition: width 0.5s;
    height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

}
.left-menu {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #f5f5f5;
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    border-radius: 3px;
    background-color: #f5f5f5;
  }
  /*定义滑块，内阴影及圆角*/
  &::-webkit-scrollbar-thumb {
    //width: 10px;
    height: 10px;
    border-radius: 3px;
    background-color: #555;
  }
}
.right-content {
    flex: auto;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    background:url(../../../assets/content-bg.png) no-repeat center center;
}

.left-collapse-btn {
    display: block;
    z-index: 1000;
    top: 50%;
    margin-top: -25px;
    left: 0;
    right: auto;
    border-bottom: 9px solid transparent;
    border-right: none;
    border-left: 13px solid #f0f0f0;
    border-top: 9px solid transparent;
    width: 0;
    height: 50px;
    position: absolute;
    transition: border-left 0.1s;
    cursor: pointer;
    &:hover {
        border-left: 20px solid #f0f0f0;
    }
    text-align: center;
    font-size: 13px;
    .sign-style {
        position: absolute;
        top: 5px;
        width: 13px;
        text-align: center;
        overflow: hidden;
        right: 0;
    }
}

.right-collapse-btn {
    z-index: 1000;
    top: 50%;
    margin-top: -25px;
    right: 0;
    left: auto;
    border-bottom: 9px solid transparent;
    border-left: none;
    border-right: 13px solid #f0f0f0;
    border-top: 9px solid transparent;
    width: 0;
    height: 50px;
    position: absolute;
    transition: border-right 0.1s;
    cursor: pointer;
    &:hover {
        border-right: 20px solid #f0f0f0;
    }
    text-align: center;
    font-size: 13px;
    .sign-style {
        position: absolute;
        top: 5px;
        width: 13px;
        text-align: center;
        overflow: hidden;
        left: 0;
    }
}
.iconfont {
  font-family:"iconfont" !important;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-zhankai:before { content: "|||"; }
.icon-shouqi:before { content: "|||"; }
</style>
<template>
    <div class="flex-layout">
        <div class="left-collapse-btn" v-show="!menuShow" @click="menuShow=true">
            <div class="sign-style">
                <i class="iconfont icon-zhankai"></i>
            </div>
        </div>
        <div class="left-menu" :style="{width: menuShow?`${menuWidth}px`:'0'}" style="background-color: white">
            <div class="right-collapse-btn" v-show="menuShow" @click="menuShow=false">
                <div class="sign-style">
                    <i class="iconfont icon-shouqi"></i>
                </div>
            </div>
            <div :style="{width: `${menuWidth}px`, height: '100%'}" >
                <slot name="operation"></slot>
            </div>
        </div>
        <div class="right-content">
          <slot name="content"></slot>
        </div>
    </div>
</template>
<script>
export default {
  name: 'map-collospe-menu',
  data () {
    return {
      menuShow: true
    }
  },
  props: {
    menuWidth: {
      Number,
      default: 160
    }
  }
}
</script>
