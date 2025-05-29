<template>
  <!-- 保持原有模板内容不变 -->
  <div v-show="showPage" class="login-container">
    <!-- 全局加载蒙层 -->
    <transition name="fade">
      <div v-if="loading" class="login-loader">
        <!-- 环形加载动画 -->
        <div class="spinner-box">
          <div class="spinner">
            <div class="circle">
              <div class="inner"></div>
            </div>
            <div class="text">登录中...</div>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </transition>
    <!-- admin -->
    <img v-if="isAdmin" src="@/assets/images/login_img/ope.png" class="bg-img" alt="qiyetupian" />
    <!-- platform -->
    <img v-if="!isAdmin" src="@/assets/images/login_img/apli.png" class="bg-img" alt="qiyetupian" />
    <el-form ref="loginForm" :model="loginForm"  class="login-form" auto-complete="on"
      label-position="left">
      <div class="title-container">
        <div class="title-greet">欢迎登录 <span @click="test()">~</span></div>
        <div class="title">{{ title }}</div>
      </div>
      <!-- <div id="login_container" class="qrcode-container"></div> -->
      <div class="iframe-container">
        <iframe class="custom-iframe" 
          frameborder="0"
          scrolling="no" 
          :src="qrCodeUrl" name="dingtalkLogin" ref="loginFrame" >
        </iframe>
      </div>

      <!-- 测试按钮 -->
      <!-- <el-button type="warning" style="
          width: 20%;
          margin-top: 10%;
          padding: 10px 20px;
          font-size: 18px;
          position: absolute;
          top: -5%;
          z-index: 9999;
          left: 3%;" :loading="loading" @click.native.prevent="test()">测试</el-button> -->
      <el-input v-model="input" placeholder="1" style="z-index: 9999;
          left: 53%;    
          position: absolute;
          top: 5%;"></el-input>
    </el-form>
  </div>
</template>

<script>
import { falgLogin } from '@/api/login'

export default {
  name: "Login",
  data() {
    return {
      progress: 0,
      interval: null,
     
      
  
      input: '',
      showPage: false,
      loginForm: {
        username: "admin",
        password: "123456",
        // orgId: "",
      },

      title: '珞格科技发展档案管理系统',
      loading: false,

      redirect: undefined,
      isAdmin: false,
      pollingInterval: null,
     
      bgImg: null, //自定义bg
 
      qrCodeUrl: "",
      loginTmpCode: '',
      url: 'https://oapi.dingtalk.com/connect/qrconnect?appid=dingjzgedsmzjqhxucpj&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=https://erp.hbluoge.com/LoginAPI.aspx?',
      uuid: 'DA' + Date.now() + Math.random().toString(36).substr(2), // 动态生成
      captchaEnabled: false, // 添加验证码开关
        isActive: false, // 新增激活状态标志
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
    handleLogin() {
      // 添加表单验证
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          let formData = new FormData();
          this.loading = true;
          this.progress = 0; // 重置进度条
          formData.append('Token', this.uuid);
          
          this.$store.dispatch("Login", formData).then((res) => {
              if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
            this.startProgress();
            setTimeout(() => {
              this.$router.push({ path: this.redirect || "/" })
                .finally(() => {
                  this.loading = false;
                  clearInterval(this.interval);
                });
            }, 800);
          }).catch((error) => {
            console.error('登录失败:', error);
            this.loading = false;
            this.progress = 0; // 重置进度条
            this.$message.warning('登录失败,请重新钉钉扫码登录');
            // 登录失败，重新初始化钉钉登录
            this.initDingLogin();
          });
        } else {
          this.$message.warning('请完成必填项');
          return false;
        }
      });
    },
    test() {
      // 检查输入是否为空
      if (!this.input.trim()) {
        this.$message.warning('请输入测试用户名');
        return;
      }
      
      let formData = new FormData();
      formData.append('Name', this.input);
      this.loading = true;
      this.progress = 0; // 重置进度条
      
      this.$store.dispatch("testLogin", formData).then((res) => {
          if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
        this.startProgress();
        setTimeout(() => {
          this.$router.push({ path: this.redirect || "/" })
            .finally(() => {
              this.loading = false;
              clearInterval(this.interval);
            });
        }, 800);
      }).catch((error) => {
   
        this.loading = false;
        this.progress = 0; // 重置进度条
        if (this.captchaEnabled) {
          this.getCode();
        }
        this.$message.warning('登录失败,请重新钉钉扫码登录');
        // 登录失败，重新初始化钉钉登录
        this.initDingLogin();
      });
    },
    startProgress() {
      this.progress = 0; // 确保从0开始
      this.interval = setInterval(() => {
        if (this.progress < 95) {
          this.progress += Math.random() * 15;
        } else if (this.progress < 100) {
          this.progress = 100;
          clearInterval(this.interval);
        }
      }, 200);
    },

    initDingLogin() {
      this.qrCodeUrl = this.url + this.uuid;
    },
    loginFalg() {
      let formData = new FormData();
      formData.append('Token', this.uuid);
      falgLogin(formData).then(res => {
        if (res.Data) {
          this.handleLogin();
        }
      });
    },
startPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }

      this.pollingInterval = setInterval(async () => {
        // 检查组件是否仍然激活
        if (!this.isActive) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
          return;
        }

        try {
          let formData = new FormData();
          formData.append('Token', this.uuid);
          const res = await falgLogin(formData);

          if (res.Data) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            await this.handleLogin();
          }
        } catch (error) {
          console.error('轮询请求失败:', error);
          if (!this.pollingInterval && this.isActive) {
            this.startPolling();
          }
        }
      }, 2000);
    }
,
    // 添加缺失的getCode方法
    getCode() {
      // 实现获取验证码的逻辑
      console.log('获取验证码');
    }
  },
  mounted() {
        this.isActive = true; // 标记组件为激活状态
    this.initDingLogin();
    this.startPolling();
  },
   // 新增导航守卫
  beforeRouteLeave(to, from, next) {
    this.isActive = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    next();
  },
  beforeUnmount() {
  this.isActive = false; // 标记组件为非激活状态
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  
  }
};
</script>

<style lang="scss">
.iframe-container {
  width: 300px;
  height: 280px;
  overflow: hidden;
  position: relative; /* 容器设为相对定位 */
}
.custom-iframe{
  width: 400px; 
  height: 400px;
  border: 0;
  position: absolute; 
  /* 通过负边距偏移内容 */
  left: -50px;
  top: -50px;
}

/* 保持原有样式内容不变 */
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
}

.apli-login {
  background-image: url(~@/assets/images/login_img/apli.png);
  background-color: #3176FB;
  background-size: "contain";
}
</style>

<style lang="scss" scoped>
$bg: #01367a;
$dark_gray: #889aa4;
$light_gray: #000;
$color_primary: #356edf;

.mask-box {
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

  ::v-deep .el-button {
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

    .qrcode-container {
      text-align: center;
    }

    .form-input {
      ::v-deep .el-input input {
        border-bottom: solid 1px #a0a3aa;
        padding-right: 68px;
        font-size: 14px;
        text-indent: 5px;
        // text-indent: 16px;
      }
    }

    .login-user,
    .login-password,
    .login-org {
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

/* 按钮动画 */
.el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.loading {
    transform: scale(0.95);
    background: #3176FB !important;
    padding-right: 45px;

    .btn-text {
      opacity: 0.8;
    }
  }
}

.btn-loader {
  position: absolute;
  right: 15px;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 全局加载动画 */
.login-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.96);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-box {
  position: relative;
  width: 120px;
  height: 120px;

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .circle {
      width: 180px;
      height: 80px;
      border-radius: 50%;
      position: relative;
      animation: rotate 2s linear infinite;

      .inner {
        position: absolute;
        width: 64px;
        height: 64px;
        top: 8px;
        left: 8px;
        background: #3176FB;
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
      }
    }

    .text {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      color: #3176FB;
      font-size: 14px;
      letter-spacing: 2px;
    }
  }
}

/* 进度条动画 */
.progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(49, 118, 251, 0.2);
  margin-top: 40px;
  border-radius: 2px;
  overflow: hidden;

  .progress {
    height: 100%;
    background: #3176FB;
    transition: width 0.3s ease-out;
  }
}

/* 动画关键帧 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(0.95);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>