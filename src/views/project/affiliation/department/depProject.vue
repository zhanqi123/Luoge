<template>
  <div class="project-container">
    <el-tabs v-model="activeTab" :tab-position="tabPosition" @tab-click="handleDepartment" v-loading="loading"
      type="border-card">
      <!-- 动态生成部门选项 -->
      <el-tab-pane v-for="(dept, index) in mydepartmentList" :key="index" :label="`${dept.部门名称} (${dept.记录总数 || 0})`"
        :name="dept.部门ID">
        <el-card class="box-card">
          <h2>{{ dept.部门名称 }}项目管理</h2>
          <div class="search-area">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="项目信息">
                <el-input style="width: 350px;" v-model="searchForm.Keyword1"
                  placeholder="请输入项目编号、名称、被测单位、付款单位名称"></el-input>
              </el-form-item>
              <el-form-item label="项目负责人">
                <el-input v-model="searchForm.Keyword2" placeholder="请输入项目负责人"></el-input>
              </el-form-item>
              <el-form-item label="项目归属状态">
                <el-select v-model="searchForm.isFindAll" placeholder="请选择归属状态">
                  <el-option label="未归属" value="0"></el-option>
                  <el-option label="全部" value="1"></el-option>
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

          <el-col :span="1.5" v-if="activeTab !== '001'">
            <el-button type="success" :disabled="selectedProjects.length == 0" plain icon="el-icon-plus" size="mini"
              @click="handleAdd">批量归属</el-button>
          </el-col>
        </el-row>
        <el-tabs v-model="activeStage" type="card" class="stage-tabs" @tab-click="handleRowClick">
          <el-tab-pane v-for="stage in stages" :key="stage.name" :label="getCachedStageLabel(stage)" :name="stage.name">
            <div v-if="stage.name == 'all'">
              <el-table :data="deptTableData" style="width: 100%" border stripe v-loading="loading">
                <el-table-column prop="合同阶段总数" label="合同阶段总数" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="实施完结总数" label="实施完结总数" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="实施阶段总数" label="实施阶段总数" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="立项阶段总数" label="立项阶段总数" :show-overflow-tooltip="true" align="center" />
                <el-table-column prop="记录总数" label="记录总数" :show-overflow-tooltip="true" align="center" />
              </el-table>
            </div>
            <div v-else>
              <el-table :data="deptTableData" :row-key="getRowKey" style="width: 100%" border stripe v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" width="55" />
                <el-table-column prop="项目名称" label="项目名称" :show-overflow-tooltip="true" align="center"
                  min-width="220" />
                <el-table-column prop="项目编号" label="项目编号" align="center" min-width="120" />
                <el-table-column prop="项目归属一级部门" label="项目归属一级部门" align="center" min-width="140"
                :show-overflow-tooltip="true" />
                <el-table-column prop="项目归属部门" label="项目归属部门" align="center" min-width="120"
                :show-overflow-tooltip="true" />
             
          
                <el-table-column prop="被测单位" label="被测单位" align="center" :show-overflow-tooltip="true"
                  min-width="180" />
                <el-table-column prop="付款单位" label="付款单位" align="center" :show-overflow-tooltip="true"
                  min-width="150" />
                <el-table-column prop="项目负责人" label="项目负责人" align="center" min-width="150" />
                <el-table-column prop="项目状态" label="项目状态" align="center" min-width="150" />
                <el-table-column prop="合同签订日期" label="合同签订日期" align="center" min-width="150" />
                <el-table-column label="操作" width="200" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-share" @click="handleBelong(scope.row)">
                      配置子部门
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 修改显示条件 -->
              <pagination v-if="total > 0" :total="total" :page.sync="searchForm.StartNum"
                :limit.sync="searchForm.EndNum" @pagination="handlePagination" />
            </div>

          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <!-- 归属对话框 -->
    <el-dialog title="项目归属" :visible.sync="belongDialogVisible" width="40%" append-to-body>
      <el-form :model="belongForm" ref="belongForm" :rules="belongRules" label-width="80px">
        <el-form-item label="归属部门" prop="departmentId">
          <el-cascader v-model="belongForm.departmentId" :options="departmentList" :props="cascaderProps"
            placeholder="请选择归属部门" style="width: 100%">
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
  name: 'depProject',

  components: {

  },
  data() {
    return {
      activeTab: '001', // 当前激活的部门标签页
      activeStage: 'all', // 当前激活的项目阶段标签页
      stages: [
        { label: '汇总统计', name: 'all', status: '', totalKey: '记录总数' },
        { label: '立项阶段', name: '立项阶段', status: '立项阶段', totalKey: '立项阶段总数' },
        { label: '合同阶段', name: '合同阶段', status: '合同阶段', totalKey: '合同阶段总数' },
        { label: '实施阶段', name: '实施阶段', status: '实施阶段', totalKey: '实施阶段总数' },
        { label: '实施完结', name: '实施完结', status: '实施完结', totalKey: '实施完结总数' }
      ],
      deptTableData: [], // 每个部门的数据
      searchForm: {
        Keyword1: '',
        Keyword2: '',
        isFindAll: "1",

        voidid: 846,
      },
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
      departmentOptions: [], // 部门原始数据
      departmentList: [], //部门最新数据

      selectedProjects: [], // 选中的项目
      currentProject: null, // 当前操作的项目
      cascaderProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        checkStrictly: true
      },
      mydepartmentList: [],
      tabPosition: 'left',
      total: 0, // 新增 total 属性
      currentPage: 1, // 新增 currentPage 属性
      pageSize: 50, // 新增 pageSize 属性
      loading: false,
      stageTotals: {},
    }
  },
  created() {
    this.getDeptList();
  },
  // 添加阶段切换监听
  watch: {

  },
  methods: {
    getRowKey(row) {
      return row.项目编号; // 这里假设 'A' 是唯一标识
    },
    findDeptWithParents(arr, targetId, parents = []) {
    for (const item of arr) {
        if (item.deptId == targetId) {
            return parents;
        }
        if (item.children) {
            const result = this.findDeptWithParents(item.children, targetId, [...parents, item]);
            if (result) {
                return result;
            }
        }
    }
    return null;
},

    // 获取部门列表
    async getDeptList() {
      try {
        let data = {
          StaffID: getToken(),
          voidid: 842,
        }
        this.loading = true
        const res = await initList(data);
       
        if (res.Data) {
          // 使用 Map 过滤数据
          const filteredData = [];
          const validRoleIds = new Map([
            ["1", true],
            ["2", true]
          ]);
          res.Data.forEach(item => {
            if (validRoleIds.has(item.角色ID)) {
              filteredData.push(item);
            }
          });
         
          this.mydepartmentList = JSON.parse(JSON.stringify(filteredData));

          // 获取每个部门的阶段总数
          const promises = this.mydepartmentList.map(async (dept) => {
            await this.getDeptStageTotals(dept);
            return dept;
          });

          const updatedDeptList = await Promise.all(promises);
       
          const totalCount = updatedDeptList.reduce((sum, dept) => sum + dept.记录总数, 0);

          updatedDeptList.unshift({
            "部门ID": "001",
            "部门名称": "全部",
            "记录总数": totalCount,
            "stageTotals": this.calculateTotalStages(updatedDeptList)
          });
          this.mydepartmentList = updatedDeptList;
       
          this.getList();
          this.getUserDepartments();
        }
      } catch (error) {
        console.error('获取部门列表失败:', error);
      }
    },
    // 获取用户所属部门
    getUserDepartments(userDepts) {
     //获取全部的部门数据
     let data = {
          voidid: 830,
          DepID: 1
        }
        return initList(data).then(res => {
          this.departmentOptions= [this.transformData(res.Data[0])][0].children
         
          return
          if (res.Data) {
            return this.transformData(res.Data[0]);
          }
        });

      return
      const processedIds = new Set();
      // 过滤掉重复的部门ID
      const uniqueItems = userDepts.filter(item => {
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
            return this.transformData(res.Data[0]);
          }
        });
      });
      Promise.all(promises).then(departments => {
        this.departmentOptions = departments.filter(Boolean);
        console.log(this.departmentOptions,'测试部门')
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
        result.children = [];
        for (const subDept of subDepts) {
          const newAncestors = `${ancestors},${newDeptId}`;
          const subResult = this.transformData(subDept, newDeptId, newAncestors);
          result.children.push(subResult);
        }
      }
      return result;
    },
    handleBelong(row) {
        console.log(row)
      const result = this.departmentOptions.filter(item => item.deptName == row.项目归属一级部门);
      this.currentProject = row
      this.open(result[0].deptId)
    },

    handleSearch() {
      // 处理搜索操作，不更新总数
      this.getList();
    },
    resetSearch() {
      // 处理重置操作
      this.searchForm = {
        Keyword1: '',
        Keyword2: '',
        isFindAll: '0'
      }
      this.getList();
    },
    handleSelectionChange(selection) {
      this.selectedProjects = selection
    },
    open(val) {
    
      this.departmentList = this.departmentOptions.filter(item => item.deptId == val);
  
      this.belongForm.departmentId = ''
      this.belongDialogVisible = true
    },
    handleAdd() {

     this.departmentList=this.findDeptWithParents(this.departmentOptions,this.activeTab)
     this.belongForm.departmentId = ''
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
            voidid: 850,
          }
          initList(data).then(res => {
            if (res.Data) {
              this.$message.success('归属成功')
              this.resetBelongForm()
              // this.getList();
              this.getDeptList()
              this.belongDialogVisible = false
            } else {
              this.$modal.msgError(res.ErrorInfo);
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
    handleChange(value) {
      console.log('选择的部门ID:', value);
    },
    async getList() {
 
      this.loading = true;
      try {
        const voidId = this.activeStage === 'all' ? 849 : 848;
        // 获取所有部门ID（排除"全部"）
        let depId = null;
        if (this.activeTab === '001') {
          depId = this.mydepartmentList.slice(1).map(dept => dept.部门ID).join(',');
        } else {
          depId = this.activeTab;
        }

        const requestData = {
          Keyword1: this.searchForm.Keyword1,
          Keyword2: this.searchForm.Keyword2,
          DepID: depId, // 用逗号拼接部门ID
          ProState: this.activeStage === 'all' ? '' : this.activeStage,
          isFindAll: this.searchForm.isFindAll,
          StartNum: (this.currentPage - 1) * this.pageSize + 1,
          EndNum: this.currentPage * this.pageSize,
          voidid: voidId,
        };
       
        const res = await initList(requestData); // 单次请求
    
        this.deptTableData = res.Data;

        if (res.Data.length > 0) {
          this.total = res.Data[0].记录总数;
        } else {
          this.total = 0;
        }
      } catch (error) {

        this.$message.error('数据请求失败');
      } finally {
        this.loading = false;
      }
    },
    // 新增方法：获取部门各阶段总数
    async getDeptStageTotals(dept) {
      try {
        const res = await initList({
          Keyword1: '',
          Keyword2: '',
          DepID: dept.部门ID,
          ProState: '',
          isFindAll: this.searchForm.isFindAll,
          StartNum: 1,
          EndNum: 1,
          voidid: 849,
        });
           
        dept.stageTotals = {
          记录总数: res.Data?.[0]?.记录总数 || 0,
          合同阶段总数: res.Data?.[0]?.合同阶段总数 || 0,
          实施阶段总数: res.Data?.[0]?.实施阶段总数 || 0,
          立项阶段总数: res.Data?.[0]?.立项阶段总数 || 0,
          实施完结总数: res.Data?.[0]?.实施完结总数 || 0
        };

        dept.记录总数 = dept.stageTotals.记录总数;
      } catch (error) {
        console.error('获取部门阶段总数失败:', error);
      }
    },
    handlePagination(val) {
      this.currentPage = val.page;
      this.pageSize = val.limit;
      this.getList();
    },
    handleRowClick() {
      this.currentPage = 1,
        this.pageSize = 50
      this.getList()
      // 这里可以添加你需要的逻辑
    },
    handleDepartment(tab) {
      this.activeTab = tab.name;
      this.selectedProjects = [];
      // 重置阶段总数显示
      this.activeStage = 'all';
      this.getList();
    },
    // 修改后的获取阶段标签方法
    getCachedStageLabel(stage) {
      const currentDept = this.mydepartmentList.find(d => d.部门ID === this.activeTab);
      if (!currentDept) return stage.label;

      // 汇总统计特殊处理
      if (stage.name === 'all') {
        return `${stage.label} (${currentDept.记录总数 || 0})`;
      }

      // 从缓存中获取阶段总数
      const total = currentDept.stageTotals?.[stage.totalKey] || 0;
      return `${stage.label} (${total})`;
    },
    // 新增方法：计算全部部门的总数
    calculateTotalStages(depts) {
      return depts.reduce((acc, dept) => ({
        记录总数: acc.记录总数 + (dept.stageTotals?.记录总数 || 0),
        合同阶段总数: acc.合同阶段总数 + (dept.stageTotals?.合同阶段总数 || 0),
        实施阶段总数: acc.实施阶段总数 + (dept.stageTotals?.实施阶段总数 || 0),
        立项阶段总数: acc.立项阶段总数 + (dept.stageTotals?.立项阶段总数 || 0),
        实施完结总数: acc.实施完结总数 + (dept.stageTotals?.实施完结总数 || 0)
      }), {
        记录总数: 0,
        合同阶段总数: 0,
        实施阶段总数: 0,
        立项阶段总数: 0,
        实施完结总数: 0
      });
    },



  },
  computed: {

  }
};
</script>
<style scoped lang="scss">
::v-deep .el-radio__original {

  display: none !important;
  /* 隐藏原生 radio 输入，但仍然允许交互 */

}

::v-deep .input[aria-hidden=true] {
  display: none !important;
}

::v-deep .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
  box-shadow: none !important;
}

/* 确保标签宽度足够显示完整数字 */
::v-deep .el-tabs__item {
  min-width: 120px;
  text-align: center;
}

h2 {
  font-weight: 600;
  line-height: 1;
  font-size: 21px;
}

::v-deep .el-card__body {
  padding: 0px 20px 10px 20px;
}

.input[aria-hidden=true] {
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

.stage-tabs {
  margin-top: 20px;
}

::v-deep .el-tabs__item {
  height: 40px;
  line-height: 40px;
}

::v-deep .el-tabs--card>.el-tabs__header {
  margin-bottom: 20px;
}
</style>