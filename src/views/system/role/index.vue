<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="角色名称" prop="Keyword">
        <el-input v-model="queryParams.Keyword" placeholder="请输入角色名称" clearable style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:role:add']">新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:role:remove']">删除</el-button>
      </el-col> -->


      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="roleList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="角色编号" prop="roleId" width="120" /> -->
      <el-table-column label="角色名称" prop="角色名称" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true"  /> -->
      <el-table-column label="上级管理角色" prop="上级管理角色" />
      <el-table-column label="是否可编辑" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.是否允许编辑 == '允许'" type="success">{{ scope.row.是否允许编辑 }}</el-tag>
          <el-tag v-else type="danger">{{ scope.row.是否允许编辑 }}</el-tag>
          <!-- <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
            @change="handleStatusChange(scope.row)"></el-switch> -->
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >修改</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDataScope(scope.row)"
            v-hasPermi="['system:role:edit']">菜单权限</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']">删除</el-button> -->
          <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDataScope" icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']">数据权限</el-dropdown-item>
              <el-dropdown-item command="handleAuthUser" icon="el-icon-user"
                v-hasPermi="['system:role:edit']">分配用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />



    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">

          <el-select v-model="form.RoleID" placeholder="请选择角色" disabled>
            <el-option v-for="item in roleList" :key="item.角色ID
              " :label="item.角色名称
                " :value="item.角色ID">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="菜单权限">
          <el-tree class="tree-border" :data="deptOptions" show-checkbox default-expand-all ref="menu" node-key="id"
            :check-strictly="false" empty-text="加载中，请稍候" :props="defaultProps"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus, deptTreeSelect } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { initList } from '@/api/record.js'

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部菜单权限"
        },
        {
          value: "2",
          label: "自定义菜单权限"
        },

      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        Keyword: '',

      },
      // 表单参数
      form: {
        RoleID: ''
      },
      deptList: [],

      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ],
        checkedKeys: [] // 用于存储选中节点的 ID
      },
      checkedMenuIds: null
    };
  },
  created() {
    this.getList();
    this.inData()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      let data = {
        Keyword: this.queryParams.Keyword,
        voidid: 838
      }
      this.loading = true
      initList(data).then(res => {
        if (res.Data) {
          this.roleList = res.Data

          this.loading = false;
        }
      })

    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },




    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
        this.menuNodeAll = false,
        this.deptExpand = true,
        this.deptNodeAll = false,
        this.form = {
          roleId: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: "0",
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined
        };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },



    /** 新增按钮操作 */
    handleAdd() {

    },
    /** 修改按钮操作 */
    handleUpdate(row) {

    },

    /** 分配数据权限操作 */
    handleDataScope(row) {
      console.log(row)
      let data = {
        RoleID: row.角色ID,
        voidid: 840
      }
      initList(data).then(res => {
        let dataArr = res.Data[0].
          可访问菜单.replace(/'/g, '"')
        this.checkedMenuIds = this.collectMenuIds(JSON.parse(dataArr))
        this.form.RoleID = row.角色ID;
        this.openDataScope = true;
        this.title = "分配菜单权限";
        this.$nextTick(() => {
          this.setCheckedMenuIds();
        });


        return
        if (res.Data) {
          this.roleList = res.Data
          this.loading = false;
        }
      })
      return
      this.reset();
      this.form = row
      console.log(this.form)

      this.openDataScope = true;
      this.title = "分配菜单权限";
      return
      const deptTreeSelect = this.getDeptTree(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          deptTreeSelect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
      });
      this.title = "分配数据权限";
    },
    /** 分配用户操作 */
    handleAuthUser: function (row) {
      const roleId = row.roleId;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    /** 提交按钮 */

    /** 提交按钮（数据权限） */
    submitDataScope: function () {

      const checkedKeys = this.$refs.menu.getCheckedKeys();
      // 获取半选节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();

      // 合并两者
      const allKeys = [...checkedKeys, ...halfCheckedKeys];
      let data = {
        MenuID: allKeys.join(','),
        RoleID: this.form.RoleID,
        voidid: 839
      }
      initList(data).then(res => {
        if (res.Data) {
          this.$message.success('提交成功')
          this.openDataScope = false

        }
      })

      console.log('所有选中节点（包含半选）:', allKeys);
      // console.log(console.log(this.$refs.menu.getCheckedKeys()))
      return

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？').then(function () {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    inData() {
      let data = {
        voidid: 834,
        MenuID: 0

      }
      initList(data).then(res => {
        if (res.Data) {
          this.deptOptions = this.convertMenuData(res.Data[0]).children
        } else {

        }
      })

    },
    convertMenuData(originalData) {
      // 如果传入的是数组，对数组中的每个元素进行转换
      if (Array.isArray(originalData)) {
        return originalData.map(item => this.convertMenuData(item));
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
        alwaysShow: true,
        id: parseInt(originalData["菜单ID"]),
        meta: {
          title: originalData["菜单名称"],
          icon: originalData["菜单图标"],
          noCache: false,
          link: null
        },
        children: []
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
          newItem.children = this.convertMenuData(childrenData);
        }
      }

      return newItem;
    },

    collectMenuIds(menuArray) {
      let ids = [];

      // 递归遍历函数
      const traverse = (menus) => {
        menus.forEach(menu => {
          // 添加当前菜单ID
          if (menu['菜单ID']) {
            ids.push(menu['菜单ID']);
          }

          // 递归处理下级菜单
          if (menu['下级菜单名称'] && menu['下级菜单名称'].length > 0) {
            traverse(menu['下级菜单名称']);
          }
        });
      };

      traverse(menuArray);
      return ids.join(', '); // 用逗号和空格分隔
    },
    setCheckedMenuIds() {

      if (this.$refs.menu) {
        const menuIds = this.checkedMenuIds.split(', ').map(Number);
        menuIds.forEach(id => {
          this.$refs.menu.setChecked(id, true, false);
        });
      }
    },




  }
};
</script>