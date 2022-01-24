<template>
   <van-field
        v-model="state.data"
        :placeholder="placeholder"
        :right-icon="state.curIcon"
        @click-right-icon="clearData"
        @input="updateData"
    ></van-field>
</template>

<script>
/**
 * 输入框组件
 */
import { onMounted, reactive, watch } from 'vue'

export default {
    name: 'Input',
    props: {
        // 初始值
        initialData: {
            type: String,
            default: ''
        },
        // 初始的右侧Icon
        initalRightIcon: {
            type: String,
            default: ''
        },
        // 右侧Icon
        rightIcon: {
            type: String,
            default: 'close'
        },
        // 占位提示语
        placeholder: {
            type: String,
            default: ''
        },
        // 清除回调函数
        clear: {
            default: null
        },
        // 更新回调函数
        update: {
            type: String,
            default: null
        }
    },
    setup (props, { emit }) {

        onMounted(() => {
            updateData();
            console.log(props)
        })

        const state = reactive({
            curIcon: props.initalRightIcon ? props.initalRightIcon : '',
            data: props.initialData? props.initialData : '',
            aimIcon: props.rightIcon ? props.rightIcon : 'close',
            modalName: props.modalName
        });

        const clearData = () => {
            // 清空数据
            state.data = '';
            props.clear && emit('clear', '');
        };
        const updateData = () => {
            // 更新数据
            props.update && emit('updatePassword', state.data);
        }
        const blurData = (e) => {
            // 失焦时触发
            props.blur && emit('blur', e);
        }
        const focusData = (e) => {
            // 聚焦时触发
            props.focus && emit('focus', e);
        }

        watch(() => [state.data], () => {
            // 监听数据
            if (state.data != '')
                state.curIcon = state.aimIcon;
            else
                state.curIcon = '';
        });
        
        return { state, clearData, updateData, blurData, focusData }
    }

}
</script>

<style>

</style>