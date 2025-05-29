<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="NewMenuName">
        <el-input v-model="queryParams.NewMenuName" placeholder="请输入菜单名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:menu:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="id" :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.meta.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <!-- <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column prop="status" label="菜单类型">
        <template slot-scope="scope">

          <span v-if="scope.row.menuType == 'M'">目录</span>
          <span v-if="scope.row.menuType == 'C'">菜单</span>

        </template>
      </el-table-column>
      <el-table-column prop="path" label="组件地址" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="MenuID">
              <treeselect v-model="form.MenuID" :options="menuOptions" :normalizer="normalizer" :show-count="true"
                placeholder="选择上级菜单" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <!-- <el-radio label="F">按钮</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.icon" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" style="width: 25px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="NewMenuName">
              <el-input v-model="form.NewMenuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              <span slot="label">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由参数
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <span slot="label">
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
   
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import { initList } from '@/api/record.js'

export default {
  name: "Menu",
  // dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 原始菜单列表数据
      originalMenuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        NewMenuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {
        MenuID: '',
        NewMenuName: '',
        component: '',
        icon: '',
        menuType: '',
        orderNum: '',
        path: '',
        status: '',
        visible: '',
        isCache: '',
        perms: '',
      },
      // 表单校验
      rules: {
        NewMenuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        // orderNum: [
        //   { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        // ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ],
        component: [
          { required: true, message: "组件路径不能为空", trigger: "blur" }
        ],
        MenuID: [
          { required: true, message: "上级菜单不能为空", trigger: "blur" }
        ],
        menuType: [
          { required: true, message: "菜单类型不能为空", trigger: "change" }
        ]
      },
    };
  },
  created() {
  },
  mounted() {
    setTimeout(() => {
      this.getList();
    }, 300);
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      let data = {
        voidid: 834,
        MenuID: 0
      };
      initList(data).then(res => {
        if (res.Data) {
          this.menuList = this.convertMenuData(res.Data[0]).children;
          this.originalMenuList = [...this.menuList];
        } else {
          this.$modal.msgError(res.ErrorInfo);
        }
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      this.menuOptions = [];
      const menu = { id: 0, name: '主类目', children: [] };
      menu.children = this.menuList;
      this.menuOptions.push(menu);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        MenuID: '',
        NewMenuName: '',
        component: '',
        icon: '',
        menuType: '',
        orderNum: '',
        path: '',
        status: '',
        visible: '',
        isCache: '',
        perms: '',
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      const keyword = this.queryParams.NewMenuName;
      if (!keyword) {
        this.menuList = [...this.originalMenuList];
        return;
      }
      this.menuList = this.filterMenuList(this.originalMenuList, keyword);
    },
    /** 递归筛选菜单列表 */
    filterMenuList(menuList, keyword) {
      let result = [];
      menuList.forEach(item => {
        if (item.name.includes(keyword)) {
          // 复制当前菜单项，避免引用父级菜单
          const newItem = { ...item };
          // 清空父级信息
          delete newItem.children;
          result.push(newItem);
        } else if (item.children && item.children.length > 0) {
          const filteredChildren = this.filterMenuList(item.children, keyword);
          result = result.concat(filteredChildren);
        }
      });
      return result;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.menuList = [...this.originalMenuList];
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.MenuID = row.id;
      } else {
        this.form.MenuID = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {

        console.log(row)
      this.reset();
      this.getTreeselect();
      this.form = {
        MenuID: row.MenuID,
        id:row.id,
        NewMenuName: row.name,
        component: row.component,
        icon: row.icon,
        menuType: row.menuType,
        orderNum: row.orderNum,
        path: row.path,
        status: row.status,
        visible: row.visible,
        isCache: row.isCache,
        perms: row.perms,
      };
      this.open = true;
      this.title = "修改菜单";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            // MenuID: this.form.MenuID,
            MenuID: this.title == "添加菜单" ? this.form.MenuID : this.form.id,
            NewMenuName: this.form.NewMenuName,
            component: this.form.component,
            icon: this.form.icon,
            menuType: this.form.menuType,
            orderNum: this.form.orderNum,
            path: this.form.path,
            status: "0",
            visible: "0",
            isCache: '0',
            perms: 0,
            voidid: this.title == "添加菜单" ? 835 : 836
          };
          initList(data).then(res => {
            if (res.Data) {
              this.title == "添加菜单" ? this.$modal.msgSuccess("新增成功") : this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.$modal.msgError(res.ErrorInfo);
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.name + '"的菜单？').then(() => {
        let data = {
          MenuID: row.id,
          voidid: 837
        };
        initList(data).then(res => {
          if (res.Data) {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          } else {
            this.$modal.msgError(res.ErrorInfo);
          }
        });
      }).catch(() => {});
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
  },
};
</script>    