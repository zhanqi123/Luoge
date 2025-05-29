<template>
  <div class="project-container">

    <el-card class="box-card">
      <h2>归档负责人管理</h2>
      <div class="search-area">

        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="项目信息">
            <el-input style="width: 350px;" v-model="searchForm.ProjectID" placeholder="请输入项目关键词"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人">
            <el-input v-model="searchForm.SaleStaffName" placeholder="请输入项目负责人"></el-input>
          </el-form-item>

          <el-form-item label="是否显示同项目下其他系统归档数据">

            <el-select v-model="searchForm.ShowOtherSys" placeholder="请选择是否显示同项目下其他系统归档数据">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch" icon="el-icon-search" size="mini">搜索</el-button>
            <el-button @click="resetSearch" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-table :data="tableData" style="width: 100%" border stripe @selection-change="handleSelectionChange"
      :span-method="objectSpanMethod" v-loading="loading">
      <el-table-column type="selection" align="center" width="45">
      </el-table-column>
      <el-table-column prop="项目名称" label="项目名称" :show-overflow-tooltip="true" align="center" min-width="180">
      </el-table-column>
      <el-table-column prop="项目编号" label="项目编号" align="center" min-width="140" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column prop="项目状态" label="项目状态" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="项目归属部门" label="项目归属部门" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.项目归属部门 ? scope.row.项目归属部门 : '/' }}</span>

        </template>
      </el-table-column>
      <el-table-column prop="项目归属一级部门" label="项目归属一级部门" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.项目归属一级部门 ? scope.row.项目归属一级部门 : '/' }}</span>

        </template>
      </el-table-column>



      <el-table-column prop="项目负责人" label="项目负责人" align="center" min-width="110" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="系统名称" label="系统名称" align="center" min-width="140" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="系统编号" label="系统编号" align="center" min-width="140" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="归档人员" label="归档人员" align="center" min-width="110" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column prop="测评组长" label="测评组长" align="center" min-width="110" :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column prop="被测单位名称" label="被测单位名称" :show-overflow-tooltip="true" align="center" min-width="140">
      </el-table-column>



      <el-table-column prop="报告封面日期" label="报告封面日期" align="center" min-width="150">
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">


          <div v-if="scope.row.测评组长 == userName">
            <el-tag type="danger" effect="plain" v-if="scope.row.项目归属部门ID == 0">暂未分配部门</el-tag>
            <el-button size="mini" type="success" icon="el-icon-share" @click="handleBelong(scope.row)"
              v-else>归档人员分配</el-button>
          </div>
          <div v-else>
            <el-tag type="primary" effect="plain">同项目下其他系统归档</el-tag>

          </div>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
      @pagination="handlePagination" />

    <!-- 添加待分配人员弹窗 -->
    <el-dialog title="待分配人员" :visible.sync="staffDialogVisible" width="70%" append-to-body>
      <el-form :inline="true" :model="staffSearchForm" class="demo-form-inline">
        <el-form-item label="员工姓名">
          <el-input v-model="staffSearchForm.name" placeholder="请输入员工姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工ID">
          <el-input v-model="staffSearchForm.workId" placeholder="请输入员工ID" clearable></el-input>
        </el-form-item>
        <el-form-item>

          <el-button @click="resetStaffSearch" size="mini">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredLeftList" style="width: 100%" border stripe v-loading="staffLoading" height="600">
        <el-table-column label="选择员工ID" min-width="140" align="center">
          <template slot-scope="scope">
            <el-radio v-model="selectedStaff" :label="scope.row.员工ID"
              @change="handleStaffRadioChange(scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>

        <el-table-column prop="员工姓名" label="员工姓名" align="center" min-width="120">
        </el-table-column>
        <!-- <el-table-column prop="员工ID" label="员工ID" align="center" min-width="120">
        </el-table-column> -->
        <el-table-column prop="角色名称" label="角色名称" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="角色所在部门" label="角色所在部门" align="center" min-width="150">
        </el-table-column>
      </el-table>



      <div slot="footer" class="dialog-footer">
        <el-button @click="handleStaffCancel">取 消</el-button>
        <el-button type="primary" @click="handleStaffSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { initList } from '@/api/record.js'
import { getToken } from '@/utils/auth'

export default {
  name: 'pigeonholeIndex',
  data() {
    return {
      tableData: [],
      searchForm: {
        State: '未开始,待归档,已分配归档人员,归档材料审核中,归档材料返回修改中,档案未入库,归档完成',
        ShowOtherSys: 0,
        ProjectID: '',
        SystemID: '',
        SystemName: '',
        SaleStaffName: '',
        EvaluationStaffName: "",
        ArchiveStaffName: '',

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
      spanArr: [],
      // 待分配人员相关数据
      staffDialogVisible: false,
      staffSearchForm: {
        name: '',
        workId: ''
      },
      staffTableData: [],
      staffLoading: false,
      staffTotal: 0,
      staffCurrentPage: 1,
      staffPageSize: 10,
      selectedStaff: [], // 选中的员工
      options: [{
        value: 1,
        label: '显示'
      }, {
        value: 0,
        label: '不显示'
      }
      ],
      userName: ''
    }
  },
  created() {
    if (localStorage.getItem('name')) {
      this.userName = localStorage.getItem('name')
      this.searchForm.EvaluationStaffName = this.userName

    }
    this.getList()
  },
  computed: {
    filteredLeftList() {
      if (!this.staffTableData) {
        return [];
      }
      this.selectedStaff = []
      return this.staffTableData.filter(item => {
        const idMatch = item.员工ID.toString().includes(this.staffSearchForm.workId)
        const nameMatch = item.员工姓名.includes(this.staffSearchForm.name)
        return idMatch && nameMatch
      })
    }
  },
  methods: {

    handleStaffRadioChange(row) {
      this.selectedStaff = row.员工ID;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 需要合并的列索引（根据实际渲染顺序调整）
      const mergeColumns = [1, 2, 3, 4, 5, 6]; // 项目名称、项目编号、项目状态、归属部门、一级部门、负责人

      if (mergeColumns.includes(columnIndex)) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return { rowspan: _row, colspan: _col }
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
        deptName: data["部门名称"]
      };

      // 处理下级部门
      let subDepts = [];
      if (typeof data["下级部门名称"] === 'string') {
        subDepts = JSON.parse(data["下级部门名称"].replace(/'/g, '"'));
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
      this.currentProject = row;
     
      this.getDepartment(row.项目归属部门ID)
      return

      this.staffDialogVisible = true;
      this.getStaffList();
    },

    // 处理分页变化
    handlePagination({ page, limit }) {
      this.currentPage = page
      this.pageSize = limit
      this.getList()
    },

    reset() {
      this.searchForm = {
        State: '未开始,待归档,已分配归档人员,归档材料审核中,归档材料返回修改中,档案未入库,归档完成',
        ShowOtherSys: 0,
        ProjectID: '',
        SystemID: '',
        SystemName: '',
        SaleStaffName: '',
        EvaluationStaffName: this.userName,
        ArchiveStaffName: '',
      }
      this.getList()
    },
    handleSelectionChange(selection) {
      this.selectedProjects = selection
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
              this.getList1()
              this.belongDialogVisible = false
            }
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

    getList() {
      const start = (this.currentPage - 1) * this.pageSize + 1
      const end = this.currentPage * this.pageSize
      let params = {
        ...this.searchForm,
        ReviewerStaffName: '',
        LabStaffName: '',
        DepID: 0,
        StartNum: start,
        EndNum: end,
        voidid: 800
      }

      this.loading = true
      initList(params).then(res => {
        console.log(res)
        if (Array.isArray(res.Data)) {
          this.tableData = res.Data
          this.total = res.Data.length > 0 ? res.Data[0].记录总数 : 0
          this.tableData.forEach((item, index) => {
            if (index > 0 && item.项目编号 === this.tableData[index - 1].项目编号) {
              const shouldSameKeys = ['项目状态', '项目归属部门', '项目归属一级部门', '项目负责人']
              shouldSameKeys.forEach(key => {
                if (item[key] !== this.tableData[index - 1][key]) {
                  console.warn('相同项目存在不一致数据:', key, item.项目编号)
                }
              })
            }
          })
          this.getSpanArr(this.tableData)
        }else{
          this.$modal.msgError(res.ErrorInfo);
        }
        this.loading = false
      })
    },
    handleSearch() {
      this.currentPage = 1  // 搜索时重置到第一页
      this.getList()
    },

    resetSearch() {
      this.currentPage = 1  // 重置时回到第一页
      this.reset()

      // this.getList()
    },

    getDepartment(val) {
      let data = {
        DepID: val,
        voidid: 811,
      }
      initList(data).then(res => {
        if (res.Data && res.Data.length > 0) {
          this.staffTableData = res.Data
          this.staffDialogVisible = true;
        } else {
          this.$modal.msgError('暂无待分配人员');
        }
      });
    },


    // 处理员工选择
    handleStaffSelectionChange(selection) {
      this.selectedStaff = selection;
    },



    // 重置员工搜索
    resetStaffSearch() {
      this.staffSearchForm = {
        name: '',
        workId: ''
      };

    },



    // 处理员工提交
    handleStaffSubmit() {
      if (this.selectedStaff.length === 0) {
        this.$message.warning('请选择要分配的人员');
        return;
      }
      const foundEmployee = this.staffTableData.find(employee => employee["员工ID"] == this.selectedStaff);

      this.$confirm('请确认您将设置' + foundEmployee.员工姓名 + '归档该系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          SystemID: this.currentProject.系统编号,
          StaffID: this.selectedStaff,
          voidid: 810
        }
        initList(data).then(res => {

          if (res.Data) {
            this.getList()
            this.$message.success('分配成功');
            this.staffDialogVisible = false;
          } else {
            this.$modal.msgError(res.ErrorInfo);
          }
        });
      })


    },

    // 处理员工取消
    handleStaffCancel() {
      this.staffSearchForm = {
        name: '',
        workId: ''
      };
      this.selectedStaff = [];
      this.staffDialogVisible = false;
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

.dialog-footer {
  text-align: center;
  margin-top: 20px;
}
</style>