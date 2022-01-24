<template>
  <div class="container">
    <img src="@/assets/images/logo.png" alt="" />
    <div class="blackBox"></div>
    <div class="loginBox">
      <van-form ref="form" class="www">
        <!-- 手机号码 -->
        <van-field
          v-model="mobile"
          placeholder="请输入手机号码"
          :rules="telRules"
          :right-icon="closePhone"
          @click-right-icon="closePhoneBtn"
        >
        </van-field>
        <!-- 密码 -->
        <van-field
          v-model="password"
          placeholder="请输入密码"
          :right-icon="closePassword"
          @click-right-icon="closePasswordBtn"
        >
        </van-field>
        <van-button
          color="rgb(52,116,156)"
          type="primary"
          block
          @click="submit"
          :disabled="submitButton"
          class="loginBtn"
          size="small"
          >登录</van-button
        >
      </van-form>
      <router-link to="/sign">
        <p class="loginTitLe">没有账号去注册</p>
      </router-link>
    </div>
  </div>
</template>
<script>
import { IsRegister } from "@/common/api";
export default {
  name: "Login",
  data() {
    return {
      // 手机号码
      mobile: "",
      // 验证码
      password: "",
      // 登录按钮是否有效
      submitButton: true,
      showButton:false,
      closePhone: "",
      closePassword: "",
     
      // 校验手机号码
      telRules: [
        {
          required: true,
        },
        // {
        //   // 自定义校验规则
        //   validator: (value) => {
        //     return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
        //       value
        //     );
        //   },
        //   message: "请输入正确格式的手机号码",
        //   trigger: "onBlur",
        // },
      ],
      passwordRules: [
        {
          required: true,
        },
      ],
    };
  },
  methods: {
    async submit() {
      // 全局表单验证
      console.log("222;");
      IsRegister({ phone: "13787833290" }).then((res) => {
        console.log(res);
      });
      // this.$refs.form
      //   .validate()
      //   .then(() => {
      //     this.$toast.success("提交成功");
      //   })
      //   .catch(() => {
      //     this.$toast.fail("提交失败");
      //   });
    },
    closePhoneBtn() {
      this.mobile = "";
    },
    closePasswordBtn() {
      this.password = "";
    },
  },
  watch: {
    mobile(value) {
      let validate =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
          value
        );
      if (validate) {
        this.showButton = true;
      } else {
        this.showButton = false;
        this.submitButton = true;
      }

      if (value != "") this.closePhone = "close";
      else this.closePhone = "";
    },
    password(value) {
      if (value && this.showButton) {
        this.submitButton = false;
      } else {
        this.submitButton = true;
      }
      if (value != "") this.closePassword = "close";
      else this.closePassword = "";
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-button--default {
  border: 0;
  color: rgb(143, 185, 201);
  border-radius: 10px;
  font-size: 12px;
  height: 10px;
  line-height: 8px;
}
/deep/.van-cell {
  border-radius: 15px;
  margin-top: 8px;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .blackBox {
    height: 20%;
  }
  .loginBox {
    .loginTitLe {
      font-size: 12px;
      margin-top: 60px;
      color: rgb(52, 116, 156);
    }
    
  }
}
</style>
