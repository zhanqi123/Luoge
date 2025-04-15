import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import { initList } from '@/api/record.js'

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        let data = {
          voidid: 834,
          MenuID: 0
  
        }
        initList(data).then(res=>{

      
          if(res.Data){
          let routeList=convertMenuData(res.Data[0]).children
         let routeData=transformMenuAtoB(routeList)
          const sdata = JSON.parse(JSON.stringify(routeData))
          const rdata = JSON.parse(JSON.stringify(routeData))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          router.addRoutes(asyncRoutes);
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
          }
        })

        return
        // 向后端请求路由数据
        getRouters().then(res => {
          console.log(res)
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          router.addRoutes(asyncRoutes);
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach(el => {
    el.path = lastRouter ? lastRouter.path + '/' + el.path : el.path
    if (el.children && el.children.length && el.component === 'ParentView') {
      children = children.concat(filterChildren(el.children, el))
    } else {
      children.push(el)
    }
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

function convertMenuData(originalData) {
  // 如果传入的是数组，对数组中的每个元素进行转换
  if (Array.isArray(originalData)) {
    return originalData.map(item => convertMenuData(item));
  }

     
  // 构建新的菜单对象
  const newItem = {
    name: originalData["菜单名称"],
    path: originalData["路由地址"],
    label: originalData["菜单名称"],
    icon: originalData["菜单图标"],
    orderNum: originalData["菜单排序"],
    menuType: originalData["菜单类型"],
    MenuID: parseInt(originalData["上级菜单ID"]),
    hidden: false,
    redirect: "noRedirect",
    component: originalData["组件路径"],
    alwaysShow:  originalData["菜单类型"]=='M'?true:false,
    id: parseInt(originalData["菜单ID"]),
    meta: {
      title: originalData["菜单名称"],
      icon: originalData["菜单图标"],
      noCache: false,
      link: null
    },
    children:  originalData.下级菜单名称.length>0?[]:null
   
  };

  // 检查是否存在下级菜单名称
  if (originalData["下级菜单名称"]) {
    let childrenData;
    if (typeof originalData["下级菜单名称"] === 'string') {
      // 将单引号替换为双引号
      const fixedStr = originalData["下级菜单名称"].replace(/'/g, '"');
      try {
        // 解析字符串为 JSON 对象
        childrenData = JSON.parse(fixedStr);
      } catch (error) {
        console.error('解析下级菜单数据时出错:', error);
        return newItem;
      }
    } else {
      childrenData = originalData["下级菜单名称"];
    }

    // 递归处理下级菜单
    if (Array.isArray(childrenData)) {
      newItem.children = convertMenuData(childrenData);
    }
  }

  return newItem;
}

function transformMenuAtoB(menuA) {
  return menuA.map(item => {
    const isTopLevel = item.MenuID === 0; // 判断是否为顶层菜单

    const transformedItem = {
        name: item.name,
        path: isTopLevel ? `/${item.path}` : item.path,
        label: item.label,
        hidden: item.hidden,
        redirect: item.redirect,
        component: isTopLevel ? 'Layout' : item.component,
        alwaysShow: item.alwaysShow,
        id: item.id,
        meta: {
            title: item.meta.title,
            icon: item.meta.icon,
            noCache: item.meta.noCache,
            link: item.meta.link
        }
    };

    if (item.children && item.children.length > 0) {
        transformedItem.children = transformMenuAtoB(item.children);
    }

    return transformedItem;
});
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default permission
