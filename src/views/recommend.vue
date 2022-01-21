<template>
    <div>推荐页面
        <van-form ref="form">
            <van-field
                v-model="state.username"
                placeholder="请输入手机号码"
                :right-icon="state.closeUsername"
                @click-right-icon="closeUsername"
            ></van-field>
             <van-field
                v-model="state.password"
                placeholder="请输入手机号码"
                :right-icon="state.closePassword"
                @click-right-icon="closePassword"
            ></van-field>
        </van-form>
    </div>
</template>
<script>
import { reactive, watch } from 'vue'

export default {
    name: 'Recommend',
    setup() {
        const state = reactive({
            username: '',
            password: '',
            closeUsername: '',
            closePassword: ''
        });
        const closeUsername = (e) => {
            console.log(e)
            state.username = '';
        };
        const closePassword = (e) => {
            console.log(e)
            state.password = '';
        };
        watch(() => [state.username, state.password], () => {
            if (state.username != '')
                state.closeUsername = 'close';
            else
                state.closeUsername = '';
            
            if (state.password != '')
                state.closePassword = 'close';
            else
                state.closePassword = '';
        });
        return { state, closeUsername, closePassword };
    },
    
}
</script>

<style lang="less" scoped>

</style>