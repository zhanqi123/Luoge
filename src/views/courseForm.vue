<template>
  <div id="app" class="registration-container">
    <el-card class="box-card">
      <el-form label-width="180px">
        <h3 class="form-title">归档文件上传</h3>

        <!-- 循环生成上传项 -->
        <el-form-item v-for="(item, index) in fromList" :key="item.文件编号" :label="item.文件名称" :required="item.是否必填">
          <el-upload class="upload-demo" :auto-upload="false"
            :on-change="(file, fileList) => handleChange(index, file, fileList)"
            :on-remove="(file, fileList) => handleRemove(index, file, fileList)" :before-remove="beforeRemove"
            :file-list="fileLists[index]" multiple :limit="3" :on-exceed="handleExceed" action="#">
            <el-button size="mini" type="success" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item style="text-align: center;" label-width="0">
          <el-button type="primary" class="submit-btn" style="height: 44px;" :loading="submitting"
            @click="handleSubmit">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { initList } from '@/api/register/index.js'

export default {
  name: 'register',
  data() {
    return {
      fileLists: [], // 根据fromList长度初始化
      submitting: false,
      systemcode: null,
      flag: null,
      fromList: [
        // {
        //   "文件编号": "R013",
        //   "文件名称": "LG_2W01_R013测评风险告知书",
        //   "数据标签": "",
        //   "是否必填": true
        // },
        // {
        //   "文件编号": "R014",
        //   "文件名称": "LG_2W01_R014现场测评授权书",
        //   "数据标签": "",
        //   "是否必填": true
        // },
        // {
        //   "文件编号": "R019",
        //   "文件名称": "LG_2W01_R019验证测试授权书",
        //   "数据标签": "",
        //   "是否必填": false
        // },
        // {
        //   "文件编号": "R015",
        //   "文件名称": "LG_2W01_R015自愿放弃验证测试声明",
        //   "数据标签": "",
        //   "是否必填": false
        // }
      ]

    }
  },
  created() {
 
    // this.getList()
    const params = new URLSearchParams(window.location.search)
    if (params.get('systemcode') && params.get('flag')) {
      this.systemcode = params.get('systemcode')
      this.flag = params.get('flag')
    }
    this.initFileLists()
  },
  methods: {
    // 初始化文件列表
    initFileLists() {
      let data={
        voidid:801,
        FileItemType:1,
        ReportDate:'2025-04-03'
      }
      initList(data).then(res=>{
         console.log(res)
      })
      // this.fileLists = this.fromList.map(() => [])
    },

    // 提交处理
    async handleSubmit() {
      // 检查必填项
      const missingRequired = this.fromList.some((item, index) => {
        return item.是否必填 && this.fileLists[index].length === 0
      })

      if (missingRequired) {
        this.$message.error('请上传所有必填文件')
        return
      }

      try {
        this.submitting = true

        // 构建提交数据
        const submitData = []
        this.fromList.forEach((item, index) => {
          this.fileLists[index].forEach(file => {
            const fileName = file.name
            const ext = fileName.slice(fileName.lastIndexOf('.') + 1)

            submitData.push({
              obj: file.raw,
              ext: ext,
              SystemID: this.systemcode,
              FileCode: item.文件编号,
              FileValues: item.数据标签
            })
          })
        })

        // 调用API（示例）
        // await yourApi.submitFiles(submitData)
        console.log(submitData)
         return
        await new Promise(resolve => setTimeout(resolve, 1500))
        this.$message.success('提交成功')
        this.fileLists = this.fromList.map(() => [])
      } catch (error) {
        console.error('提交失败:', error)
        this.$message.error('提交失败')
      } finally {
        this.submitting = false
      }
    },

    // 其他方法保持不变...
    handleChange(index, file, fileList) {
      const isValid = this.beforeUpload(file.raw)
      if (!isValid) {
        this.fileLists[index] = this.fileLists[index].filter(item => item.uid !== file.uid)
        return false
      }
      this.$set(this.fileLists, index, fileList)
      return true
    },

    beforeUpload(file) {
      // 保持原有校验逻辑
      const validTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg', 'image/png', 'image/gif'
      ]
      const isTypeValid = validTypes.includes(file.type)
      const isSizeValid = file.size / 1024 / 1024 < 10

      if (!isTypeValid) {
        this.$message.error('文件格式不支持')
        return false
      }
      if (!isSizeValid) {
        this.$message.error('文件大小不能超过10MB')
        return false
      }
      return true
    },

    handleRemove(index, file, fileList) {
      this.$set(this.fileLists, index, fileList)
    },
    beforeRemove(){},
    handleExceed(){}
  }
}
</script>

<style scoped>
.registration-container {
  width: 100%;
  /* margin: 50px auto; */
  /* padding: 20px; */
  background: #f5f7fa;
  border-radius: 10px;
}

.box-card {
  margin: 0 10% 20px 10%;
}

.el-form {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  color: #409eff;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.el-form-item {
  margin-bottom: 15px;
}

.el-input__inner {
  border: 1px solid #dcdfe6;
  height: 36px;
}

.el-select {
  width: 80px;
}

.submit-btn {
  width: 30%;
  margin-top: 20px;
  /* background: #ff4949 !important;
  border-color: #ff4949 !important; */
  color: #fff !important;
  font-weight: bold;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #ff4949 !important;
  border-color: #ff4949 !important;
}

.el-checkbox__label {
  color: #606266;
  font-size: 12px;
}
</style>