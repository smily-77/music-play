<template>
  <h1 class="title">云音乐</h1>
  <div class="signBox">
    <van-form ref="form">
      <!-- 手机号码 -->
      <van-field
        v-model="mobile"
        placeholder="请输入手机号码"
        :rules="telRules"
        :clearable="true"
        @clear="clearAll"
      ></van-field>
      <!-- 验证码 -->
      <van-field v-model="code" placeholder="请输入验证码" :clearable="true" :rules="codeRules">
        <!-- 通过 button 插槽可以在输入框尾部插入按钮 -->
        <template #button v-if="showButton">
          <van-button
            class="button"
            @click="getCode"
            :disabled="!countdown"
            v-bind:class="[countdown ? 'reg_active' : 'reg_disActive']"
          >
            <span v-if="countdown">{{ text }}</span>
            <span v-if="!countdown">{{ count }}</span>
          </van-button>
        </template>   
      </van-field>
      <van-button
        color="rgb(255,36,66)"
        type="primary"
        block
        @click="submit"
        :disabled="submitButton"
        >登录</van-button
      >
    </van-form>
    <p class="signTitLe">未注册的手机号登录成功后将自动注册</p>

  </div>
    
</template>
<script>
export default {
  data() {
    return {
      mobile: "",
      // 手机号码
      code: "",
      // 验证码
      count: "",
      countdown: true,
      timer: null,
      text: "发送验证码",
      // 验证码按钮是否显示
      showButton: false,
      // 登录按钮是否有效
      submitButton: true,
      // 校验手机号码
      telRules: [
        {
          required: true,
        },
        {
          // 自定义校验规则
          validator: (value) => {
            return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
              value
            );
          },
          message: "请输入正确格式的手机号码",
          trigger: "onBlur",
        },
      ],
      codeRules: [
        {
          required: true,
          // message: "验证码不能为空",
          // trigger: "onBlur",
        },
      ],
    };
  },
  methods: {
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.countdown = false;
        this.text = "重新发送";
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.countdown = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    submit() {
      // 全局表单验证
      this.$refs.form
        .validate()
        .then(() => {
          this.$toast.success("提交成功");
        })
        .catch(() => {
          this.$toast.fail("提交失败");
        });
    },
    clearAll(){
      console.log(1111)
      this.mobile="";
      this.code=""
    }
  },
  watch: {
    mobile(value) {
      let validate =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
          value
        );
      if (validate === true) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    },
    code(value) {
      if (value&&this.showButton) {
        
        this.submitButton = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-button--default {
  border: 0;
  color: blue;
  border-radius:10px;
}

.title {
  margin-top: 80px;
  font-family: "隶书", "LiSu";
  color: rgb(255, 36, 66);
  font-size: 78px;
}
.signBox{
  width: 60%;
  position:relative;
  left: 50%;
  bottom:-100px;
  transform: translateX(-50%);
  .signTitLe{
    font-size: 12px;
  }
}

</style>
