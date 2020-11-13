<template>
    <div class="lnn-home-contain">
        {{canvas}}
    </div>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {
                canvas: null

            }
        },
        methods: {
            returnLogin() {
                this.$router.push({
                    name: 'login'
                })
                this.$Notice.success({
                    title: '提示',
                    desc: '退出成功',
                    duration: 5
                })
            },
        },
        mounted() {
          this.canvas = this.$util.dasd()
        }
    }
</script>

<style scoped>
    .lnn-home-contain {
        width: 100%;
        height: 100vh;
        position: relative;
    }
</style>
