import { login, testlogin,logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
// import defAva from '@/assets/images/profile.jpg'
import defAva from '@/assets/images/profile.png'
const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },


  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {

      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USERNAME: (state, username) => {
      state.username = username; // 设置用户名
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      // const password = userInfo.password
      // const code = userInfo.code
      const token = userInfo
      return new Promise((resolve, reject) => {
        login(token).then(res => {
          if(res.Data.length>0){
            setToken(res.Data[0].StaffID)
            commit('SET_TOKEN', res.Data[0].StaffID)
             commit('SET_NAME',res.Data[0].RealName)
             localStorage.setItem('name', res.Data[0].RealName); // 保存到 localStorage
            //      commit('SET_NAME', res.Data[0].RealName)
            // // commit('SET_NAME', res.Data[0].RealName)
          
          }
        
        
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //测试登录
    testLogin({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      // const password = userInfo.password
      // const code = userInfo.code
      const token = userInfo
      return new Promise((resolve, reject) => {
        testlogin(token).then(res => {
          if(res.Data.length>0){
            setToken(res.Data[0].StaffID)
            commit('SET_TOKEN', res.Data[0].StaffID)
             commit('SET_NAME',res.Data[0].RealName)
             localStorage.setItem('name', res.Data[0].RealName); // 保存到 localStorage
            //      commit('SET_NAME', res.Data[0].RealName)
            // // commit('SET_NAME', res.Data[0].RealName)
          
          }
        
        
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
        
         
            return new Promise((resolve, reject) => {
        getInfo().then(res => {
          
          const user = res.user
          let avatar = user.avatar || ""
          if (!isHttp(avatar)) {
            avatar = (isEmpty(avatar)) ? defAva : process.env.VUE_APP_BASE_API + avatar
          }
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_ID', user.userId)
          const { name } = state;
 
          // commit('SET_NAME', user.userName)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      // resolve()
      return
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        localStorage.removeItem('name'); // 退出时移除

        removeToken()
        resolve()
      })
    }
  }
}

export default user
