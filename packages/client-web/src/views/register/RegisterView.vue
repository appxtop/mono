<template>
    <div class="login-container">
        <el-form ref="formRef" :model="formModel" :rules="formRules" class="login-form">
            <div class="title-container">
                <h3 class="title">注册账号</h3>
            </div>
            <el-form-item prop="username">
                <el-input v-model="formModel.username" placeholder="请输入用户名">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <user />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="nickname">
                <el-input placeholder="请输入昵称" v-model="formModel.nickname">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <View />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="email">
                <el-input placeholder="请输入邮箱" v-model="formModel.email">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <message />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="verCode">
                <el-input placeholder="请输入验证码" v-model="formModel.verCode">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <aim />
                        </el-icon>
                    </template>
                    <template #append>
                        <el-button :disabled="!verCode_btn_enable" type="primary" @click="handleSendVerCode()">
                            {{ verCode_btn_enable ? "发送验证码" : verCode_btn_disableText }}
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>


            <el-form-item prop="password">
                <el-input v-model="formModel.password" placeholder="请输入密码" show-password>
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <unlock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
                <el-input placeholder="请再次输入一次密码" show-password v-model="formModel.confirmPassword">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <unlock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <div class="error-msg">
                {{ errorMsg }}
            </div>
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                @click.native.prevent="handleSubmit()">注册</el-button>
            <div>
                已有账号? 点击<router-link :to="{ path: '/login' }">登录</router-link>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { validateEmail, validateNickname, validatePassword, validateUsername, validateVerCode } from '@mono/common';
import { apiRequest } from '../../api/apiClient';
import { getToken, setToken } from '../../data';
import router from '../../router';

const formRef = useTemplateRef<FormInstance>('formRef');
const formModel = ref({
    username: 'test',
    password: 'test123456',
    nickname: '天侠',
    email: 'test@qq.com',
    confirmPassword: 'test123456',
    verCode: ''
});
const verCode_btn_disableText = ref("");
const verCode_btn_enable = ref(true);
async function handleSendVerCode() {
    const form = formRef.value!;

    try {
        await form.validateField(['email']);
    } catch (e: any) {
        ElMessageBox.alert('邮箱验证失败');
        return;
    }
    verCode_btn_disableText.value = "发送中...";
    verCode_btn_enable.value = false;
    try {
        await apiRequest('/api/user/sendVerCode', { email: formModel.value.email });
        ElMessage.success("验证码发送成功");
        //60秒后重发
        let num = 60;
        const timeoutId = setInterval(() => {
            num--;
            verCode_btn_disableText.value = `${num}秒后重发`;
            if (num <= 0) {
                verCode_btn_enable.value = true;
                clearTimeout(timeoutId)
            }
        }, 1000);
    } catch (e: any) {
        ElMessageBox.alert('' + e.message);
        verCode_btn_enable.value = true;
    }

}

const loading = ref(false);
const errorMsg = ref('');
async function handleSubmit() {
    const form = formRef.value!;
    errorMsg.value = '';
    loading.value = true;
    try {
        await form.validate();
        const data = { ...formModel.value, token: getToken() };
        const res = await apiRequest('/api/register/submit', data);
        setToken(res.token);
        router.push('/');
        ElMessage.success("注册成功");
    } catch (e: any) {
        if (!e.message) {
            ElMessageBox.alert("请正确输入每一项");
            return;
        }
        errorMsg.value = '' + e.message;
        ElMessageBox.alert('出错了:' + e.message);
    } finally {
        loading.value = false;
    }

}

const formRules: FormRules<typeof formModel> = {
    username: [
        {
            asyncValidator: async (_rule, value: string) => {
                validateUsername(value);
                await apiRequest('/api/register/checkUsername', { username: value })
            },
            trigger: 'blur'
        }
    ],
    password: [
        {
            asyncValidator: async (_rule, value: string) => {
                validatePassword(value);
            },
            trigger: 'blur'
        }
    ],
    nickname: [
        {
            asyncValidator: async (_rule, value: string) => {
                validateNickname(value);
                await apiRequest('/api/register/checkNickname', { nickname: value });
            },
            trigger: 'blur'
        }
    ],
    email: [
        {
            asyncValidator: async (_rule, value: string) => {
                validateEmail(value);
                await apiRequest('/api/register/checkEmail', { email: value });
            },
            trigger: 'blur'
        }
    ],
    verCode: [
        {
            asyncValidator: async (_rule, value: string) => {
                validateVerCode(value);
            },
            trigger: 'blur'
        }
    ],
    confirmPassword: [
        {
            asyncValidator: async (_rule, value: string) => {
                if (value === '') {
                    throw new Error('请再次输入密码');
                } else if (value !== formModel.value.password) {
                    throw new Error('两次输入的密码不一致!');
                }
            },
            trigger: 'blur'
        }
    ]
}
</script>

<style lang="less" scoped>
.login-container {
    background-color: var(--background-color);
    height: 100%;

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: white;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;

        .el-input {
            color: white;
        }
    }

    .error-msg {
        color: red;
        margin-bottom: 10px;
    }
}
</style>