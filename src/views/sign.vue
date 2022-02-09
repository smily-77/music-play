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
          :rules="loginRules.passwordRules"
          validate-trigger="onBlur"
          :right-icon="closePassword"
          @click-right-icon="closePasswordBtn"
        >
        </van-field>
        <van-field
          v-model="nickname"
          placeholder="请输入昵称"
          :rules="loginRules.nicknameRules"
          validate-trigger="onBlur"
          :right-icon="closeNickname"
          @click-right-icon="closeNicknameBtn"
        >
        </van-field>
        <van-field
          v-model="captcha"
          placeholder="请输入验证码"
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
    </div>
  </div>
</template>
<script>
import { ref, watch, reactive } from "vue";
import { Notify } from "vant"
export default {
  name: "Sign",
  setup() {
    // 表单绑定数据
    const phone = ref("");
    const password = ref("");
    const nickname = ref("");
    const captcha = ref("");
    // 表单清除按钮的控制
    const closePhone = ref("");
    const closePassword = ref("");
    const closeNickname = ref("");
    const closeCaptcha = ref("");
    //控制验证码按钮文字的不同显示
    const countdown = ref(true);
    // 验证码按钮的显示和隐藏
    const showButton = ref(false);
    const text = ref("发送验证码");
    // 验证码倒计时
    const count = ref("");
    // 注册按钮禁用F
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
          validator: (value) => {
            return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
              value
            );
          },
          message: "请输入正确格式的手机号码",
        },
        {
          // 验证手机号是否已经注册过
          validator: async (value) => {
            let params = {
              phone: value
            }
            const res = await global.api.IsRegister(params);
            if (res.code === 200 && res.exist === 2)
              // 手机号已注册过
              return false
            return true
          },
          message: "手机号已经被注册过"
        }
      ],
      passwordRules: [
        {
          required: true,
          message: "请输入密码"
        },
      ],
      nicknameRules: [
        {
          required: true,
          message: "请输入昵称"
        },
      ],
      captchaRules: [
        {
          required: true,
          message: "请输入验证码"
        },
      ],
    });

    function closePhoneBtn() {
      phone.value = "";
    }
    function closePasswordBtn() {
      password.value = "";
    }
    function closeNicknameBtn() {
      nickname.value = "";
    }
    function closeCaptchaBtn() {
      captcha.value = "";
    }

    /**
     * 发送验证码, 开启定时
     */
    async function getCaptcha() {
      captcha.value = "";
      // 发送验证码请求
      let params = {
        phone: phone.value
      }
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
          captcha: captcha.value
      }
      const res = global.api.PhoneRegister(registerParams)
      if (res.code != 200) {
          Notify({ type: 'danger', message: res.message});
      } else {
        Notify({ type: 'success', message: '注册成功'})
      }
    }

    watch(
      () => [phone.value, password.value, nickname.value, captcha.value],
      () => {
        if (phone.value && password.value && nickname.value) {
          countdown.value = true;
          if (captcha.value) {
            submitButton.value = false;
          }
        } else {
          countdown.value = false;
        }

        if (phone.value != "") {
          showButton.value = false;
          let validate =
            /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
              phone.value
            );
          if (validate) {
            showButton.value = true;
          }
          closePhone.value = "close";
        } else {
          closePhone.value = "";
          showButton.value = false;
        }
        // 表单清空
        if (password.value != "") closePassword.value = "close";
        else closePassword.value = "";
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
      closePassword,
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
      closePasswordBtn,
      closeNicknameBtn,
      closeCaptchaBtn,
      getCaptcha,
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
}
</style>
