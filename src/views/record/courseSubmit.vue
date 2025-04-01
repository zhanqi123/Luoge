<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="项目编码" prop="noticeTitle">
          <el-input v-model="queryParams.noticeTitle" placeholder="请输入项目编码" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="系统编号" prop="createBy">
          <el-input v-model="queryParams.createBy" placeholder="请输入系统编号" clearable @keyup.enter.native="handleQuery" />
          <!-- <el-select v-model="queryParams.createBy" placeholder="选择操作人员" clearable>
            <el-option
              v-for="dict in options"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="系统名称" prop="noticeType" label-width="120px">
          <el-input v-model="queryParams.noticeTitle" placeholder="请输入系统名称" clearable
            @keyup.enter.native="handleQuery" />
          <!-- <el-select v-model="queryParams.noticeType" placeholder="选择报告编制人" clearable>
            <el-option
              v-for="dict in options"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>


    <el-table :data="currentTableData">
      <!-- <el-table-column label="序号" align="center" prop="A" width="100" /> -->
      <el-table-column label="项目编号" align="center" prop="项目编号" />
      <el-table-column label="系统编号" align="center" prop="系统编号" />
      <el-table-column label="系统名称" align="center" prop="系统名称" />
      <el-table-column label="被测单位名称" align="center" prop="被测单位名称" width="250" />

      <el-table-column label="系统级别" align="center" prop="系统级别">
        <template slot-scope="scope">
          <div v-if="scope.row.系统级别 == 2">
            <el-tag effect="plain">
              {{ scope.row.系统级别 }} <span style="margin-left: 2px;">级</span>
            </el-tag>
          </div>
          <div v-else>
            <el-tag effect="plain" type="success">
              {{ scope.row.系统级别 }} <span style="margin-left: 2px;">级</span>
            </el-tag>
          </div>

          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">提交</el-button> -->
        </template>

      </el-table-column>




      <!-- <el-table-column label="测评组人员" align="center" prop="n" /> -->
      <el-table-column label="归档状态" align="center" prop="归档状态"/>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">

          <el-button type="text" size="small">查看</el-button>
          <el-button @click="handleClick(scope.row)" type="text" size="small">处理</el-button>
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">提交</el-button> -->
        </template>

      </el-table-column>

    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { initList } from '@/api/login'
import axios from 'axios'
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
      options: [
        {
          value: 1,
          label: '张三'
        },
        {
          value: 2,
          label: '李四'
        },
        {
          value: 3,
          label: '赵五'
        },
        {
          value: 12,
          label: '测试好'
        }
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "change" }
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
        voidid: 800,
        state: '待归档',
        showothersys: 1
      }

      axios.post(
        '/RequestInterface.aspx?/request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      ).then(res => {
        if (res.data.Data.length > 0) {
          this.originalTableData = res.data.Data;
          this.total = this.originalTableData.length;
          this.setCurrentTableData();
        }
      })

      return

      formData = {
        voidid: 800,
        state: '未开始,待归档',
        showothersys: 1
      }
      console.log(formData)

      initList(formData).then(res => {
        console.log(res, '555')
      })
    },
    // 设置当前页表格数据
    setCurrentTableData() {
      const startIndex = (this.queryParams.pageNum - 1) * this.queryParams.pageSize;
      const endIndex = startIndex + this.queryParams.pageSize;
      this.currentTableData = this.originalTableData.slice(startIndex, endIndex);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.serialNumber)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // 这里暂未实现具体获取修改数据逻辑，可按需补充
      console.log('修改操作', row);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId !== undefined) {
            // 这里暂未实现具体更新逻辑，可按需补充
            console.log('修改数据提交');
          } else {
            // 这里暂未实现具体新增逻辑，可按需补充
            console.log('新增数据提交');
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const noticeIds = row.serialNumber || this.ids
      this.$modal.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项？').then(function () {
        // 这里暂未实现具体删除逻辑，可按需补充
        console.log('删除操作');
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
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