<template>
  <div id="app">
    <div id="login_container"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { setToken } from '@/utils/auth'

export default {
  components: {},
  data() {
    return {
      redirect: undefined,
      appid: 'dingjzgedsmzjqhxucpj',
      redirectUrl: 'https://erp.hbluoge.com/LoginAPI.aspx?',
      apiUrl: 'http://localhost:8080/dingTalk/user/dingTalkLogin',
      dingCodeConfig: {
        id: 'login_container',
        style: 'border:none;background-color:#FFFFFF;',
        width: '365',
        height: '400'
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  computed: {
    getRedirectUrl() {
      return encodeURIComponent(this.redirectUrl)
    },
    getAuthUrl() {
      return `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appid}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.getRedirectUrl}`
    },
    getGoto() {
     
      return encodeURIComponent(this.getAuthUrl)
    },
    getDingCodeConfig() {
      return { ...this.dingCodeConfig, goto: this.getGoto }
    }
  },
  created() {
    this.initDingJs()
  },
  mounted() {
    this.addDingListener()
    this.initDingLogin()
    this.getUser()
  },
  methods: {
    initDingJs() {
      !function(window, document) {

        function d(a) {
          var e, c = document.createElement('iframe'),
            d = 'https://login.dingtalk.com/login/qrcode.htm?goto=' + a.goto
          d += a.style ? '&style=' + encodeURIComponent(a.style) : '',
            d += a.href ? '&href=' + a.href : '',
            c.src = d,
            c.frameBorder = '0',
            c.allowTransparency = 'true',
            c.scrolling = 'no',
            c.width = a.width ? a.width + 'px' : '365px',
            c.height = a.height ? a.height + 'px' : '400px',
            e = document.getElementById(a.id),
            e.innerHTML = '',
            e.appendChild(c)
        }

        window.DDLogin = d

      }(window, document)
    },
    addDingListener() {

      let self = this

      let handleLoginTmpCode = function(loginTmpCode) {
        console.log(self.getAuthUrl + `&loginTmpCode=${loginTmpCode}`)
        return
        window.location.href = self.getAuthUrl + `&loginTmpCode=${loginTmpCode}`
      }

      let handleMessage = function(event) {
        if (event.origin == 'https://login.dingtalk.com') {
          console.log('3366699')
          handleLoginTmpCode(event.data)
        }
      }
    
      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', handleMessage, false)
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', handleMessage)
      }

    },
    initDingLogin() {
      window.DDLogin(this.getDingCodeConfig)
    },
    getUser() {
      let getQueryString = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) {
          return unescape(r[2])
        }
        return null
      }
    
      let code = getQueryString('code')
      if (code !== null) {
        axios
          .get(`${this.apiUrl}?code=${code}`).then(response => {

          setToken(response.data.token)
          this.$router.push({ path: this.redirect || '/' }).catch(() => {
          })
          commit('SET_TOKEN', response.data.token)
        })
          .catch(error => {
            console.log(error)
          })

      }

    }

  }
}
</script>


