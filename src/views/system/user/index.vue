<template>
  <div class="app-container">
    <el-row :gutter="20">
      <splitpanes :horizontal="this.$store.getters.device === 'mobile'" class="default-theme">
        <!--部门数据-->
        <pane size="16">
          <el-col>
            <div class="head-container">
              <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search"
                style="margin-bottom: 20px" />
            </div>
            <div class="head-container">
              <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" v-loading="treeLoading"
                :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                @node-click="handleNodeClick" />
            </div>
          </el-col>
        </pane>
        <!--用户数据-->
        <pane size="84">
          <el-col>
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
              label-width="68px">
              <el-form-item label="员工姓名" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入员工姓名" clearable style="width: 240px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <!-- <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
              </el-col> -->
              <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="batchAdd"
                  v-hasPermi="['system:user:add']">批量新增</el-button>
              </el-col>
            </el-row>

            <el-table v-loading="loading" :data="currentTableData" @selection-change="handleSelectionChange">

              <el-table-column label="员工姓名" align="center" key="员工姓名" prop="员工姓名" :show-overflow-tooltip="true" />
              <el-table-column label="员工角色" align="center" key="角色名称" prop="角色名称" :show-overflow-tooltip="true" />
              <el-table-column label="员工状态" align="center">
                <template slot-scope="scope">
                  <el-tag effect="plain">
                    {{ scope.row.员工状态 }}
                  </el-tag>
                </template>
              </el-table-column>

            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize" @pagination="setCurrentTableData" />
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId"
                  :disabled="item.status == 1"></el-option>
              </el-select>
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
import { delUser } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { initList } from '@/api/record.js'
import { getToken } from '@/utils/auth'

export default {
  name: "User",
  components: { Treeselect, Splitpanes, Pane },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      originalTableData: null,
      currentTableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: '',
        deptId: ''
      },
      title: "",
      deptOptions: undefined,

      open: false,
      deptName: undefined,

      roleOptions: [],
      originaldeptList: [],
      treeLoading: false,
      form: {},
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      departmentList: [],
      mydepartment: [],
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
      }
    };
  },
  watch: {
    deptName(val) {
      if (!val) {
        this.queryParams.userName = ''
        this.originalTableData = null
        this.currentTableData = []
        this.total = 0
      }
      this.$refs.tree && this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getDeptTree();
  },
  methods: {
    getList() {
      let data = {
        DepID: this.queryParams.deptId,
        voidid: 843
      }
      this.loading = true
      initList(data).then(res => {
        if (res.Data) {
          this.originalTableData = res.Data;
          this.total = this.originalTableData.length;
          this.setCurrentTableData();
        } else {
          this.$message.error(res.ErrorInfo);
        }
        this.loading = false
      })
    },
    getdepartment() {
      let data = {
        StaffID: getToken(),
        voidid: 842,
      }
      initList(data).then(res => {
        if (res.Data) {

          const targetIds = res.Data.filter(item => item.角色ID == 1 || item.角色ID == 2).map(item => item['部门ID']);
          // 调用筛选函数
          if (targetIds.includes('1')) {
            this.originaldeptList = this.departmentList;
            this.deptOptions = this.departmentList
            this.treeLoading = false
          } else {
            const filteredData = filterDepartments(this.departmentList, targetIds);
            function filterDepartments(data, ids) {
              let result = [];
              for (let item of data) {
                if (ids.includes(String(item.deptId))) {
                  result.push(item);
                } else if (item.children && item.children.length > 0) {
                  let sub_result = filterDepartments(item.children, ids);
                  result = result.concat(sub_result);
                }
              }
              return result;
            }
            this.originaldeptList = filteredData;
            this.deptOptions = filteredData
            this.treeLoading = false
          }

        } else {
          this.$modal.msgError(res.ErrorInfo);
        }
      })
    },
    getDeptTree() {
      let formData = {
        voidid: 830,
        DepID: '1'
      }
      this.loading = true;
      this.treeLoading = true
      initList(formData).then(res => {
        if (res.Data) {
          this.departmentList = [this.transformData(res.Data[0])]
          this.getdepartment()
        } else {
          this.$modal.msgError(res.ErrorInfo);
        }

        this.loading = false;
      })
    },
    filterDisabledDept(deptList) {
      return deptList.filter(dept => {
        if (dept.disabled) {
          return false;
        }
        if (dept.children && dept.children.length) {
          dept.children = this.filterDisabledDept(dept.children);
        }
        return true;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.queryParams.deptId = data.deptId;
      this.queryParams.pageNum = 1;
      this.queryParams.userName = ''
      this.getList();
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
      };
      this.resetForm("form");
    },
    handleQuery() {
      const keyword = this.queryParams.userName;
      if (!keyword) {
        this.originalTableData = this.TableData;
      } else {
        this.originalTableData = this.filterMenuList(this.TableData, keyword);
      }
      this.total = this.originalTableData.length;
      this.queryParams.pageNum = 1;
      this.setCurrentTableData();
    },
    resetQuery() {

      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    handleUpdate(row) {

    },
    partment(val) {
      // 创建一个Set来存储已经处理过的部门ID
      const processedIds = new Set();
      // 过滤掉重复的部门ID
      const uniqueItems = val.filter(item => {
        if (processedIds.has(item.部门ID)) {
          return false;
        }
        processedIds.add(item.部门ID);
        return true;
      });

      const promises = uniqueItems.map(item => {
        let data = {
          voidid: 830,
          DepID: item.部门ID
        }
        return initList(data).then(res => {
          if (res.Data) {
            this.mydepartment = [...res.Data, ...this.mydepartment];
          }
        });
      });
      return Promise.all(promises);
    },
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {

        }
      });
    },
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    batchAdd() {
      if (!this.queryParams.deptId) {
        this.$modal.msgWarning("请先选择左侧部门再进行新增人员!")
        return
      } else {
        this.$router.push("/system/user-auth/addRole/" + this.queryParams.deptId);
      }
    },
    filterMenuList(menuList, keyword) {
      let result = [];
      menuList.forEach(item => {
        if (item.员工姓名.includes(keyword)) {
          const newItem = { ...item };
          delete newItem.children;
          result.push(newItem);
        } else if (item.children && item.children.length > 0) {
          const filteredChildren = this.filterMenuList(item.children, keyword);
          result = result.concat(filteredChildren);
        }
      });
      return result;
    },
    setCurrentTableData() {
      const startIndex = (this.queryParams.pageNum - 1) * this.queryParams.pageSize;
      const endIndex = startIndex + this.queryParams.pageSize;
      this.currentTableData = this.originalTableData.slice(startIndex, endIndex);
    },
    transformData(data, parentId = 0, ancestors = '0') {
      const newDeptId = parseInt(data["部门ID"])
      const result = {
        "createBy": "admin",
        "deptId": newDeptId,
        "parentId": parentId,
        "ancestors": ancestors,
        "deptName": data["部门名称"],
        "leader": "珞格",
        "children": []
      };
      let subDepts = [];
      if (typeof data["下级部门名称"] === 'string') {
        subDepts = JSON.parse(data["下级部门名称"].replace(/'/g, '"'));
      } else if (Array.isArray(data["下级部门名称"])) {
        subDepts = data["下级部门名称"];
      }
      for (const subDept of subDepts) {
        const newAncestors = `${ancestors},${newDeptId}`;
        const subResult = this.transformData(subDept, newDeptId, newAncestors);
        result.children.push(subResult);
      }
      return result;
    },
    filterArr2ByArr1(arr1, arr2) {
      // 定义一个递归函数来提取所有部门ID
      const extractAllDeptIds = (dept) => {
        const ids = [parseInt(dept.部门ID)];
        if (dept.下级部门名称) {
          let subDepts = [];
          if (typeof dept.下级部门名称 === 'string') {
            subDepts = JSON.parse(dept.下级部门名称.replace(/'/g, '"'));
          } else if (Array.isArray(dept.下级部门名称)) {
            subDepts = dept.下级部门名称;
          }
          for (const subDept of subDepts) {
            ids.push(...extractAllDeptIds(subDept));
          }
        }
        return ids;
      };

      // 提取arr1中的所有部门ID，转换为数字集合
      const allowedIds = new Set();
      for (const dept of arr1) {
        const ids = extractAllDeptIds(dept);
        ids.forEach(id => allowedIds.add(id));
      }

      // 递归处理每个节点的子部门
      const processNode = (node) => {
        // 过滤子部门，只保留允许的ID，并递归处理保留的子部门
        node.children = node.children.filter(child => {
          if (allowedIds.has(child.deptId)) {
            processNode(child); // 处理子部门的children
            return true;
          }
          return false;
        });
      };

      // 遍历arr2中的每个根节点并处理其子部门
      arr2.forEach(root => processNode(root));
      return arr2;
    }
  }
};
</script>