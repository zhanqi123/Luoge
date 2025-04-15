<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="项目编码" prop="ProjectID">
          <el-input v-model="queryParams.ProjectID" placeholder="请输入项目编码" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="系统编号" prop="SystemID">
          <el-input v-model="queryParams.SystemID" placeholder="请输入系统编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="系统名称" prop="SystemName" label-width="120px">
          <el-input v-model="queryParams.SystemName" placeholder="请输入系统名称" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="currentTableData" v-loading="loading">
     
      <el-table-column label="项目编号" align="center" prop="项目编号" />
      <el-table-column label="系统编号" align="center" prop="系统编号" />
      <el-table-column label="系统名称" align="center" prop="系统名称" width="250" :show-overflow-tooltip="true" />

      <el-table-column label="被测单位名称" align="center" prop="被测单位名称" width="250" :show-overflow-tooltip="true" />

      <el-table-column label="系统级别" align="center" prop="系统级别">
        <template slot-scope="scope">
          <el-tag :effect="'plain'" :type="getTagType(scope.row.系统级别)" size="small">
            {{ scope.row.系统级别 }}级
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="归档状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.归档状态 || '-' }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">处理</el-button>
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">提交</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="setCurrentTableData" />
  </div>
</template>

<script>
import { initList } from '@/api/record.js'
export default {
  name: "courseSubmit",
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
        pageNum: 1,
        pageSize: 10,
        ProjectID: '',
        SystemID: '',
        SystemName: ''
      },
      voidid:800,
      // 表单参数
      form: {
        state: '待归档',
        showothersys: 0,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let formData = new FormData();
      formData = {
        voidid:this.voidid,
        state: this.form.state,
        showothersys: this.form.showothersys,
        ProjectID: this.queryParams.ProjectID,
        SystemID: this.queryParams.SystemID,
        SystemName: this.queryParams.SystemName
        
      }
      this.loading=true
      initList(formData).then(res => {
        if(res.Data){
          this.originalTableData = res.Data;
          this.total = this.originalTableData.length;
          
          this.setCurrentTableData();
        }else{
          this.$message.error(res.ErrorInfo);
        }
       
        this.loading=false
      });
    },

    // 设置当前页表格数据
    setCurrentTableData() {
      const startIndex = (this.queryParams.pageNum - 1) * this.queryParams.pageSize;
      const endIndex = startIndex + this.queryParams.pageSize;
      this.currentTableData = this.originalTableData.slice(startIndex, endIndex);
    },
 
   
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      // this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.pageNum = 1;
      this.resetForm("queryForm");
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.serialNumber)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
    handleClick(row) {
      console.log(row)
      this.$router.push({
        name: 'Addrecord'
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