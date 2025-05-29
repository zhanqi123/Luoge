<template>
  <div class="project-container">
    <el-card class="box-card">
      <h2>人员信息列表</h2>
      <div class="search-area">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="queryParams.projectName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码">
            <el-input v-model="queryParams.projectId" placeholder="请输入身份证号码"></el-input>
          </el-form-item>
          <el-form-item label="在职状态">
            <el-select v-model="queryParams.status" placeholder="请选择在职状态">
              <el-option label="在职" value="ongoing"></el-option>
              <el-option label="离职" value="completed"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-card>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:menu:add']">入职人员</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column type="selection" width="55" />

      <el-table-column label="姓名" prop="name" width="80"  :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="性别" prop="gender" width="80"  :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="出生年月" prop="year" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="身份证号码" prop="gender"   width="100"  :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="手机号码" prop="phone"  :show-overflow-tooltip="true" align="center"/>
      
      <el-table-column label="学历" prop="gender"  :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="专业" prop="gender"  :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="毕业院校" prop="gender" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="所属部门" prop="department" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="岗位" prop="position"  :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="学历" prop="education" :show-overflow-tooltip="true" align="center"/>

      <el-table-column label="入职日期" prop="entryDate" :show-overflow-tooltip="true" align="center"/>
      <el-table-column label="离职日期" prop="entryDate" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="证书信息" width="250" align="center">
        <template #default="{ row }">
          <el-collapse class="border-none certificate-collapse">
            <el-collapse-item class="certificate-collapse-item">
              <template #title>
                <span class="text-blue-600 hover:underline cursor-pointer">查看证书</span>
              </template>
              <div class="bg-gray-100 p-3 rounded-md shadow-sm certificate-content">
                <p class="mb-2 flex items-center"><strong class="w-24">证书类型：</strong><span>{{ row.certificate.type }}</span></p>
                <p class="mb-2 flex items-center"><strong class="w-24">证书级别：</strong><span>{{ row.certificate.level }}</span></p>
                <p class="mb-2 flex items-center"><strong class="w-24">证书编号：</strong><span>{{ row.certificate.number }}</span></p>
                <p class="mb-2 flex items-center"><strong class="w-24">发证日期：</strong><span>{{ row.certificate.issueDate }}</span></p>
                <p class="mb-2 flex items-center"><strong class="w-24">到期日期：</strong><span>{{ row.certificate.issueDate }}</span></p>
                <p class="mb-2 flex items-center"><strong class="w-24">迁入日期：</strong><span>{{ row.certificate.issueDate }}</span></p>
                <p class="mb-0 flex items-center"><strong class="w-24">迁出日期：</strong><span>{{ row.certificate.issueDate }}</span></p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>
      <el-table-column label="在职状态" width="100"  align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '在职' ? 'success' : 'danger'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
  
      <el-table-column label="操作" width="300" fixed="right"  align="center">
        <template #default="{ row }">
          <el-button link size="mini" type="primary" @click="handleView(row)">部门变更</el-button>
          <el-button link size="mini" type="primary" @click="handleEdit(row)">修改信息</el-button>
          <el-button link size="mini" type="danger" @click="handleDelete(row)">人员离职</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      tableData: [
        {
          name: '陈思远',
          gender: '男',
          department: '技术部',
          position: '高级工程师',
          education: '研究生',
          phone: '13812345678',
          entryDate: '2022-01-15',
          status: '在职',
          year:'1992-10-12',
          certificate: {
            type: '高级工程师证书',
            level: '高级',
            number: 'GCS2022001',
            issueDate: '2022-03-01'
          }
        },
        {
          name: '林雨晴',
          gender: '女',
          department: '人事部',
          year:'1992-10-12',
          position: 'HR主管',
          education: '本科',
          phone: '13987654321',
          entryDate: '2021-06-20',
          status: '在职',
          certificate: {
            type: 'HR职业资格证书',
            level: '中级',
            number: 'HR2021089',
            issueDate: '2021-08-15'
          }
        }
      ]
    }
  },
  created() {

  },
  methods: {
    handleAdd(){},
    resetSearch(){},
    handleSearch(){}
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

::v-deep .el-collapse {
  border: none;
}

::v-deep .el-input .el-input__wrapper {
  background-color: #fff;
}

.el-select :deep(.el-input__wrapper) {
  background-color: #fff;
}

::v-deep .el-collapse .el-collapse-item__header {
  border: none;
  padding: 0;
}

::v-deep .el-collapse .el-collapse-item__arrow {
  margin-left: 4px;
}

::v-deep .el-collapse .el-collapse-item__content {
  padding-bottom: 0;
}

.text-blue-600 {
  color: #2563eb;
  margin-left: 5px;
}

.certificate-collapse {
  border: none;
}

.certificate-collapse-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.certificate-content {
  border-top: 1px solid #e5e7eb;
}

.certificate-content p {
  font-size: 0.875rem;
  color: #374151;
}

.certificate-content strong {
  font-weight: 600;
}
</style>    