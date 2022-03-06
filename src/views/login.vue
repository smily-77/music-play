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
        <!-- <van-field
          v-model="password"
          placeholder="请输入密码"
          :right-icon="closePassword"
          @click-right-icon="closePasswordBtn"
        >
        </van-field> -->
        <van-field
          v-model="captcha"
          placeholder="请输入验证码"
          :rules="captchaRules"
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
          :disabled="submitButton"
          @click="submit"
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
import { Notify } from "vant";
export default {
  name: "Login",
  data() {
    return {
      // 手机号码
      mobile: "",
      // 验证码
      captcha: "",
      // 登录按钮是否有效
      submitButton: true,
      // 验证码按钮的显示和隐藏
      showButton: false,
      closePhone: "",
      closeCaptcha: "",
      //控制验证码按钮文字的不同显示
      countdown: true,
      count: "",
      text: "发送验证码",
      // 校验手机号码
      telRules: [
        {
          required: true,
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
              // phoneSign.value = true;
              this.showButton = false;
              return "请输入正确格式的手机号码";
            } else {
              // 校验手机号是否注册过
              let params = {
                phone: value,
              };
              const res = await global.api.IsRegister(params);
              if (res.code === 200 && res.exist < 0) {
                this.showButton = false;
                // 清空
                this.captcha = "";
                return "手机号未注册";
              }
              // phoneSign.value = true;
              // showButton.value = true;
              this.showButton = true;
              return true;
            }
          },
        },
      ],
      captchaRules: [
        {
          required: true,
        },
      ],
    };
  },
  methods: {
    async submit() {
      // 表单预验证
      this.$refs.form
        .validate()
        .then(() => {
          // 验证通过
          let loginParams = {
            phone: this.mobile,
            captcha: this.captcha,
          };
          const p = global.api.PhoneLogin(loginParams);
          p.then((res) => {
            console.log("执行成功", res);
            if (res.code != 200) {
              Notify({ type: "danger", message: res.message });
            } else {
              Notify({ type: "success", message: "登录成功" });
              //1.登录成功后把token保存到sessionStorage中
              //1.1除了登录之外的所有API接口，必须在登陆之后才能访问
              // 1.2token只在当前网站打开期间生效，所以必须将token保存在sessionStorage中
              sessionStorage.setItem("token", res.token);
              // 2.通过编程式导航跳转页面 路由地址  /recommend
              this.$router.push("/recommend");
            }
          });
          p.catch((err) => {
            console.log(err);
            Notify({ type: "danger", message: "验证码错误" });
          });
        })
        .catch(() => {
          //验证失败
          Notify({ type: "danger", message: "数据校验失败" });
        });
    },
    closePhoneBtn() {
      this.mobile = "";
    },
    closeCaptchaBtn() {
      this.captcha = "";
    },
    
// 获取登录验证码
    async getCaptcha() {
      this.captcha = "";
      // 发送验证码请求
      let params = {
        phone: this.mobile,
      };
      const res = await global.api.sendCode(params);
      if (res.code === 200)
        // 验证码已发送, 是否给用户提示？
        console.log(res);

      const TIME_COUNT = 60;
      let timer = "";
      if (!timer) {
        this.count = TIME_COUNT;
        this.countdown = false;
        this.text = "重新发送";
        timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.countdown = true;
            clearInterval(timer);
            timer = null;
          }
        }, 1000);
      }
    },
  },
  watch: {
    mobile(value) {
      if (value != "") this.closePhone = "close";
      else {
        this.closePhone = "";
        this.captcha = "";
        this.countdown = true;
        this.text = "发送验证码";
      }
    },
    captcha(value) {
      if (value && this.showButton) {
        this.submitButton = false;
      } else {
        this.submitButton = true;
      }
      if (value != "") this.closeCaptcha = "close";
      else this.closeCaptcha = "";
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
  .button {
    color: rgb(52, 116, 156);
  }
}
</style>
