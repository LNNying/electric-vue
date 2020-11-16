import Vue from 'vue'

Vue.mixin({

    data() {
        return {

        }
    },
    methods: {
        $error (error, millisecond = 1) {
            millisecond = millisecond <= 3 ? 4 : 5
            return this.$Notice.error({
                title: '提示',
                desc: error,
                duration: millisecond
            })
        },
        $success (msg, millisecond = 1) {
            millisecond = millisecond <= 3 ? 4 : 5
            return this.$Notice.success({
                title: '提示',
                desc: msg,
                duration: millisecond
            })
        },
        $warn (msg, millisecond = 1) {
            millisecond = millisecond <= 3 ? 4 : 5
            return this.$Notice.warning({
                title: '提示',
                desc: msg,
                duration: millisecond
            })
        },
        $isEmpty(val) {
            if (val === '' || val === null) {
                return true
            } else {
                return false
            }
        },
        $loginOut() {
            this.$Modal.confirm({
                title: '提示',
                content: '网络错误或服务器崩溃！！！',
                okText: '退出系统',
                cancelText: '取消',
                onOk: () => {
                    this.$auth.logout({
                        success: function () {},
                        error: function () {}
                    })
                },
                onCancel: () => {
                    return false
                }
            })
        },
    }

})
