<template>
    <div class="login-container">
        <el-form ref="formRef" :model="formModel" :rules="formRules" class="login-form">
            <div class="title-container">
                <h3 class="title">账号登录</h3>
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
            <el-form-item prop="password">
                <el-input v-model="formModel.password" placeholder="请输入密码" show-password>
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
            <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
                @click.native.prevent="handleSubmit()">登录</el-button>
            <div>
                没有账号? 点击<router-link :to="{ path: '/register' }">注册</router-link>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { validatePassword, validateUsername } from "@mono/common";
import { apiRequest } from "../../api/apiClient";
import { getToken, setToken } from "../../data";
import router from "../../router";

const formRef = useTemplateRef<FormInstance>("formRef")
const formModel = ref({
    username: "",
    password: "",
});
const errorMsg = ref("");
const loading = ref(false);
async function handleSubmit() {
    const form = formRef.value!;
    errorMsg.value = "";
    loading.value = true;
    try {
        await form.validate();
        const data = { ...formModel.value, token: getToken() };
        const res = await apiRequest("/api/auth/login", data);
        setToken(res.token);
        router.push('/');
        ElMessage.success("登录成功");
    } catch (e: any) {
        if (!e.message) {
            ElMessageBox.alert("请正确输入每一项");
            return;
        }
        errorMsg.value = "" + e.message;
        ElMessageBox.alert("出错了:" + e.message);
    } finally {
        loading.value = false;
    }
}

const formRules: FormRules<typeof formModel> = {
    username: [
        {
            asyncValidator: async (_rule, value: string) => {
                validateUsername(value);
            },
            trigger: "blur",
        },
    ],
    password: [
        {
            asyncValidator: async (_rule, value: string) => {
                validatePassword(value);
            },
            trigger: "blur",
        },
    ],
};
</script>

<style lang="less" scoped>
.login-container {
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
