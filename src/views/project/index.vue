<template>
  <div class="project-container">
    <el-card class="box-card">
      <div class="search-area">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="项目名称">
            <el-input v-model="queryParams.projectName" placeholder="请输入项目名称"></el-input>
          </el-form-item>
          <el-form-item label="项目ID">
            <el-input v-model="queryParams.projectId" placeholder="请输入项目ID"></el-input>
          </el-form-item>
          <el-form-item label="项目状态">
            <el-select v-model="queryParams.status" placeholder="请选择项目状态">
              <el-option label="进行中" value="ongoing"></el-option>
              <el-option label="已完成" value="completed"></el-option>
              <el-option label="已暂停" value="paused"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['system:menu:add']">批量归属</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="projectId"
          label="项目ID"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="belongTo"
          label="项目归属"
          min-width="150">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleBelong(scope.row)">归属</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.StartNum"
        :limit.sync="queryParams.EndNum"
        @pagination="getList"
      />
    </el-card>

    <!-- 归属对话框 -->
    <el-dialog title="项目归属" :visible.sync="belongDialogVisible" width="500px" append-to-body>
      <el-form :model="belongForm" ref="belongForm" :rules="belongRules" label-width="80px">
        <el-form-item label="归属部门" prop="departmentId">
          <el-cascader
            v-model="belongForm.departmentId"
            :options="departmentOptions"
            :props="cascaderProps"
            placeholder="请选择归属部门" 
            style="width: 100%"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="belongDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBelong">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initList } from '@/api/record.js'
import { getToken } from '@/utils/auth'

export default {
  name: 'projectList',
  data() {
    return {
      // 查询参数
      queryParams: {
        StartNum: 1,
        EndNum: 10,
        projectName: '',
        projectId: '',
        status: ''
      },
      // 总条数
      total: 0,
      // 表格数据
      tableData: [],
      // 归属相关数据
      belongDialogVisible: false,
      belongForm: {
        departmentId: ''
      },
      belongRules: {
        departmentId: [
          { required: true, message: '请选择归属部门', trigger: 'change' }
        ]
      },
      cascaderProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        checkStrictly: true
      },
      departmentOptions: [],
      selectedProjects: [],
      currentProject: null
    }
  },
  created() {
    this.getDeptList();
    this.getList();
  },
  methods: {
    // 获取项目列表
    getList() {
      let data = {
        ...this.queryParams,
        voidid: 840 // 假设这是获取项目列表的接口ID
      }
      initList(data).then(res => {
        if (res.Data) {
          this.tableData = res.Data;
          this.total = res.Total || 0;
        } else {
          this.$modal.msgError(res.ErrorInfo);
        }
      });
    },
    // 搜索按钮操作
    handleSearch() {
      this.queryParams.StartNum = 1;
      this.getList();
    },
    // 重置按钮操作
    resetSearch() {
      this.queryParams = {
        StartNum: 1,
        EndNum: 10,
        projectName: '',
        projectId: '',
        status: ''
      }
      this.getList();
    },
    // 获取部门列表
    getDeptList() {
      let data = {
        StaffID: getToken(),
        voidid: 842,
      }
      initList(data).then(res => {
        if (res.Data) {
          this.getUserDepartments(res.Data);
        } else {
          this.$modal.msgError(res.ErrorInfo);
        }
      });
    },
    // 获取用户所属部门
    getUserDepartments(userDepts) {
      const promises = userDepts.map(item => {
        let data = {
          voidid: 830,
          DepID: item.部门ID
        }
        return initList(data).then(res => {
          if (res.Data) {
            return this.transformData(res.Data[0]);
          }
        });
      });
      
      Promise.all(promises).then(departments => {
        this.departmentOptions = departments.filter(Boolean);
      });
    },
    // 转换部门数据结构
    transformData(data, parentId = 0, ancestors = '0') {
      const newDeptId = parseInt(data["部门ID"]);
      const result = {
        deptId: newDeptId,
        deptName: data["部门名称"],
        children: []
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
    handleChange(value) {
      console.log('选择的部门ID:', value);
    },
    handleSelectionChange(selection) {
      this.selectedProjects = selection;
    },
    handleAdd() {
      if (this.selectedProjects.length === 0) {
        this.$message.warning('请选择要归属的项目')
        return
      }
      this.belongDialogVisible = true
    },
    handleBelong(row) {
      this.currentProject = row
      this.belongDialogVisible = true
    },
    submitBelong() {
      this.$refs['belongForm'].validate(valid => {
        if (valid) {
          const projectIds = this.currentProject 
            ? [this.currentProject.projectId] 
            : this.selectedProjects.map(item => item.projectId)
          
          // 这里调用归属接口
          console.log('提交归属', {
            projectIds,
            departmentId: this.belongForm.departmentId
          })
          
          // 提交成功后
          this.belongDialogVisible = false
          this.$message.success('归属成功')
          this.resetBelongForm()
        }
      })
    },
    resetBelongForm() {
      this.belongForm = {
        departmentId: ''
      }
      this.currentProject = null
    },
    handleDelete(row) {
      // 处理删除操作
      console.log('处理删除', row)
    }
  }
}
</script>

<style scoped>
.project-container {
  padding: 20px;
}
.box-card {
  margin-bottom: 20px;
}
.search-area {
  margin-bottom: 20px;
}
</style> 