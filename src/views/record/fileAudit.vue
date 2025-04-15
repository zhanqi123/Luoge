<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="文件名称" prop="ProjectID">
          <el-input v-model="queryParams.ProjectID" placeholder="请输入文件名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="文件编号" prop="SystemName">
          <el-input v-model="queryParams.SystemName" placeholder="请输入文件编号" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="系统编号" prop="SystemID">
          <el-input v-model="queryParams.SystemID" placeholder="请输入系统编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="锁定状态" prop="锁定状态">
          <el-select v-model="queryParams.锁定状态" placeholder="请选择锁定状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="currentTableData" v-loading="loading">

      <el-table-column label="文件名称" align="center" prop="文件名称" :show-overflow-tooltip="true" min-width="200" />
      <el-table-column label="文件编号" align="center" prop="文件编号" :show-overflow-tooltip="true" min-width="140" />
      <el-table-column label="文件实际保存名称" align="center" prop="文件实际保存名称" min-width="200" :show-overflow-tooltip="true" />
      <el-table-column label="数据标签" align="center" prop="数据标签" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column label="引用对象系统编号" align="center" prop="引用对象系统编号" :show-overflow-tooltip="true" min-width="140" />
      <el-table-column label="上传人员" align="center" prop="上传人员" :show-overflow-tooltip="true" min-width="80" />
      <el-table-column label="上传时间" align="center" prop="上传时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ formattedTime(scope.row.上传时间) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被测单位名称" align="center" prop="被测单位名称" min-width="160" :show-overflow-tooltip="true" />

      <el-table-column label="锁定状态" align="center" prop="锁定状态" min-width="120">
        <template slot-scope="scope">
          <el-tag effect='plain' size="small">
            {{ scope.row.锁定状态 }}
          </el-tag>

        </template>
      </el-table-column>
      <!-- <el-table-column label="审核状态" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.审核状态 || '-' }}
        </template>
      </el-table-column> -->

      <el-table-column fixed="right" label="操作" align="center" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">审核</el-button>
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">提交</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="setCurrentTableData" />

    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="LG_2W01_R013测评风险告知书"><el-link type="primary" :underline="false">file_gd_LG-SYS-02308_R013_xlsx.data<i class="el-icon-view el-icon--right" style="color: #303133;margin-left: 5px;">查看</i> </el-link></el-descriptions-item>
        <el-descriptions-item label="LG_2W01_R014现场测评授权书"> <el-link type="primary" :underline="false">表单最新逻辑.xlsx<i class="el-icon-view el-icon--right" style="color: #303133;margin-left: 5px;">查看</i> </el-link> </el-descriptions-item>
        <el-descriptions-item label="LG_2W01_R019验证测试授权书"><el-link type="primary" :underline="false">file_gd_LG-SYS-02308_R013_xlsx.data<i class="el-icon-view el-icon--right" style="color: #303133;margin-left: 5px;">查看</i> </el-link></el-descriptions-item>
        <el-descriptions-item label="LG_2W01_R015自愿放弃验证测试声明"><el-link type="primary" :underline="false">file_gd_LG-SYS-02308_R013_xlsx.data<i class="el-icon-view el-icon--right" style="color: #303133;margin-left: 5px;">查看</i> </el-link></el-descriptions-item>


      </el-descriptions>
      <div style="margin-top: 20px;">

 
      <el-form ref="form" :rules="rules" :model="form" label-width="auto">
        <el-form-item label="审批结果" prop="resource">
          <el-radio-group v-model="form.resource" >
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="不通过理由" prop="desc" v-if="form.resource==2">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button  @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { initList } from '@/api/record.js'
export default {
  name: "fileAudit",
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
      options: [{
        value: '正常',
        label: '正常'
      }, {
        value: '审核锁定中',
        label: '审核锁定中'
      }, {
        value: '归档锁定中',
        label: '归档锁定中'
      }, {
        value: '外部引用',
        label: '外部引用'
      }
      ],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      dialogVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ProjectID: '',
        SystemID: 'LG-SYS-00120',
        SystemName: ''
      },
      form:{
        resource:'',
        desc:''
      },
      rules: {
       
          resource: [
            { required: true, message: '请选择审核结果', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写不通过理由', trigger: 'blur' }
          ]
        }



    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let formData = new FormData();
      formData = {
        //   voidid:this.voidid,
        //   state: this.form.state,
        //   showothersys: this.form.showothersys,
        //   ProjectID: this.queryParams.ProjectID,
        //   SystemID: this.queryParams.SystemID,
        //   SystemName: this.queryParams.SystemName
        SystemID: this.queryParams.SystemID,
        voidid: 806

      }
      this.loading = true
      initList(formData).then(res => {
        if (res.Data) {
          this.originalTableData = res.Data;
          this.total = this.originalTableData.length;

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
      this.title = '归档文件审核'
      this.form={
        resource:'',
        desc:''
      }
      
      this.dialogVisible = true
      // this.$router.push({
      //   name: 'Addrecord'
      // });
    },
    handleClose() {
      this.$refs.form.resetFields();
      this.dialogVisible = false
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
    formattedTime(val) {
      const date = new Date(val);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    onSubmit(){

      this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('请确认您的审核结果, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
          this.$refs.form.resetFields();
          this.dialogVisible=false
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

        return
 
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