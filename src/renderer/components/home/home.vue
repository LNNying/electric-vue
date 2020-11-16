<template>
    <div class="lnn-home-contain">
        <map-monitor></map-monitor>
    </div>
</template>

<script>
    import MapMonitor from "../map/map-monitor";
    export default {
        name: "home",
        components: {MapMonitor},
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
