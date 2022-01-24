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
            <Input 
                initialData="初始值" 
                clear="closePassword" 
                update="updatePassword" 
                placeholder="请输入手机号码"
                blur="blurPassword"
            ></Input>
            {{ state.password }}
        </van-form>
    </div>
</template>
<script>
import { reactive, watch } from 'vue'
import Input from '@/components/Input'

export default {
    name: 'Recommend',
    components: {
        Input
    },
    setup() {
        const state = reactive({
            username: '',
            password: '',
            closeUsername: '',
            closePassword: '',
            text: ''
        });
        const closeUsername = (e) => {
            console.log(e)
            state.username = '';
        };
        const closePassword = (value) => {
            state.password = value;
        };
        const updatePassword = (value) => {
            state.password = value
        }

        const blurPassword = () => {
            console.log('3233')
        }
        
        
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
        return { state, closeUsername, closePassword, updatePassword, blurPassword };
    },
    
}
</script>

<style lang="less" scoped>

</style>