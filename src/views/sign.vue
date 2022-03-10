<template>
  <div class="container">
    <img src="@/assets/images/logo.png" alt="" />
    <div class="blackBox"></div>
    <div class="loginBox">
      <van-form ref="loginForm">
        <!-- 手机号码 -->
        <van-field
          v-model="phone"
          placeholder="请输入手机号码"
          :rules="loginRules.phoneRules"
          validate-trigger="onBlur"
          :right-icon="closePhone"
          @click-right-icon="closePhoneBtn"
        >
        </van-field>
        <!-- 密码 -->
        <van-field
          v-model="password"
          placeholder="请输入密码"
          :type="passwordType"
          :disabled="!phoneSign"
          :rules="loginRules.passwordRules"
          validate-trigger="onBlur"
          :right-icon="changeType"
          @click-right-icon="changeTypeBtn"
        >
        </van-field>
        <van-field
          v-model="nickname"
          placeholder="请输入昵称"
          :disabled="!phoneSign"
          :rules="loginRules.nicknameRules"
          validate-trigger="onBlur"
          :right-icon="closeNickname"
          @click-right-icon="closeNicknameBtn"
        >
        </van-field>
        <van-field
          v-model="captcha"
          placeholder="请输入验证码"
          :disabled="!phoneSign"
          :rules="loginRules.captchaRules"
          validate-trigger="onBlur"
          :right-icon="closeCaptcha"
          @click-right-icon="closeCaptchaBtn"
        >
          <!-- 通过 button 插槽可以在输入框尾部插入按钮 -->
          <template #button v-if="showButton">
            <van-button
              class="button"
              @click="getCaptcha"
              :disabled="!countdown"
            >
              <span v-if="countdown">{{ text }}</span>
              <span v-if="!countdown">{{ count }}</span>
            </van-button>
          </template>
        </van-field>
        <van-button
          color="rgb(52,116,156)"
          type="primary"
          block
          @click="submit"
          :disabled="submitButton"
          class="loginBtn"
          size="small"
          >注册</van-button
        >
      </van-form>
      <router-link to="/login">
        <p class="loginTitLe">已注册去登录</p>
      </router-link>
    </div>
  </div>
</template>
<script>
import { ref, watch, reactive } from "vue";
import { Notify } from "vant";
export default {
  name: "Sign",
  setup() {
    // 表单绑定数据
    const phone = ref("");
    const password = ref("");
    const nickname = ref("");
    const captcha = ref("");
    // 密码的显示与隐藏
    const passwordType = ref("password");
    // 表单清除按钮的控制
    const closePhone = ref("");
    const closeNickname = ref("");
    const closeCaptcha = ref("");
    // 密码框的显示和隐藏type
    const changeType = ref("closed-eye");

    // 手机号是否注册
    const phoneSign = ref(true);
    //控制验证码按钮文字的不同显示
    const countdown = ref(true);
    // 验证码按钮的显示和隐藏
    const showButton = ref(false);
    const text = ref("发送验证码");
    // 验证码倒计时
    const count = ref("");
    // 注册按钮禁用
    const submitButton = ref(true);

    const loginForm = ref(null);
    // 表单验证规则
    let loginRules = reactive({
      phoneRules: [
        {
          required: true,
          message: "请输入手机号码",
        },
        {
          // 校验手机号是否符合规则
          validator: async (value) => {
            // 先校验手机号规则
            let res =
              /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
                value
              );
            if (!res) {
              phoneSign.value = true;
              showButton.value = false;
              return "请输入正确格式的手机号码";
            } else {
              // 校验手机号是否注册过
              let params = {
                phone: value,
              };
              const res = await global.api.IsRegister(params);
              if (res.code === 200 && res.exist > 0) {
                // 手机号已注册过
                phoneSign.value = false;
                showButton.value = false;
                // 清空
                nickname.value = "";
                password.value = "";
                return "手机号已经被注册过";
              }
              phoneSign.value = true;
              showButton.value = true;
              return true;
            }
          },
        },
      ],
      passwordRules: [
        {
          required: true,
          message: "请输入密码",
        },
      ],
      nicknameRules: [
        {
          required: true,
          message: "请输入昵称",
        },
      ],
      captchaRules: [
        {
          required: true,
          message: "请输入验证码",
        },
      ],
    });

    function closePhoneBtn() {
      phone.value = "";
      changeType.value = "closed-eye";
      passwordType.value = "password";
    }
    // function closePasswordBtn() {
    //   password.value = "";
    // }
    function closeNicknameBtn() {
      nickname.value = "";
    }
    function closeCaptchaBtn() {
      captcha.value = "";
    }
    function changeTypeBtn() {
      if (changeType.value === "closed-eye") {
        changeType.value = "eye-o";
        passwordType.value = "text";
      } else {
        changeType.value = "closed-eye";
        passwordType.value = "password";
      }
    }

    /**
     * 发送验证码, 开启定时
     */
    async function getCaptcha() {
      captcha.value = "";
      // 发送验证码请求
      let params = {
        phone: phone.value,
      };
      const res = await global.api.sendCode(params);
      if (res.code === 200)
        // 验证码已发送, 是否给用户提示？
        console.log(res);

      const TIME_COUNT = 60;
      let timer = "";
      if (!timer) {
        count.value = TIME_COUNT;
        countdown.value = false;
        text.value = "重新发送";
        timer = setInterval(() => {
          if (count.value > 0 && count.value <= TIME_COUNT) {
            count.value--;
          } else {
            countdown.value = true;
            clearInterval(timer);
            timer = null;
          }
        }, 1000);
      }
    }

    /**
     * 账号注册
     * 发送注册请求
     */
    async function submit() {
      console.log(loginForm.value);
      let registerParams = {
        phone: phone.value,
        password: password.value,
        nickname: nickname.value,
        captcha: captcha.value,
      };
      const res = await global.api.PhoneRegister(registerParams);
      if (res.code != 200) {
        Notify({ type: "danger", message: res.message });
      } else {
        Notify({ type: "success", message: "注册成功" });
      }
    }

    watch(
      () => [phone.value, password.value, nickname.value, captcha.value],
      () => {
        if (phone.value && password.value && nickname.value) {
          countdown.value = true;
          if (captcha.value) {
            submitButton.value = false;
          } else {
            submitButton.value = true;
          }
        } else {
          countdown.value = false;
          submitButton.value = true;
        }

        if (phone.value != "") {
          closePhone.value = "close";
        } else {
          closePhone.value = "";
          password.value = "";
          nickname.value = "";
          this.$refs.loginForm.resetValidation();
        }
        // 表单清空
        // if (password.value != "") closePassword.value = "close";
        // else closePassword.value = "";
        if (nickname.value != "") closeNickname.value = "close";
        else closeNickname.value = "";
        if (captcha.value != "") closeCaptcha.value = "close";
        else closeCaptcha.value = "";
      }
    );

    return {
      phone,
      password,
      nickname,
      captcha,
      closePhone,
      // closePassword,
      closeNickname,
      closeCaptcha,
      countdown,
      text,
      count,
      showButton,
      loginForm,
      loginRules,
      submitButton,
      submit,
      closePhoneBtn,
      // closePasswordBtn,
      closeNicknameBtn,
      closeCaptchaBtn,
      getCaptcha,
      phoneSign,
      passwordType,
      changeType,
      changeTypeBtn,
    };
  },
};
</script>
<style lang="less" scoped>
/deep/.van-cell {
  border-radius: 10px;
  margin-top: 8px;
}
/deep/.van-button--default {
  border: 0;
  color: rgb(143, 185, 201);
  border-radius: 10px;
  font-size: 15px;
  height: 10px;
}
.container {
  .blackBox {
    height: 5%;
  }
  .loginBox {
    position: relative;
    .loginTitLe {
      position: absolute;
      left:50%;
      margin-left:-45px;
      width: 90px;
      font-size: 12px;
      margin-top: 60px;
      color: rgb(52, 116, 156);
    }
  }

  .button {
    color: rgb(52, 116, 156);
  }
}
</style>
