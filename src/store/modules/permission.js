import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";
import { initList } from "@/api/record.js";
import store from "@/store"; // 引入 store

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes);
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      state.topbarRouters = routes;
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes;
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        let data = { voidid: 841, StaffID: store.state.user.token };
        initList(data).then((res) => {
          if (res.Data) {
            // 解析 arr1 的"可访问菜单"字段
            const accessibleMenusStr= res.Data[0].可访问菜单;

            const accessibleMenus = JSON.parse(
              accessibleMenusStr.replace(/'/g, '"')
            );
       
            const accessibleMenus1 = [
              {
                菜单ID: "47",
                菜单名称: "项目管理11",
                下级菜单名称: [
                  {
                    菜单ID: "61",
                    菜单名称: "归属管理",
                    下级菜单名称: [
                
                      {
                        菜单ID: "54",
                        菜单名称: "子部门/项目组",
                        下级菜单名称: [],
                        组件路径: "project/affiliation/depProject",
                        菜单图标: "build",
                        菜单类型: "C",
                        菜单排序: "2",
                        路由地址: "depProject",
                        菜单状态: "0",
                        显示状态: "0",
                        缓存状态: "0",
                        权限字符: "0",
                        上级菜单ID: "61",
                      },
                    ],
                    组件路径: "project/affiliation",
                    菜单图标: "build",
                    菜单类型: "M",
                    菜单排序: "1",
                    路由地址: "affiliation",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "47",
                  },
                  {
                    菜单ID: "48",
                    菜单名称: "报告负责人",
                    下级菜单名称: [],
                    组件路径: "project/pigeonhole/pigeonholeIndex",
                    菜单图标: "build",
                    菜单类型: "C",
                    菜单排序: "1",
                    路由地址: "pigeonhole",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "47",
                  },

                  {
                    菜单ID: "51",
                    菜单名称: "测评组长",
                    下级菜单名称: [],
                    组件路径: "project/leader/leaderIndex",
                    菜单图标: "color",
                    菜单类型: "C",
                    菜单排序: "2",
                    路由地址: "leader",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "47",
                  },
                ],
                组件路径: "",
                菜单图标: "drag",
                菜单类型: "M",
                菜单排序: "1",
                路由地址: "project",
                菜单状态: "0",
                显示状态: "0",
                缓存状态: "0",
                权限字符: "0",
                上级菜单ID: "0",
              },
              {
                菜单ID: "26",
                菜单名称: "归档管理",
                下级菜单名称: [
                  {
                    菜单ID: "27",
                    菜单名称: "我的归档列表",
                    下级菜单名称: [],
                    组件路径: "record/courseList",
                    菜单图标: "edit",
                    菜单类型: "C",
                    菜单排序: "0",
                    路由地址: "courseList",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "26",
                  },
                  {
                    菜单ID: "29",
                    菜单名称: "过程文件审核",
                    下级菜单名称: [],
                    组件路径: "record/courseAudit",
                    菜单图标: "clipboard",
                    菜单类型: "C",
                    菜单排序: "1",
                    路由地址: "courseAudit",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "26",
                  },
                  {
                    菜单ID: "30",
                    菜单名称: "档案入库提交",
                    下级菜单名称: [],
                    组件路径: "record/warehouseSubmit",
                    菜单图标: "nested",
                    菜单类型: "C",
                    菜单排序: "2",
                    路由地址: "warehouseSubmit",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "26",
                  },
                  {
                    菜单ID: "31",
                    菜单名称: "档案入库",
                    下级菜单名称: [],
                    组件路径: "record/warehouse",
                    菜单图标: "form",
                    菜单类型: "C",
                    菜单排序: "4",
                    路由地址: "warehouse",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "26",
                  },
                  {
                    菜单ID: "32",
                    菜单名称: "归档文件审核",
                    下级菜单名称: [],
                    组件路径: "record/fileAudit",
                    菜单图标: "validCode",
                    菜单类型: "C",
                    菜单排序: "4",
                    路由地址: "fileAudit",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "26",
                  },
                  {
                    菜单ID: "44",
                    菜单名称: "部门归档列表",
                    下级菜单名称: [],
                    组件路径: "record/courseDepartment",
                    菜单图标: "tree-table",
                    菜单类型: "C",
                    菜单排序: "4",
                    路由地址: "courseDepartment",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "26",
                  },
                ],
                组件路径: "",
                菜单图标: "build",
                菜单类型: "M",
                菜单排序: "2",
                路由地址: "record",
                菜单状态: "0",
                显示状态: "0",
                缓存状态: "0",
                权限字符: "0",
                上级菜单ID: "0",
              },
              {
                菜单ID: "52",
                菜单名称: "系统用户管理",
                下级菜单名称: [
                  {
                    菜单ID: "53",
                    菜单名称: "人员列表",
                    下级菜单名称: [],
                    组件路径: "system/user/index",
                    菜单图标: "qq",
                    菜单类型: "C",
                    菜单排序: "0",
                    路由地址: "user",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "52",
                  },
                ],
                组件路径: "",
                菜单图标: "peoples",
                菜单类型: "M",
                菜单排序: "4",
                路由地址: "system/user",
                菜单状态: "0",
                显示状态: "0",
                缓存状态: "0",
                权限字符: "0",
                上级菜单ID: "0",
              },
              {
                菜单ID: "33",
                菜单名称: "台账管理",
                下级菜单名称: [
                  {
                    菜单ID: "34",
                    菜单名称: "档案列表",
                    下级菜单名称: [],
                    组件路径: "Standing/index",
                    菜单图标: "build",
                    菜单类型: "C",
                    菜单排序: "0",
                    路由地址: "StandingIndex",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "33",
                  },
                ],
                组件路径: "",
                菜单图标: "date-range",
                菜单类型: "M",
                菜单排序: "5",
                路由地址: "Standing",
                菜单状态: "0",
                显示状态: "0",
                缓存状态: "0",
                权限字符: "0",
                上级菜单ID: "0",
              },
              {
                菜单ID: "12",
                菜单名称: "系统管理",
                下级菜单名称: [
                  {
                    菜单ID: "18",
                    菜单名称: "角色管理",
                    下级菜单名称: [],
                    组件路径: "system/role/index",
                    菜单图标: "peoples",
                    菜单类型: "C",
                    菜单排序: "1",
                    路由地址: "role",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "12",
                  },
                  {
                    菜单ID: "21",
                    菜单名称: "菜单管理",
                    下级菜单名称: [],
                    组件路径: "system/menu/index",
                    菜单图标: "tree-table",
                    菜单类型: "C",
                    菜单排序: "1",
                    路由地址: "menu",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "12",
                  },
                  {
                    菜单ID: "20",
                    菜单名称: "部门管理",
                    下级菜单名称: [],
                    组件路径: "system/dept/index",
                    菜单图标: "tree",
                    菜单类型: "C",
                    菜单排序: "2",
                    路由地址: "dept",
                    菜单状态: "0",
                    显示状态: "0",
                    缓存状态: "0",
                    权限字符: "0",
                    上级菜单ID: "12",
                  },
                ],
                组件路径: "",
                菜单图标: "system",
                菜单类型: "M",
                菜单排序: "7",
                路由地址: "system",
                菜单状态: "0",
                显示状态: "0",
                缓存状态: "0",
                权限字符: "0",
                上级菜单ID: "0",
              },
            ];
        
            // 转换菜单结构
           
            const convertedMenus = convertMenuData(accessibleMenus1);
            const routeData = transformMenuAtoB(convertedMenus);

            // 后续处理与 arr2 相同
            const sdata = JSON.parse(JSON.stringify(routeData));
            const rdata = JSON.parse(JSON.stringify(routeData));
            const sidebarRoutes = filterAsyncRouter(sdata);

            const rewriteRoutes = filterAsyncRouter(rdata, false, true);
 
            const asyncRoutes = filterDynamicRoutes(dynamicRoutes);

            rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });

            router.addRoutes(asyncRoutes);

            commit("SET_ROUTES", rewriteRoutes);
            commit("SET_SIDEBAR_ROUTERS", constantRoutes.concat(sidebarRoutes));
            commit("SET_DEFAULT_ROUTES", sidebarRoutes);
            commit("SET_TOPBAR_ROUTES", sidebarRoutes);

            resolve(rewriteRoutes);
          }
        });
      });
    },
  },
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (route.component === "InnerLink") {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el) => {
    el.path = lastRouter ? lastRouter.path + "/" + el.path : el.path;
    if (el.children && el.children.length && el.component === "ParentView") {
      children = children.concat(filterChildren(el.children, el));
    } else {
      children.push(el);
    }
  });
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = [];
  routes.forEach((route) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

function convertMenuData(originalData) {
  if (Array.isArray(originalData)) {
    return originalData.map(item => convertMenuData(item));
  }

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
    alwaysShow: originalData["菜单类型"] == "M" ? true : false,
    id: parseInt(originalData["菜单ID"]),
    meta: {
      title: originalData["菜单名称"],
      icon: originalData["菜单图标"],
      noCache: false,
      link: null,
    },
    children: originalData.下级菜单名称.length > 0 ? [] : null,
  };

  // 设置 component 字段
  if (originalData["组件路径"]) {
    newItem.component = originalData["组件路径"];
  }

  if (originalData["下级菜单名称"]) {
    let childrenData;
    if (typeof originalData["下级菜单名称"] === "string") {
      try {
        childrenData = JSON.parse(originalData["下级菜单名称"].replace(/'/g, '"'));
      } catch (e) {
        console.error("解析下级菜单失败:", e);
        return newItem;
      }
    } else {
      childrenData = originalData["下级菜单名称"];
    }
     console.log("childrenData:", childrenData);
    if (Array.isArray(childrenData)) {
      newItem.children = convertMenuData(childrenData);
    }
  }

  return newItem;
}

function transformMenuAtoB(menuA) {
  return menuA.map((item) => {
    const isTopLevel = item.MenuID === 0;

    const transformedItem = {
      name: item.name,
      path: isTopLevel ? `/${item.path}` : item.path,
      label: item.label,
      hidden: item.hidden,
      redirect: item.redirect,
      component: isTopLevel ? "Layout" : item.component || "ParentView", // ✅ 添加 component
      alwaysShow: item.alwaysShow,
      id: item.id,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        noCache: item.meta.noCache,
        link: item.meta.link,
      },
    };

    if (item.children && item.children.length > 0) {
      transformedItem.children = transformMenuAtoB(item.children);
    }

    return transformedItem;
  });
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === "development") {
    return (resolve) => require([`@/views/${view}`], resolve);
  } else {
    return () => import(`@/views/${view}`);
  }
};

export default permission;
