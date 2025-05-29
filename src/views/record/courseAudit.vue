<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="项目编码" prop="ProjectID">
          <el-input v-model="queryParams.ProjectID" placeholder="请输入项目编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="系统编号" prop="SystemID">
          <el-input v-model="queryParams.SystemID" placeholder="请输入系统编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="系统名称" prop="SystemName" label-width="80px">
          <el-input v-model="queryParams.SystemName" placeholder="请输入系统名称" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="项目负责人" prop="SaleStaffName" label-width="100px">
          <el-input v-model="queryParams.SaleStaffName" placeholder="请输入项目负责人" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
  <el-form-item label="归档状态" prop="state" label-width="80px">
  <el-select v-model="queryParams.state" placeholder="请选择" multiple @change="handleStateChange">
    <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table :data="currentTableData" v-loading="loading">
      <el-table-column label="项目编号" align="center" prop="项目编号" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="项目状态" align="center" prop="项目状态" width="120"  />
      <el-table-column label="项目名称" align="center" prop="项目名称" :show-overflow-tooltip="true" width="200" />
      <el-table-column label="项目负责人" align="center" prop="项目负责人"  width="150" />
      <el-table-column label="系统编号" align="center" prop="系统编号"  :show-overflow-tooltip="true" width="200"/>
      <el-table-column label="系统名称" align="center" prop="系统名称" width="250" :show-overflow-tooltip="true" />

      <el-table-column label="被测单位名称" align="center" prop="被测单位名称" width="150" :show-overflow-tooltip="true" />

      <el-table-column label="系统级别" align="center" prop="系统级别">
        <template slot-scope="scope">
          <el-tag :effect="'plain'" :type="getTagType(scope.row.系统级别)" size="small">
            {{ scope.row.系统级别 }}级
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="归档状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag :effect="'dark'" :type="getState(scope.row.归档状态)" size="small">
            {{ scope.row.归档状态 }}
          </el-tag>
          <!-- {{ scope.row.归档状态 || '-' }} -->
        </template>
      </el-table-column>
      <el-table-column label="报告封面日期" align="center" prop="报告封面日期"  width="150"/>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleAudit(scope.row)" icon="el-icon-edit-outline">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
      @pagination="handlePagination" />
  </div>
</template>

<script>
import { initList } from '@/api/record.js'
export default {
  name: "courseAudit",
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
      total: 0, // 新增 total 属性
      currentPage: 1, // 新增 currentPage 属性
      pageSize: 50, // 新增 pageSize 属性
      // 原始表格数据
      originalTableData: [],
      // 当前页表格数据
      currentTableData: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
      state: ['归档材料审核中', '归档材料返回修改中', '归档材料审核通过'],
        pageNum: 1,
        pageSize: 10,
        ProjectID: '',
        SystemID: '',
        SystemName: '',
        ShowOtherSys: 0,
        SaleStaffName: '',
        EvaluationStaffName: '',
        ArchiveStaffName: ''

      },
      userName: '',

   stateOptions: [
  { value: '归档材料审核中', label: '归档材料审核中' },
  { value: '归档材料返回修改中', label: '归档材料返回修改中' },
  { value: '归档材料审核通过', label: '归档材料审核通过' },
  { value: 'all', label: '全部' } // 使用 'all' 标识
],

    };
  },
  created() {
    if (localStorage.getItem('name')) {
      this.userName = localStorage.getItem('name')
      // this.searchForm.EvaluationStaffName = this.userName

    }
    this.getList();
    this.getFrom();
  },
  methods: {
    getList() {
      let formData = new FormData();
      formData = {
         State: this.queryParams.state.join(','),
        ShowOtherSys: this.queryParams.ShowOtherSys,
        ProjectID: this.queryParams.ProjectID,
        SystemID: this.queryParams.SystemID,
        SystemName: this.queryParams.SystemName,
        SaleStaffName: this.queryParams.SaleStaffName,
        EvaluationStaffName: this.queryParams.SaleStaffName,
        ArchiveStaffName: '',
        showothersys: this.queryParams.showothersys,
        ReviewerStaffName:this.userName,
        LabStaffName:'',
        DepID:0,
        StartNum: (this.currentPage - 1) * this.pageSize + 1,
        EndNum: this.currentPage * this.pageSize,
        voidid: 800
      }
      
      this.loading = true
      initList(formData).then(res => {
        if (res.Data) {
          this.originalTableData = res.Data;
          if (this.originalTableData.length > 0) {
               this.total = this.originalTableData[0].记录总数;
          }else{
               this.total = 0
          }

          this.setCurrentTableData();
        } else {
          this.$message.error(res.ErrorInfo);
        }

        this.loading = false
      });
    },

    // 设置当前页表格数据
    setCurrentTableData() {
      const startIndex = (this.queryParams.pageNum - 1) * this.queryParams.pageSize;
      const endIndex = startIndex + this.queryParams.pageSize;
      this.currentTableData = this.originalTableData.slice(startIndex, endIndex);
    },

      handleStateChange(selectedValues) {
    if (selectedValues.includes('all')) {
      // 如果选择了“全部”
      this.queryParams.state = ['归档材料审核中', '归档材料返回修改中', '归档材料审核通过'];
    }
  },


    /** 搜索按钮操作 */
    handleQuery() {
      this.currentPage= 1;
      this.getList();
    
    },
         getFrom() {
         return
            initList({
               
                SystemID: 'LG-SYS-01250',
                     voidid: 822
            
            }).then(res => {
                console.log(res)
            })
        },
    /** 重置按钮操作 */
    resetQuery() {
     
      this.reset();
      this.getList();
    },
    // 处理分页变化
    handlePagination({ page, limit }) {
      this.currentPage = page
      this.pageSize = limit
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.serialNumber)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    reset(){
      this.queryParams={
         state: ['归档材料审核中', '归档材料返回修改中', '归档材料审核通过'],
        pageNum: 1,
        pageSize: 10,
        ProjectID: '',
        SystemID: '',
        SystemName: '',
        ShowOtherSys: 0,
        SaleStaffName: '',
        EvaluationStaffName: '',
        ArchiveStaffName: ''
      }
      this.currentPage=1,
      this.pageSize=50
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      // 这里暂未实现具体获取修改数据逻辑，可按需补充
      console.log('修改操作', row);
    },
    rowClassName({ row, columnIndex }) {
      console.log(row, columnIndex)
      //  if(row.date=="2022-05-01"){
      //    return "rowName"
      //  }
    },
    //查看
    handleLook(row) {
   
      let data = {
        SystemID: row.系统编号,
        ReportDate: row.报告封面日期,
        formState:3
      }
      this.$router.push({
        name: 'Lookrecord',
        query: {
          data: JSON.stringify(data)
        }

      })

    },
  //审核报告
    handleAudit(row){
      let data = {
        SystemID: row.系统编号,
        ReportDate: row.报告封面日期,
        formState:2
      }
      this.$router.push({
        name: 'Auditrecord',
        query: {
          data: JSON.stringify(data)
        }

      })
    },
    handleClick(row) {
      let data = {
        SystemID: row.系统编号,
        ReportDate: row.报告封面日期,
        formState:1
      }
      this.$router.push({
        name: 'Addrecord',
        query: {
          data: JSON.stringify(data)
        }
      });
    },
    getTagType(level) {
      if (level > 5) {
        return 'danger';
      } else if (level > 4) {
        return 'warning';
      } else if (level > 2) {
        return '';
      } else if (level > 0) {
        return 'success';
      }
      return '';
    },
    getState(level) {
      switch (level) {
        case '已分配归档人员':
          return ''
          break
        case '归档材料审核中':
          return 'warning'
          break
        case '归档材料返回修改中':
          return 'danger'
          break
        case '归档材料审核通过':
          return 'success'
          break
        default:
          return ''
      }

    }
  }
};
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}

.custom-label {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  display: block;
}

.custom-header {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>