<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>


    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="deptOptions" row-key="deptId"
      :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="deptName" label="部门名称"></el-table-column>

      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" class="update" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button size="mini" type="text" class="add" icon="el-icon-plus" @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button v-if="scope.row.parentId != 0" size="mini" class="delete" type="text" icon="el-icon-delete"
            @click="handleDelete(scope.row)" v-hasPermi="['system:dept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :disabled="form.deptId != undefined" :options="deptOptions"
                :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
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
import { initList } from '@/api/record.js'
import { getToken } from '@/utils/auth'


export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      originaldeptList: [],
      mydepartment: [],
      departmentList: [], //所有部门数据
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        deptName: undefined,

      },
      departmentId: null,
      // 表单参数
      form: {
        parentId: null,
        deptName: '',

      },
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],

      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      let formData = new FormData();
      formData = {
        voidid: 830,
        DepID: '1'
      }
      this.loading = true;
      initList(formData).then(res => {
        if (res.Data) {
          this.departmentList = [this.transformData(res.Data[0])]
          this.getdepartment()
        }
        else {
          this.$modal.msgError(res.ErrorInfo);
        }
        this.loading = false;
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.queryParams.deptName = ''
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      const keyword = this.queryParams.deptName;
      if (!keyword) {
        this.deptOptions = [...this.originaldeptList];
        return;
      }
      this.deptOptions = this.filterMenuList(this.originaldeptList, keyword);
      // this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deptName = ''
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      console.log(row, '666')
      this.reset();
      if (row != undefined) {
        // this.form.parentId = row.deptId;
        this.form = JSON.parse(JSON.stringify(row));
      }
      this.open = true;
      this.title = "添加部门";


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

      this.form = JSON.parse(JSON.stringify(row));
      this.open = true;
      this.title = "修改部门";

    },
    /** 递归筛选菜单列表 */
    filterMenuList(menuList, keyword) {
      let result = [];
      menuList.forEach(item => {

        if (item.deptName
          .includes(keyword)) {
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
    /** 提交按钮 */
    submitForm: function () {

      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {

            let data = {
              DepID: this.form.deptId,
              NewDepName: this.form.deptName,
              voidid: 832
            }
            initList(data).then(res => {
              if (res.Data) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.reset()
                this.getList();
              } else {
                this.$modal.msgError(res.ErrorInfo);
              }
            })
            // updateDept(this.form).then(response => {
            //   this.$modal.msgSuccess("修改成功");
            //   this.open = false;
            //   this.getList();
            // });
          } else {


            let data = {
              DepID: this.form.parentId,
              NewDepName: this.form.deptName,
              voidid: 831
            }
            initList(data).then(res => {
              if (res.Data) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.reset()
                this.getList();
              } else {
                this.$modal.msgError(res.ErrorInfo);
              }
            })

          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {

      this.$confirm('是否确认删除名称为"' + row.deptName + '"这个部门？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          DepID: row.deptId,
          voidid: 833
        }
        initList(data).then(res => {

          if (res.Data) {
            this.getList()
            this.$modal.msgSuccess("删除成功");
          } else {
            this.$modal.msgError(res.ErrorInfo);
          }
        })

      }).catch(() => {

      });

    },

    getdepartment() {
      let data = {
        StaffID: getToken(),
        voidid: 842,
      }
      initList(data).then(res => {
        if (res.Data) {

          // 因为是部门管理页面，所以必须是角色1和2才能看到对应的部门数据
          const targetIds = res.Data.filter(item => item.角色ID == 1 || item.角色ID == 2).map(item => item['部门ID']);
          if (targetIds.includes('1')) {
            this.originaldeptList = this.departmentList;
            this.deptOptions = this.departmentList
          } else {
            // 调用筛选函数
            const filteredData = find_departments(this.departmentList, targetIds);
            function find_departments(data, ids) {
              let result = [];
              for (let item of data) {
                if (ids.includes(String(item.deptId))) {
                  result.push(item);
                } else if (item.children && item.children.length > 0) {
                  let sub_result = find_departments(item.children, ids);
                  result = result.concat(sub_result);
                }
              }
              return result;
            }
            this.originaldeptList = filteredData;
            this.deptOptions = filteredData
          }


        } else {
          this.$modal.msgError(res.ErrorInfo);
        }
      })
    },






    transformData(data, parentId = 0, ancestors = '0') {

      const newDeptId = parseInt(data["部门ID"])

      const result = {
        "createBy": "admin",

        "deptId": newDeptId,
        "parentId": parentId,
        "ancestors": ancestors,
        "deptName": data["部门名称"],


        "children": []
      };

      // 处理下级部门
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

<style scoped lang="scss">
/* 这里可以添加样式 */
.add {
  color: #67C23A;
}

.update {
  color: #E6A23C;
}

.delete {
  color: #F56C6C;
}
</style>