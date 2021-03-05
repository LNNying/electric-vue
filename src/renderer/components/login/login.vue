<template>
    <div class="lnn-login-contain">
        <div class="lnn-login">
            <div class="lnn-login-head">
                <Icon type="md-log-in" /> 欢迎登录
            </div>
            <div class="lnn-login-info">
                <Form ref="lnn-form" :model="loginForm" :rules="rules">
                    <FormItem prop="userName">
                        <Input placeholder="请输入用户名" size="large" v-model="loginForm.userName">
                            <template slot="prepend">
                                <Icon type="ios-contact-outline" />
                            </template>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input placeholder="请输入密码" size="large" v-model="loginForm.password">
                            <template slot="prepend">
                                <Icon type="ios-key-outline" />
                            </template>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Select size="large" placeholder="请选择进入类型" v-model="loginForm.type">
                            <Option value="stacker">STACKER</Option>
                            <Option value="rgv">RGV</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div class="lnn-login-btn">
                <Button type="primary" style="width: 100%;" size="large" @click="submitLoginInfo">登录</Button>
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
                    ],
                    type: [
                        {required: true, message: '请选择进入类型', trigger: 'change', type: 'string'}
                    ]
                }
            }
        },
        methods: {
            submitLoginInfo() {
                this.$refs['lnn-form'].validate(valid => {
                    if (valid) {
                        this.$Notice.success({
                            title: '登录成功',
                            desc: '登录成功',
                            duration: 5
                        });
                        if (this.loginForm.type === 'stacker') {
                            this.$router.push({
                                name: 'stacker'
                            })
                        } else {
                            this.$router.push({
                                name: 'home'
                            })
                        }
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
        height: 350px;
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
