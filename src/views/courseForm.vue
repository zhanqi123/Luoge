<template>
  <div id="app" class="registration-container">
    <el-card class="box-card">
      <el-form ref="uploadForm" :model="formData" label-width="145px">
        <h3 class="form-title">归档文件上传</h3>

        <!-- 循环生成表单项 -->
        <div v-for="(item, index) in fileList" :key="item.文件编号">
          <el-form-item :label="item.文件名称" :required="item.是否必填">
            <div class="form-item-content">
              <el-upload class="upload-demo" :auto-upload="false" :http-request="uploadFileDrawer"
                :ref="`dmtUploadFile${index}`" :before-upload="beforeUpload"
                :on-change="(file, fileList) => handleChange(index, file, fileList, item)"
                :on-exceed="(files) => handleExceed(files, index)"
                :before-remove="(file) => { return beforeRemove(file, index) }" :file-list="fileLists[index]" multiple
                :limit="1" action="#">
                <el-button size="mini" type="success" icon="el-icon-upload"
                  :loading="uploadLoading[index]">点击上传</el-button>
              </el-upload>

              <!-- 动态生成数据标签相关的表单控件 -->
              <div v-if="item.数据标签" class="data-tags-container">
                <div v-for="(value, key) in parseDataTags(item.数据标签)" :key="key" class="dynamic-control-item">
                  <!-- 为每个动态字段添加 el-form-item -->
              
                  <el-form-item :prop="`${item.文件编号}.${key}`" :rules="getDynamicRules(item, key)" :label="key.includes('是否')?'':key"  >
                    <!-- 日期选择器 -->
                    <el-date-picker v-if="key.includes('日期')" v-model="formData[item.文件编号][key]" type="date"
                      :placeholder="key" size="mini"
                       @change="(val) => handleDataTagChange(val, item.文件编号, value)"
                       value-format="yyyy-MM-dd" style="width: 150px;"></el-date-picker>

                    <!-- 是否选择器 -->
                    <el-radio-group v-else-if="key.includes('是否')"
                    @change="(val) => handleDataTagChange(val, item.文件编号, key)"
                     v-model="formData[item.文件编号][key]" size="mini">
                      <span class="radio-label">{{ key }}:</span>
                      <el-radio label="是">是</el-radio>
                      <el-radio label="否">否</el-radio>
                    </el-radio-group>

                    <!-- 默认输入框 -->
                    <el-input v-else v-model="formData[item.文件编号][key]"
                     @change="(val) => handleDataTagChange(val, item.文件编号, key)"
                     :placeholder="key" size="mini"
                      style="width: 150px;"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>

        <el-form-item style="text-align: center;" >
          <el-button type="success"
           icon="el-icon-folder-checked"
           class="submit-btn" style="height: 44px;" :loading="submitting"
            @click="handleSubmit">
            提交
          </el-button>

 
          <el-button  class="submit-btn" type="info"   style="height: 44px;" :loading="submitting"
            @click="handleSubmit">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { initList, submitList } from '@/api/register/index.js'

export default {
  name: 'register',
  data() {
    return {
      fileLists: [], // 根据fileList长度初始化
      submitting: false,
      systemcode: null,
      flag: null,
      formData: {}, // 存储所有表单数据
      dynamicRules: {},
      fileList: [

      ],
      uploadLoading: [], // 上传加载状态数组
      existingData: [],//已经有的数据
      RuleList: [
      ]   //比较规则
    }
  },
  created() {
    const params = new URLSearchParams(window.location.search)
    if (params.get('systemcode') && params.get('flag')) {
      this.systemcode = params.get('systemcode')
      this.flag = params.get('flag')
    }

    this.getList()
  },
  methods: {
    getList() {
      let data = {
        voidid: 801,
        FileItemType: 10,
        ReportDate: '2025-03-20'
      }
      initList(data).then(res => {
        if (res.Data) {
          this.fileList = res.Data
          this.initFileLists()
          this.initFormData()
          this.getClassify()
          this.getRule(res.Data)
        } else {
          this.$modal.msgError(res.ErrorInfo);
        }

      })
    },
    // 初始化文件列表
    initFileLists() {
      this.fileLists = new Array(this.fileList.length).fill().map(() => [])
      this.uploadLoading = new Array(this.fileList.length).fill(false)
    },
    uploadFileDrawer(params) {

      let formData = new FormData();
      formData.append('file', params.file);

    },
    // 生成动态验证规则
    getDynamicRules(item, key) {
      const ruleKey = `${item.文件编号}.${key}`
      if (!this.dynamicRules[ruleKey]) {
        this.dynamicRules[ruleKey] = [
         
          {
            required: item.是否必填,
            message: `请输入${key}`,
            trigger: ['blur', 'change']
          },
        
          { validator: this.createCrossFieldValidator(item.文件编号, key), trigger: 'change' }
        ]
      }
      return this.dynamicRules[ruleKey]
    },
  
createCrossFieldValidator(fileCode, fieldName) {
  return (rule, value, callback) => {
  
    const relatedRules = this.RuleList.filter(rule =>
      (rule.基准文件编号 === fileCode && rule.基准文件属性名称 === fieldName) ||
      (rule.比较对象文件编号 === fileCode && rule.比较对象属性名称 === fieldName)
    )


    for (const rule of relatedRules) {
      const baseValue = this.formData[rule.基准文件编号]?.[rule.基准文件属性名称]
      const compareValue = this.formData[rule.比较对象文件编号]?.[rule.比较对象属性名称]

      
      if (baseValue === '' || baseValue === null || compareValue === '' || compareValue === null) {
        callback()
        continue
      }

      let isValid = true
      let errorMessage = ''

      switch (rule.比较方式) {
        case '大于等于':
          if (new Date(baseValue) < new Date(compareValue)) {
            isValid = false
            errorMessage = `${this.getFileName(rule.基准文件编号)}的${rule.基准文件属性名称}必须大于等于${this.getFileName(rule.比较对象文件编号)}的${rule.比较对象属性名称}`
          }
          break
        case '包含':
          if (!baseValue.includes(compareValue)) {
            isValid = false
            errorMessage = `${this.getFileName(rule.基准文件编号)}的${rule.基准文件属性名称}必须包含${this.getFileName(rule.比较对象文件编号)}的${rule.比较对象属性名称}`
          }
          break
        case '任意包含':
          const separatorRegex = /[、,，\s]/; // 
          const baseArr = baseValue.split(separatorRegex).filter(item => item.trim()!== '').map(s => s.trim())
          const compareArr = compareValue.split(separatorRegex).filter(item => item.trim()!== '').map(s => s.trim())
          const hasCommonInCompare = compareArr.some(item => baseArr.includes(item))
          const hasCommonInBase = baseArr.some(item => compareArr.includes(item))
          if (!hasCommonInCompare || !hasCommonInBase) {
            isValid = false
            errorMessage = `${this.getFileName(rule.基准文件编号)}的${rule.基准文件属性名称}与${this.getFileName(rule.比较对象文件编号)}的${rule.比较对象属性名称}必须互相包含至少一个对方的值`
          }
          break
        case '等于':
          if (baseValue !== compareValue) {
            isValid = false
            errorMessage = `${this.getFileName(rule.基准文件编号)}的${rule.基准文件属性名称}必须等于${this.getFileName(rule.比较对象文件编号)}的${rule.比较对象属性名称}`
          }
          break
      }

      if (!isValid) {
        callback(new Error(errorMessage))
        return
      }
    }

    callback()
  }
},
    // 辅助方法：获取文件名称
    getFileName(fileCode) {
      return this.fileList.find(item => item.文件编号 === fileCode)?.文件名称 || fileCode
    },

    // 初始化表单数据
    initFormData() {
      this.fileList.forEach(item => {
        if (item.数据标签) {
          this.$set(this.formData, item.文件编号, {})
          const tags = this.parseDataTags(item.数据标签)
          Object.keys(tags).forEach(key => {
            this.$set(this.formData[item.文件编号], key, '')
          })
        }
      })
    },

    // 解析数据标签
    parseDataTags(dataTagString) {
      if (!dataTagString) return {};

      try {
        // 处理键值对格式
        if (!dataTagString.startsWith('{')) {
          const result = {};
          dataTagString.split(',').forEach(pair => {
            const [key, value] = pair.split(':');
            if (key && value) {
              result[key.trim()] = value.trim();
            }
          });
          return result;
        }

        // 处理 JSON 格式
        // 替换中文引号和修正 JSON 格式
        const fixedString = dataTagString
          .replace(/[“”]/g, '"')  // 替换中文双引号
          .replace(/[‘']/g, '"')  // 替换中文单引号
          .replace(/\\"/g, '"')   // 替换转义的双引号
          .replace(/\s+/g, '')    // 移除空白字符
          .replace(/([{,])(\w+):/g, '$1"$2":'); // 给属性名添加引号

        return JSON.parse(fixedString);
      } catch (e) {
        console.error('数据标签解析失败:', e);
        // 如果解析失败，尝试使用键值对格式
        try {
          const result = {};
          dataTagString.split(',').forEach(pair => {
            const [key, value] = pair.split(':');
            if (key && value) {
              result[key.trim()] = value.trim();
            }
          });
          return result;
        } catch (e2) {
          console.error('数据标签解析完全失败:', e2);
          return {};
        }
      }
    },

    // 提交处理
    async handleSubmit() {
      // 检查规则

      // 原有的提交逻辑
      try {
        this.submitting = true
        await this.$refs.uploadForm.validate()
        // 2. 执行跨字段验证（触发所有自定义验证器）
        const validateResults = await Promise.all(
          Object.keys(this.dynamicRules).map(field =>
            new Promise(resolve => {
              this.$refs.uploadForm.validateField(field, error => resolve({ field, error }))
            })
          )
        )
        const hasError = validateResults.some(result => result.error)
        if (hasError) {
          throw new Error('表单验证不通过')
        } else {
          let data={
            SystemID: 'LG-SYS-02069',
            voidid: 815
          }
          initList(data).then(res=>{
            console.log(res)
          })

          return
          // 构建提交数据
          const submitData = []
          this.fileList.forEach((item, index) => {
            let fileValuesString = '';
            const formValues = this.formData[item.文件编号];
            if (formValues) {
              fileValuesString = Object.entries(formValues)
                .map(([key, value]) => `${key}:${value || ''}`) // Format as key:value
                .join(',');
            }
            submitData.push({
              obj: item.obj ? item.obj : '',
              ext: item.obj ? this.extractFileName(item.obj) : '',
              SystemID: 'LG-SYS-02069',
              FileCode: item.文件编号,
              FileValues: fileValuesString, // Use the formatted 
              voidid: 802
            })
          })
      
          await this.submitForm(submitData)
          this.$message.success('提交成功')
        }
      } catch (error) {
 
      } finally {
        this.submitting = false
      }
    },

    // 在methods中修改handleChange方法
    async handleChange(index, file, fileList, item) {
      if (fileList.length > 0) {
        try {
          // 设置当前上传项的loading状态
          this.fileLists[index] = fileList.slice(-1)
          if (!file) return
          // 执行前置校验
          let val = file.raw ? file.raw : file
          if (!this.beforeUpload(val)) {
            this.fileLists[index] = []
            return false
          }

          this.$set(this.uploadLoading, index, true)

          // 先删除旧文件
          // if (this.fileList[index].obj) {
          //   await this.deleteOldFile(index)
          // }

          const data = {
            obj: '',
            ext: file.name,
            file: file.raw ? file.raw : file,
            SystemID: 'LG-SYS-02069',
            FileCode: item.文件编号,
            FileValues: '签字日期:2025-04-16,测评组长:12,是否有被测方人员签字:是',
            voidid: 802
          }
          const res = await submitList(data)
          if (res.Data) {
            this.fileList[index].obj = res.Data[0].文件实际保存名称
          } else {
            this.handleUploadError(index, file)
          }
        } catch (error) {
          this.handleUploadError(index, file)
          console.error('上传失败:', error)
          this.$message.error(error.message || '上传失败')
        } finally {
          this.$set(this.uploadLoading, index, false)
        }
      }
    },

    beforeUpload(file) {
      const validTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]

      // 文件扩展名校验（双重校验）
      const fileExt = file.name.split('.').pop().toLowerCase()
      const validExtensions = ['doc', 'docx', 'pdf', 'xlsx', 'jpg', 'jpeg', 'png', 'gif']

      const isTypeValid = validTypes.includes(file.type) && validExtensions.includes(fileExt)
      const isSizeValid = file.size / 1024 / 1024 < 100

      if (!isTypeValid) {
        this.$message.error('仅支持上传文档、PDF、图片格式（doc/docx/pdf/xlsx/jpg/png/gif）')
        return false
      }
      if (!isSizeValid) {
        this.$message.error('文件大小不能超过100MB')
        return false
      }
      return true
    },

    handleRemove(index, file, fileList) {
      console.log(index, file, fileList)
      // this.$set(this.fileLists, index, fileList)
    },
    // 统一处理上传错误
    handleUploadError(index, file) {
      this.fileLists[index] = []
      const uploadRef = this.$refs[`dmtUploadFile${index}`]
      if (uploadRef) {
        const idx = uploadRef[0].uploadFiles.findIndex(f => f.uid === file.uid)
        if (idx > -1) uploadRef[0].uploadFiles.splice(idx, 1)
      }
    },
    async deleteOldFile(index) {
      try {
        const data = {
          FileSaveName: this.fileList[index].obj,
          voidid: 807
        }
        await initList(data)
        this.fileList[index].obj = ''
      } catch (error) {
        console.error('旧文件删除失败:', error)
        throw new Error('旧文件清理失败，请稍后重试')
      }
    },


    beforeRemove(file, index) {
      return new Promise((resolve) => {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          let data = {
            FileSaveName: this.fileList[index].obj,
            voidid: 807
          }
          initList(data).then(res => {
            if (res.Data) {
              this.fileList[index].obj = ''
              this.$message.success('删除成功')
              resolve(true)
            } else {
              this.$message.error(res.ErrorInfo)
              resolve(false)
            }
          })
        }).catch(() => {
          resolve(false);
        });
      })
    },


    submit(val) {
      submitList(val).then(res => {
        console.log(res)
      })
    },

    //截取字符串
    extractFileName(str) {
      const lastUnderscoreIndex = str.lastIndexOf('_');
      const dataIndex = str.indexOf('.data', lastUnderscoreIndex);
      if (lastUnderscoreIndex !== -1 && dataIndex !== -1) {
        return str.slice(lastUnderscoreIndex + 1, dataIndex);
      }
      return null;
    },
    handleExceed(files, index) {
      // 自动替换已有文件
      this.fileLists[index] = [] // 清空当前文件列表
      this.handleChange(index, files[0], [files[0]], this.fileList[index])
    },

    //获取归档文件
    getClassify() {
      const data = {
        SystemID: 'LG-SYS-02069',
        voidid: 806
      }
      submitList(data).then(res => {
        this.existingData = res.Data
        this.fileList.forEach((fileItem, index) => {
          const existingFile = this.existingData.find(item => item.文件编号 == fileItem.文件编号)
          if (existingFile) {
            // 回显文件实际保存名称
            fileItem.obj = existingFile.文件实际保存名称

            // 在 fileLists 中显示已上传的文件
            if (existingFile.文件实际保存名称) {
              const fileName = this.extractFileName(existingFile.文件实际保存名称)
              this.fileLists[index] = [{
                name: fileName,
                url: existingFile.文件实际保存名称
              }]
            }

            // 如果存在数据标签，解析并回显
            if (existingFile.数据标签 && fileItem.数据标签) {
              try {
                // 解析 existingFile 的数据标签
                let existingTags = {}
                if (existingFile.数据标签.startsWith('{')) {
                  // JSON 格式的数据标签
                  existingTags = this.parseDataTags(existingFile.数据标签)
                } else {
                  // 键值对格式的数据标签
                  existingFile.数据标签.split(',').forEach(pair => {
                    const [key, value] = pair.split(':')
                    if (key && value) {
                      existingTags[key.trim()] = value.trim()
                    }
                  })
                }

                // 确保 formData 中对应的文件编号对象存在
                if (!this.formData[fileItem.文件编号]) {
                  this.$set(this.formData, fileItem.文件编号, {})
                }

                // 遍历并回显数据标签的值
                Object.entries(existingTags).forEach(([key, value]) => {
                  this.$set(this.formData[fileItem.文件编号], key, value)
                })
              } catch (e) {
                console.error('数据标签解析失败:', e)
              }
            }
          }
        })
      })
    },
    getRule(val) {

      const fileNumbers = val.map(item => item["文件编号"]).filter(Boolean).join(',');

      const data = {
        FileCode: fileNumbers,
        voidid: 814
      }
      initList(data).then(res => {
        if (res.Data) {
          this.RuleList = res.Data
        }
      })
    },
    async submitForm(val) {
      const newData = val.map(item => {
        return {
          SystemID: item.SystemID,
          FileValuesJson: item.FileValues,
          voidid: 815
        };
      });
     const data=  await initList(newData)
     console.log(data,'888')
 
      // for (const item of newData) {
      //   await initList(item)
      // }
    },

       // 处理数据标签值变化
       async handleDataTagChange(value, fileCode, fieldName) {
        let fileValuesString = '';
        const formValues = this.formData[fileCode];
        if (formValues) {
              fileValuesString = Object.entries(formValues)
                .map(([key, value]) => `${key}:${value || ''}`) // Format as key:value
                .join(',');
            }
            
      try {
        // 构建请求数据
        const requestData = {
          SystemID: 'LG-SYS-02069',
          FileCode: fileCode,
          FieldValue: fileValuesString,
          voidid: 816  // 假设这是验证接口的ID
        }

        // 调用后端接口
        const response = await initList(requestData)
        console.log(response)
        
        if (response.Data) {
          // 接口返回成功，更新数据
          this.$set(this.formData[fileCode], fieldName, value)
          this.$message.success('验证成功')
        } else {
          // 接口返回失败，清空当前值
          this.$set(this.formData[fileCode], fieldName, '')
          this.$message.error(response.ErrorInfo || '验证失败')
        }
      } catch (error) {
        // 发生错误，清空当前值
        this.$set(this.formData[fileCode], fieldName, '')
        this.$message.error('验证失败，请重试')
        console.error('数据标签验证失败:', error)
      }
    },

  }
}
</script>

<style scoped>
.registration-container {
  width: 100%;
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

.form-item-content {
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中对齐 */
  /* flex-wrap: wrap; */
  flex-wrap: nowrap;
  align-items: flex-start
  /* 允许换行 */
}

.upload-demo {
  margin-right: 15px;
  /* 上传按钮和动态控件之间的间距 */
}

.data-tags-container {
  display: flex;
  /* 使内部控件也水平排列 */
  align-items: center;
  flex-wrap: wrap;
  /* 允许内部控件换行 */
}

.dynamic-control-item {
  margin-right: 10px;
  /* 每个动态控件之间的间距 */
  margin-bottom: 22px;
  /* 添加底部间距，用于换行时的垂直间距 */
  display: flex;
  /* 用于内部标签和控件对齐 */
  align-items: center;
}

.radio-label {
  margin-right: 5px;
  /* 单选框标签和选项的间距 */
  font-size: 14px;
  /* 保持字体大小一致 */
  color: #606266;
}

/* 移除嵌套的 el-form-item 默认样式 */
.nested-form-item {
  margin-left: 0;
  margin-bottom: 0;
}

.nested-form-item .el-form-item__label {
  display: none;
  /* 隐藏内部 el-form-item 的标签 */
}

.el-input__inner,
.el-date-editor.el-input {
  height: 28px;
  /* 统一 mini 尺寸控件的高度 */
  line-height: 28px;
}

.el-radio-group {
  line-height: 28px;
  /* 调整单选框组的行高以对齐 */
}

.submit-btn {
  width: 15%;
  margin-top: 20px;
  color: #fff !important;
  font-weight: bold;
  text-align: center;
}

.el-date-picker {
  width: 150px !important;
  /* 调整日期选择器宽度 */
}
</style>    