<template>
  <div v-show="showPage" class="login-container">
    <!-- admin -->
    <img
      v-if="isAdmin"
      src="@/assets/images/login_img/ope.png"
      class="bg-img"
      alt="qiyetupian"
    
    />
    <!-- platform -->
    <img
      v-if="!isAdmin"
      src="@/assets/images/login_img/apli.png"
      class="bg-img"
      alt="qiyetupian"
     
    />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <div class="title-greet">欢迎登录~</div>
        <div class="title">{{ title }}</div>
      </div>
      <div id="login_container" class="qrcode-container"></div>
      <!-- <el-form-item prop="username" class="form-input">
        
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          placeholder-style="color: #C3C3C3"
          @keyup.enter.native="handleLogin"
        >
     
        <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      
      </el-form-item>
      <el-form-item prop="password" class="form-input">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          placeholder-style="color: #C3C3C3"
          @keyup.enter.native="handleLogin"
        >
        <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />

       
        </el-input>
      
      </el-form-item>

      <el-button
        type="primary"
        style="
          width: 100%;
          margin-top: 10%;
          padding: 10px 20px;
          font-size: 18px;
        "
        :loading="loading"
        @click.native.prevent="handleLogin"
        >登录</el-button
      > -->
      <!-- <el-button
        type="warning"
        style="
          width: 20%;
          margin-top: 10%;
          padding: 10px 20px;
          font-size: 18px;
          position: absolute;
          top: -5%;

          z-index: 9999;
          left: 3%;
        "
        :loading="loading"
        @click.native.prevent="handleLogin"
        >登录</el-button
      > -->
    </el-form>
   

    <!-- <el-button type="primary" @click="handleScanQrCode">扫码登录</el-button> -->
     
  </div>
</template>
<script>
//   import { getOrgList } from "@/api/system/org.js";
//   import { getInfoByTenantcode } from "@/api/user";
//   import { title } from "@/settings";
import Cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    var checkPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码！"));
      } else {
        callback();
      }
    };
    return {
      isResetPwd:false, // 是否弹出重置密码
      strength: 6, // 密码强度
      ruleForm: {
        password: "",
      },
      rules: {
        password: [{ validator: checkPassWord, trigger: "blur" }],
      },
      showPage: false,
      loginForm: {
        username: "admin",
        password: "123456",
        // orgId: "",
      },
   
      title:'珞格科技发展档案管理系统',
      loading: false,
      passwordType: "password",
      redirect: undefined,
      isAdmin: false,
      orgOptions: [],
      bgImg: null, //自定义bg
      loginRules: {
          username: [
            { required: true, trigger: "blur", message: "请输入您的用户名" }
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入您的密码" }
          ],
          code: [{ required: true, trigger: "change", message: "请输入验证码" }]
        },
        qrCodeUrl: "https://oapi.dingtalk.com/connect/qrconnect?appid=dingjzgedsmzjqhxucpj&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=https://erp.hbluoge.com/LoginAPI.aspx?",
        loginTmpCode: null
    };
  },
  watch: {
   
    
  },
  created() {
    if (
      this.$route.query.token != undefined &&
      this.$route.query.token != null
    ) {
      const RsaLoginForm = {
        ...this.loginForm,
        token: this.$route.query.token,
      };
      this.$store
        .dispatch("user/login", RsaLoginForm)
        .then(() => {
          this.$router.push({
            path: "/",
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    } else {
      this.showPage = true;
    }
  },
  methods: {
 

    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleResetPwd() {
      sessionStorage.setItem("roleKey", this.$route.params.roleKey);
      this.$router.push({
        path: "/resetPwd",
        query: {
          tenantCode: this.$route.params.roleKey,
        },
      });
    },
    handleLogin() {
      // this.$refs.loginForm.validate((valid) => {
      //   if (valid) {
      //     this.loading = true;
      //     if (this.isAdmin) {
      //       delete this.loginForm.orgId;
      //       localStorage.setItem("navLogo", "");
      //     }
      //     const RsaLoginForm = {
      //       ...this.loginForm,
      //       password: this.$md5(this.loginForm.password),
      //     };
      //     this.$store
      //       .dispatch("user/login", RsaLoginForm)
      //       .then(() => {
      //         this.$router.push({
      //           path: "/",
      //         });
      //         this.loading = false;
      //       })
      //       .catch(() => {
      //         this.loading = false;
      //       });
      //   }
      // });
          
      this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.loginForm.rememberMe) {
              Cookies.set("username", this.loginForm.username, { expires: 30 });
              Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
              Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
            } else {
              Cookies.remove("username");
              Cookies.remove("password");
              Cookies.remove('rememberMe');
            }
            this.$store.dispatch("Login", this.loginForm).then(() => {
              this.loading = true;
              
              this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
            }).catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
          }
        });
      
    },
    back() {
      this.isResetPwd = false
    },
    initDingLogin() {
        const obj = window.DDLogin({
          id: "login_container",
          goto: encodeURIComponent(this.qrCodeUrl),
          style: "border:none;background-color:#FFFFFF;  text-align: center;",
          width: "300",
          height: "400",
          
        });
      },
      handleDingMessage(event) {
         
        if (event.origin !== "https://login.dingtalk.com") return;
        this.loginTmpCode = event.data;
        console.log(this.loginTmpCode)
        this.handleLoginWithCode();
      },
      handleLoginWithCode() {
       this.handleLogin()
        return
        // 调用后端接口，携带loginTmpCode获取用户信息
        this.$store.dispatch("LoginByDingTalk", { code: this.loginTmpCode })
          .then(() => {
            this.$router.push({ path: '/' });
          });
      }
  },
  mounted() {
      this.initDingLogin();
      window.addEventListener('message', this.handleDingMessage);
    },
};
</script>
<style lang="scss">
$bg: #fff;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: relative;
  background-repeat: no-repeat;
  background-color: #3176FB;
  overflow: hidden;
  box-sizing: border-box;
  .bg-img {
    position: absolute;
    margin: auto;
    top: -9999px;
    right: -9999px;
    bottom: -9999px;
    left: -9999px;
    width: 100%;
  }

  .el-input {
    display: inline-block;
    height: 37px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      height: 37px;
      line-height: 37px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border-radius: 5px;
    color: #454545;
  }
}

.admin-login {
  background-image: url(~@/assets/images/login_img/ope.png);
  background-color: #3176FB;
  background-color:  #3176FB;;
}

.apli-login {
  background-image: url(~@/assets/images/login_img/apli.png);
  background-color: #3176FB;;
  background-color:  #3176FB;;
  background-size: "contain";
}
</style>
<style lang="scss" scoped>
$bg: #01367a;
$dark_gray: #889aa4;
$light_gray: #000;
$color_primary: #356edf;
.mask-box{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
}
.reset-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  width: 356px;
  .tips-title {
    font-size: 13px;
    color: rgb(255, 149, 2);
    display: block;
    width: 100%;
    text-align: center;
    padding-bottom: 14px;
  }

  ::v-deep .el-form-item {
    margin-bottom: 8px;
  }
  .new-password {
    border: 1px solid #f1f1f1;
    border-radius: 4px;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .bg-color {
    display: flex;
    align-items: center;
    margin-top: 18px;
    li {
      width: 42px;
      height: 8px;
      border: 1px solid #f9f9f9;
    }
    .hong {
      background-color: #f10000;
    }
    .cheng {
      background-color: rgb(255, 149, 2);
    }
    .huang {
      background-color: rgb(255, 255, 31);
    }
    .lv {
      background-color: rgb(118, 255, 54);
    }
    .qing {
      background-color: rgb(0, 226, 84);
    }
  }
  ::v-deep .el-button{
    height: 30px;
    line-height: 0px;
    font-size: 14px;

  }
}
.login-container {
  position: relative;

  .login-form {
    position: fixed;
    right: 18%;
    top: 18%;
    // width: 23%;
    min-width: 280px;
    /* 高度修改 */
    height: 60%;
    padding: 4% 3%;
    overflow: hidden;
    background: #fff;
    border-radius: 10px;
    min-height: 360px;
    // display: flex; 
justify-content: center; 
align-items: center; 
.qrcode-container{
  text-align: center;
}
    .form-input {
      ::v-deep .el-input input {
        border-bottom: solid 1px #a0a3aa;
        padding-right: 68px;
        font-size: 14px;
        text-indent:5px;
        // text-indent: 16px;
      }
    }

    .login-user,
    .login-password,
    .login-org {
      color: #3176FB !important;
      color: #3176FB !important;
    }
  }

  .tips {
    font-size: 14px;
    color: #000;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title-greet {
      font-size: 15px;
      font-weight: 600;
      height: 16px !important;
      margin-bottom: 16px;
    }

    .title {
      font-size: 15px;
      color: #3176FB;
      color: #3176FB;
      margin: 0 auto 10% auto;
      font-weight: bold;
      letter-spacing: 3px;
      height: 16px !important;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .password-error {
    color: red;
    font-size: 12px;
  }
}
</style>
