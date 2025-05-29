<template>
  <div class="project-container">

    <el-card class="box-card">
      <h2>一级项目归属管理</h2>
      <div class="search-area">

        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="项目信息">
            <el-input style="width: 350px;" v-model="searchForm.Keyword1"
              placeholder="请输入项目编号、名称、被测单位、付款单位名称"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人">
            <el-input v-model="searchForm.Keyword2" placeholder="请输入项目负责人"></el-input>
          </el-form-item>
          <el-form-item label="归属部门">
            <el-input v-model="searchForm.Keyword3" placeholder="请输入归属部门"></el-input>
          </el-form-item>
          <el-form-item label="项目日期" v-if="projectDate!== 0">
            <el-date-picker v-model="value1" type="daterange" align="right" unlink-panels range-separator="至"
              value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
              @change="handleDateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="归属部门状态">
            <el-select v-model="searchForm.isFindAll" placeholder="请选择归属状态">
              <el-option label="未归属" value="0"></el-option>
              <el-option label="全部" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否查询空日期">
            <el-select v-model="projectDate" placeholder="请选择是否查询空日期">
              <el-option label="是" :value="0"></el-option>
              <el-option label="否" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" icon="el-icon-search" size="mini">搜索</el-button>
            <el-button @click="resetSearch" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" :disabled="selectedProjects.length == 0" plain icon="el-icon-plus" size="mini"
          @click="handleAdd">批量归属</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" border stripe @selection-change="handleSelectionChange"
      v-loading="loading" :span-method="objectSpanMethod">
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>
      <el-table-column prop="项目名称" label="项目名称" :show-overflow-tooltip="true" align="center" min-width="220">
      </el-table-column>
      <el-table-column prop="项目编号" label="项目编号" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="被测单位" label="被测单位" :show-overflow-tooltip="true" align="center" min-width="150">
      </el-table-column>
      <el-table-column prop="项目负责人" label="项目负责人" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="付款单位" label="付款单位" :show-overflow-tooltip="true" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="项目归属一级部门" label="项目归属一级部门" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.项目归属一级部门 ? scope.row.项目归属一级部门 : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="项目状态" label="项目状态" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="合同签订日期" label="合同签订日期" align="center" min-width="150">
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-share" @click="handleBelong(scope.row)">归属配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
      @pagination="handlePagination" />
    <!-- 归属对话框 -->
    <el-dialog title="项目归属" :visible.sync="belongDialogVisible" width="40%" append-to-body>
      <el-form :model="belongForm" ref="belongForm" :rules="belongRules" label-width="80px">
        <el-form-item label="归属部门" prop="departmentId">
          <el-cascader v-model="belongForm.departmentId" :options="departmentOptions" :props="cascaderProps"
            placeholder="请选择归属部门" style="width: 100%" @change="handleChange">
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
      tableData: [],
      searchForm: {
        Keyword1: '',
        Keyword2: '',
        Keyword3: '',
        isFindAll: "0",
        StartDate: '',
        EndDate: '',
        StartNum: 1,
        EndNum: 50,
        voidid: 846,
      },
      currentPage: 1,  // 当前页码
      pageSize: 50,    // 每页显示数量
      loading: false,
      total: 0,
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
      departmentOptions: [], // 部门选项
      selectedProjects: [], // 选中的项目
      currentProject: null, // 当前操作的项目
      cascaderProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        checkStrictly: true
      },
      spanArr: [], // 用于存储合并单元格的信息
      value1: [],
      projectDate: 1,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const date = new Date();
              picker.$emit('pick', [date, date]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
    }
  },
  created() {
    this.getList()
    this.getDeptList();
  },
  watch: {
    projectDate(newVal) {
      if (newVal == 0) {
        this.value1 = [];
        this.searchForm.StartDate = '0001-01-01';
        this.searchForm.EndDate = '0001-01-01';
      } else {
        this.value1 = [];
        this.searchForm.StartDate = '';
        this.searchForm.EndDate = '';
      }   
    }
  },
  methods: {
    // 获取部门列表
    getDeptList() {
      let data = {
        voidid: 830,
        DepID: '1'
      }
      initList(data).then(res => {
        if (res.Data) {
          // 正确处理部门数据
          this.departmentOptions = [this.transformData(res.Data[0])][0].children;
        } else {
          this.$message.error(res.ErrorInfo || '获取部门数据失败');
        }
      }).catch(error => {
        this.$message.error('获取部门数据失败');
      });
    },
    // 转换部门数据结构
    transformData(data, parentId = 0, ancestors = '0') {
      const newDeptId = parseInt(data["部门ID"]);
      const result = {
        deptId: newDeptId,
        deptName: data["部门名称"]
      };
      // 处理下级部门
      let subDepts = [];
      if (typeof data["下级部门名称"] === 'string') {
        try {
          subDepts = JSON.parse(data["下级部门名称"].replace(/'/g, '"'));
        } catch (e) {
          console.error('解析下级部门数据失败:', e);
          subDepts = [];
        }
      } else if (Array.isArray(data["下级部门名称"])) {
        subDepts = data["下级部门名称"];
      }
      if (subDepts.length > 0) {
        if (data.部门ID == '1') {
          result.children = [];
          for (const subDept of subDepts) {
            const newAncestors = `${ancestors},${newDeptId}`;
            const subResult = this.transformData(subDept, newDeptId, newAncestors);
            result.children.push(subResult);
          }
        }
      }
      return result;
    },
    handleBelong(row) {
      this.belongForm.departmentId = ''
      this.currentProject = row
      this.belongDialogVisible = true
    },
    handleDelete(row) {
      // 处理删除操作
      console.log('处理删除', row)
    },
    // 处理分页变化
    handlePagination({ page, limit }) {
      this.currentPage = page
      this.pageSize = limit
      this.getList()
    },
    reset() {
      this.searchForm = {
        Keyword1: '',
        Keyword2: '',
        Keyword3: '',
        isFindAll: "0",
        StartDate: '',
        EndDate: '',
        StartNum: 1,
        EndNum: 50,
        voidid: 846,
      }
      this.value1 = [];
      this.projectDate = 1
    },
    handleSelectionChange(selection) {
      this.selectedProjects = selection
    },
    handleAdd() {
      this.belongDialogVisible = true
    },
    submitBelong() {
      this.$refs['belongForm'].validate(valid => {
        if (valid) {
          const projectIds = this.currentProject
            ? this.currentProject.项目编号.toString()
            : this.selectedProjects.map(item => item.项目编号).join(',');
          let data = {
            ProID: projectIds,
            DepID: this.belongForm.departmentId[this.belongForm.departmentId.length - 1],
            voidid: 847,
          }
          initList(data).then(res => {
            if (res.Data) {
              this.$message.success('归属成功')
              this.resetBelongForm()
              this.getList()
              this.belongDialogVisible = false
            } else {
              this.$message.error(res.ErrorInfo || '归属失败');
            }
          }).catch(error => {
            this.$message.error('归属请求失败');
          })
        }
      })
    },
    resetBelongForm() {
      this.belongForm = {
        departmentId: ''
      }
      this.currentProject = null
    },
    handleChange(value) {
      console.log('选择的部门ID:', value);
    },
    getList() {
      const start = (this.currentPage - 1) * this.pageSize + 1
      const end = this.currentPage * this.pageSize
      let params = {
        ...this.searchForm,
        StartNum: start,
        EndNum: end,
        voidid: 846
      }
  
      this.loading = true
      initList(params).then(res => {
        if (Array.isArray(res.Data)) {
          // 按项目编号排序
          this.tableData = res.Data.sort((a, b) => a.项目编号.localeCompare(b.项目编号));
          this.total = res.Data.length > 0 ? res.Data[0].记录总数 : 0;
          // 计算合并单元格信息
          this.getSpanArr(this.tableData);
        } else {
          this.tableData = []
          this.$message.error(res.ErrorInfo || '获取数据失败');
        }
        this.loading = false
      }).catch(error => {
        this.$message.error('请求出错，请稍后重试');
        this.loading = false;
      })
    },
    handleSearch() {
      this.currentPage = 1  // 搜索时重置到第一页
      this.getList()
    },
    resetSearch() {
      this.reset()
      this.currentPage = 1  // 重置时回到第一页
      this.getList()
    },
    // 处理表格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 可以根据需要合并更多列
      if (columnIndex === 1 || columnIndex === 2) { // 项目名称和项目编号列
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 计算需要合并的行数
    getSpanArr(data) {
      this.spanArr = [];
      let pos = 0;
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0;
        } else {
          if (data[i].项目编号 === data[i - 1].项目编号) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
    },
    handleDateChange(value) {
      if (value && value.length === 2) {
        this.searchForm.StartDate = value[0];
        this.searchForm.EndDate = value[1];
      }
    }
  }
}
</script>

<style scoped>
h2 {
  font-weight: 600;
  line-height: 1;
  font-size: 21px;
}

::v-deep .el-card__body {
  padding: 0px 20px 10px 20px;
}

::v-deep .input[aria-hidden=true] {
  display: none !important;
}

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