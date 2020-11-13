<template>
    <div class="lnn-login-contain">
        <div class="lnn-login">
            <div class="lnn-login-head">
                <i class="el-icon-sunset"></i> 欢迎登录
            </div>
            <div class="lnn-login-info">
                <el-form ref="lnn-form" :model="loginForm" :rules="rules">
                    <el-form-item prop="userName">
                        <el-input placeholder="请输入用户名" v-model="loginForm.userName">
                            <template slot="prepend">
                                <i class="el-icon-user"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="请输入密码" v-model="loginForm.password">
                            <template slot="prepend">
                                <i class="el-icon-key"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="lnn-login-btn">
                <el-button type="primary" style="width: 100%;" @click="submitLoginInfo">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                loginForm: {},
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitLoginInfo() {
                this.$refs['lnn-form'].validate(valid => {
                    if (valid) {
                        this.$message({
                            message: '登录成功',
                            type: 'success',
                            center: true
                        })
                        this.$router.push({
                            name: 'home'
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .lnn-login-contain {
        width: 100%;
        height: 100vh;
        background: rgb(194, 227, 255);
        /*background-image: url('../../../../static/login_bg.jpg');*/
        /*background-size: cover;*/
        /*background-position: center;*/
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .lnn-login-contain .lnn-login {
        width: 400px;
        height: 300px;
        background: rgb(255, 255, 255);
        /*opacity: .5;*/
        border-radius: 5px 5px;
        box-shadow: 0 0 20px 4px #9ec4f1;
    }

    .lnn-login-contain .lnn-login .lnn-login-head {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        width: 100%;
        padding: 10px 10px;
        font-weight: bold;
        border-bottom: 1px solid #beecf7;
    }

    .lnn-login-contain .lnn-login .lnn-login-info {
        margin: 45px 30px;
    }

    .lnn-login-contain .lnn-login .lnn-login-btn {
        margin: 0 30px;
    }
</style>
