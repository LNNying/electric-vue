<template>
    <div class="lnn-home-contain">
        <div class="lnn-return"><el-button @click="returnLogin"><i class="el-icon-arrow-left"></i> 退出系统</el-button></div>
        <div class="lnn-home-content">

        </div>
    </div>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {

            }
        },
        methods: {
            returnLogin() {
                this.$router.push({
                    name: 'login'
                })
                this.$message({
                    message: '退出成功',
                    type: 'success',
                    center: true
                })
            }
        }
    }
</script>

<style scoped>
    .lnn-home-contain {
        width: 100%;
        height: 100vh;
        background: #c3d9ff;
        position: relative;
    }

    .lnn-home-contain .lnn-return {
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 10000;
    }
    .lnn-home-contain .lnn-home-content {
        width: 100%;
        height: 100vh;
        background-color: #fff;
        opacity: .5;
    }
</style>
