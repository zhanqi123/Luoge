<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col> -->
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId"
      :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="deptName" label="部门名称" ></el-table-column>
      <!-- <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
</el-table-column> -->
      <el-table-column label="创建时间" align="center" prop="createTime" >
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
              <treeselect v-model="form.parentId"   :disabled="form.deptId != undefined" :options="deptOptions" :normalizer="normalizer"
                placeholder="选择上级部门" />
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
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="部门管理员" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>

          <!-- <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
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

// 模拟接口函数
const listDept = () => {
  return Promise.resolve({
    data: [
      {
        "createBy": "admin",
        "createTime": "2024-06-30 11:27:07",
        "deptId": 100,
        "parentId": 0,
        "ancestors": "0",
        "deptName": "珞格科技",

        "leader": "珞格",
        "phone": "15888888888",
        "children": []
      },
      {
        "createBy": "admin",
        "createTime": "2024-06-30 11:27:07",
        "deptId": 101,
        "parentId": 100,
        "ancestors": "0,100",
        "deptName": "深圳分公司",

        "leader": "珞格",
        "phone": "15888888888",
        "children": []
      },

      {
        "createBy": "admin",
        "createTime": "2024-06-30 11:27:08",
        "deptId": 103,
        "parentId": 101,
        "ancestors": "0,100,101",
        "deptName": "财务部",

        "leader": "珞格",
        "phone": "15888888888",

        "children": []
      },
    ]
  });
};

export default {
  name: "Dept",
  dicts: ['sys_normal_disable'],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
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
        status: undefined
      },
      // 表单参数
      form: {},
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
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
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
          this.deptList = [this.transformData(res.Data[0])]
          this.deptOptions = [this.transformData(res.Data[0])]
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
      this.form = {

      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加部门";

      // listDept().then(response => {
      //   this.deptOptions = this.handleTree(response.data, "deptId");
      //   console.log(this.deptOptions)
      // });
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
              }else{
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
              }else{
                this.$modal.msgError(res.ErrorInfo);
              }
            })
  
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
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
          console.log(res)
          if (res.Data) {
            this.getList()
            this.$modal.msgSuccess("删除成功");
          }else{
            this.$modal.msgError(res.ErrorInfo);
          }
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {

      });

    },
    /** 处理树形数据 */
    handleTree(data, id) {
      const map = {};
      const tree = [];

      data.forEach(item => {
        map[item[id]] = { ...item, children: [] };
      });

      data.forEach(item => {
        const parent = map[item.parentId];
        if (parent) {
          parent.children.push(map[item[id]]);
        } else {
          tree.push(map[item[id]]);
        }
      });

      return tree;
    },

    transformData(data, parentId = 0, ancestors = '0') {

      // const deptIdBase = 100;
      // const newDeptId = deptIdBase + parseInt(data["部门ID"]);
      const newDeptId = parseInt(data["部门ID"])

      const result = {
        "createBy": "admin",
        "createTime": "2024-06-30 11:27:07",
        "deptId": newDeptId,
        "parentId": parentId,
        "ancestors": ancestors,
        "deptName": data["部门名称"],
        "leader": "珞格",
        "phone": "15888888888",
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
    }
  }
};
</script>

<style scoped lang="scss">
/* 这里可以添加样式 */
.add{
color:#67C23A;
}
.update{
color:#E6A23C;
}
.delete{
color:#F56C6C;
}
</style>