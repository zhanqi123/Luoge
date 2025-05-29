<template>
  <div id="app" class="registration-container">
    <el-card class="box-card">
      <div class="custom-form">
        <!-- <h3 class="form-title">审核归档文件</h3> -->

        <!-- 文件信息展示 -->
        <div v-for="(item, index) in fileList" :key="item.文件编号" class="form-item-wrapper">
          <el-descriptions :title="item.文件名称" :column="1" border>
            <!-- 文件信息 -->
            <el-descriptions-item label="文件" :labelStyle='labelStyle'>
              <div class="file-display">
                <span v-if="fileLists[index] && fileLists[index].length > 0" class="file-name">
                  {{ fileLists[index][0].name }}
                </span>
                <span v-else class="no-file">暂无文件</span>
                <el-button v-if="fileLists[index] && fileLists[index].length > 0" size="mini" type="primary"
                  icon="el-icon-download" @click="downloadFile(index)">
                  下载
                </el-button>
              </div>
            </el-descriptions-item>

            <!-- 数据标签信息 -->
            <template v-if="item.数据标签">
              <el-descriptions-item v-for="(value, key) in parseDataTags(item.数据标签)" :key="key" :label="key">
                <el-date-picker v-if="key.includes('日期')" v-model="formData[item.文件编号][key]" type="date"
                  :placeholder="key" size="mini" disabled value-format="yyyy-MM-dd"
                  class="custom-date-picker"></el-date-picker>

                <span v-else-if="key.includes('是否')">
                  <div v-if="formData[item.文件编号][key]">
                    <el-tag effect="dark" :type="formData[item.文件编号][key] == '是' ? 'success' : 'danger'"> {{
                      formData[item.文件编号][key] }}</el-tag>
                  </div>
                  <div v-else>
                    暂无数据
                  </div>

                </span>

                <el-input v-else v-model="formData[item.文件编号][key]" :placeholder="key" size="mini" disabled
                  class="custom-input"></el-input>
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </div>

        <!-- 审核意见区域 -->
        <!-- <el-descriptions title="审核意见" :column="1" border class="audit-opinion">
          <el-descriptions-item label="审核结果">
            <el-radio-group v-model="auditResult" size="medium">
              <el-radio label="通过">通过</el-radio>
              <el-radio label="不通过">不通过</el-radio>
            </el-radio-group>
          </el-descriptions-item>

          <el-descriptions-item v-if="auditResult === '不通过'" label="不通过原因">
            <el-input type="textarea" v-model="rejectReason" :rows="3" placeholder="请输入不通过原因"></el-input>
          </el-descriptions-item>
        </el-descriptions> -->

        <!-- 按钮区域 -->
        <!-- <div class="submit-buttons">
          <el-button type="success" icon="el-icon-folder-checked" class="submit-btn" :loading="submitting"
            @click="debouncedSubmit">
            提交审核
          </el-button>
          <el-button class="submit-btn cancel-btn" @click="back">
            取消
          </el-button>
        </div> -->
      </div>
    </el-card>
  </div>
</template>

<script>

import { initList, submitList } from '@/api/register/index.js'
import { debounce } from 'lodash'

export default {
  name: 'auditFrom',
  props: {
    myObject: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      fileLists: [], // 根据fileList长度初始化
      submitting: false,
      systemcode: null,

      SystemID: null,//系统编号
      ReportDate: null,//报告封面日期
      formData: {}, // 存储所有表单数据
      dynamicRules: {},
      fileList: [],
      uploadLoading: [], // 上传加载状态数组
      existingData: [],//已经有的数据
      RuleList: [],   //比较规则
      obj: null,
      auditResult: '',
      rejectReason: '',
      labelStyle: { 'width': '200px' },
    }
  },
  created() {

    this.ReportDate = this.myObject.ReportDate
    this.SystemID = this.myObject.SystemID
    this.FileItemType = this.myObject.FileItemType
    this.getList()
    this.debouncedSubmit = debounce(this.handleSubmit, 1000)

  },
  methods: {
    getList() {

      let data = {
        voidid: 801,
        FileItemType: this.FileItemType,
        ReportDate: this.ReportDate
      }
      this.$modal.loading('正在加载中...');
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

    },
    // 初始化表单数据
    initFormData() {
      this.fileList.forEach(item => {
        if (item.数据标签) {
          // 确保文件编号对象存在
          if (!this.formData[item.文件编号]) {
            this.$set(this.formData, item.文件编号, {});
          }

          const tags = this.parseDataTags(item.数据标签);
          Object.keys(tags).forEach(key => {
            // 使用 $set 确保响应式
            this.$set(this.formData[item.文件编号], key, tags[key] || '');
          });
        }
      });
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
        const fixedString = dataTagString
          .replace(/[""]/g, '"')
          .replace(/[“”]/g, '"')  // 替换中文双引号
          .replace(/['']/g, '"')
          .replace(/\\"/g, '"')
          .replace(/\s+/g, '')
          .replace(/([{,])(\w+):/g, '$1"$2":');

        return JSON.parse(fixedString);
      } catch (e) {
        console.error('数据标签解析失败:', e);
        return {};
      }
    },

    // 提交处理
    async handleSubmit() {
      try {
        this.submitting = true;

        // 验证审核结果
        if (!this.auditResult) {
          this.$message.warning('请选择审核结果');
          return;
        }

        // 如果选择不通过，验证原因
        if (this.auditResult === '不通过' && !this.rejectReason) {
          this.$message.warning('请填写不通过原因');
          return;
        }

        // 构建提交数据
        const submitData = {
          SystemID: this.SystemID,
          AuditResult: this.auditResult,
          RejectReason: this.rejectReason,
          voidid: 815
        };

        const res = await initList(submitData);
        if (res.Data) {
          this.$message({
            message: '审核提交成功',
            type: 'success',
            duration: 2000,
            onClose: () => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$message.error(res.ErrorInfo || '提交失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败，请稍后重试');
      } finally {
        this.submitting = false;
      }
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
    //获取归档文件
    getClassify() {
      const data = {
        SystemID: this.SystemID,
        voidid: 806
      }
      submitList(data).then(res => {
        if (res.Data) {
          res.Data.forEach(item => {
            item.fileId = JSON.parse(JSON.stringify(item.文件实际保存名称))
          })
          this.existingData = res.Data
          this.fileList.forEach((fileItem, index) => {
            const existingFile = this.existingData.find(item => item.文件编号 == fileItem.文件编号)
            if (existingFile) {
              // 回显文件实际保存名称
              fileItem.obj = existingFile.文件实际保存名称
              fileItem.fileId = existingFile.fileId
              // 在 fileLists 中显示已上传的文件
              if (existingFile.文件实际保存名称) {
                const fileName = this.extractFileName(existingFile.文件实际保存名称)
                // 使用 $set 确保响应式更新
                this.$set(this.fileLists, index, [{
                  name: fileName,
                  url: existingFile.文件实际保存名称,
                  btnFlag: existingFile.锁定状态
                }])
              }
              // 如果存在数据标签，解析并回显
              if (existingFile.数据标签 && fileItem.数据标签) {
                try {
                  const existingTags = this.parseDataTags(existingFile.数据标签)
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
          this.$modal.closeLoading()
        } else {
          this.$message.error(res.ErrorInfo)
        }
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
        } else {
          this.$message.error(res.ErrorInfo)
        }
      })
    },
    //返回
    back() {
      this.$confirm('确定要取消审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          SystemID: this.SystemID,
          FileCode: '',
          Remark: '取消审核',
          voidid: 817,
        };
        initList(data).then(res => {
          if (res.Data) {
            this.$router.go(-1);
          } else {
            this.$message.error(res.ErrorInfo);
          }
        });
      }).catch(() => { });
    },
    // 下载文件
    async downloadFile(index) {
  
      try {
        const file = this.fileLists[index][0];
        if (!file) return;

        const data = {
          FileSaveName: file.url,
          voidid: 803 // 假设这是下载文件的接口ID
        };
        this.$modal.loading('拼命下载中...');
        const response = await initList(data);

        if (response.Data) {
          // 将 Base64 编码的二进制数据转换为 Uint8Array
          const binaryString = atob(response.Data[0].byte);
          const binaryLength = binaryString.length;
          const bytes = new Uint8Array(binaryLength);
          for (let i = 0; i < binaryLength; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          // 创建 Blob 对象
          const blob = new Blob([bytes], { type: 'application/octet-stream' });
          // 创建下载链接
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.$modal.closeLoading()
        } else {
          this.$message.error(response.ErrorInfo || '下载失败');
          this.$modal.closeLoading()
        }
      } catch (error) {

        this.$message.error('下载失败，请稍后重试');
        this.$modal.closeLoading()
      }
    },
  }
}
</script>

<style scoped>
.registration-container {
  width: 100%;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%); */
  /* min-height: 50vh; */
  padding: 30px 0;
}

.box-card {
  margin: 0 auto;
  /* max-width: 1250px; */
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: none;
  transition: all 0.3s ease;
}

.box-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.custom-form {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
}

.form-title {
  text-align: center;
  color: #409eff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #409eff;
  position: relative;
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: #409eff;
}

.form-item-wrapper {
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

.form-item-wrapper:hover {
  transform: translateY(-2px);
}

.file-display {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
  background: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  min-width: 300px;
}

.file-display:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.file-name {
  color: #409EFF;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 200px;
}

.no-file {
  color: #909399;
  font-size: 14px;
  font-style: italic;
}

.audit-opinion {
  margin: 30px 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.audit-opinion :deep(.el-descriptions__label) {
  color: #606266;
  font-weight: 600;
}

.audit-opinion :deep(.el-descriptions__content) {
  color: #303133;
  font-weight: 500;
}

.submit-buttons {
  margin-top: 40px;
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
}

.submit-btn {
  width: 140px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  margin: 0 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background: #f4f4f5;
  border-color: #dcdfe6;
  color: #606266;
}

.cancel-btn:hover {
  background: #e9e9eb;
  border-color: #c0c4cc;
  color: #606266;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .registration-container {
    padding: 15px;
  }

  .custom-form {
    padding: 20px;
  }

  .submit-btn {
    width: 100%;
    margin: 10px 0;
  }

  .file-display {
    flex-direction: column;
    align-items: flex-start;
    min-width: auto;
  }
}

/* 自定义 el-descriptions 样式 */
:deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  color: #606266;
  background-color: #f8f9fa;
  width: 150px;
  min-width: 150px;
  text-align: right;
  padding-right: 20px;
}

:deep(.el-descriptions__content) {
  color: #303133;
  padding-left: 20px;
  min-width: 200px;
}

:deep(.el-descriptions__body) {
  background-color: #fff;
}

:deep(.el-descriptions__cell) {
  padding: 12px 15px;
}

:deep(.el-descriptions__table) {
  table-layout: fixed;
}

/* 数据标签样式 */
.data-tag-item {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.data-tag-item:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-tag-item :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
  width: 150px;
  min-width: 150px;
  text-align: right;
  padding-right: 20px;
}

.data-tag-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

/* 输入框样式 */
.custom-date-picker,
.custom-input {
  width: 100%;
  min-width: 200px;
}

.custom-date-picker :deep(.el-input__inner),
.custom-input :deep(.el-input__inner) {
  color: #409EFF;
  font-weight: 500;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
}

.custom-date-picker :deep(.el-input__inner:hover),
.custom-input :deep(.el-input__inner:hover) {
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.custom-date-picker :deep(.el-input__inner:focus),
.custom-input :deep(.el-input__inner:focus) {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

/* 布尔值显示样式 */
.boolean-value {
  color: #67C23A;
  font-size: 14px;
  font-weight: 500;
  padding: 0 10px;
  background-color: #f0f9eb;
  border-radius: 4px;
  display: inline-block;
  min-width: 40px;
  text-align: center;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  :deep(.el-descriptions__label) {
    width: 100px;
    min-width: 100px;
  }

  .data-tag-item :deep(.el-form-item__label) {
    width: 100px;
    min-width: 100px;
  }

  .file-display {
    flex-direction: column;
    align-items: flex-start;
    min-width: auto;
  }

  .file-name {
    min-width: auto;
  }

  .custom-radio-group {
    flex-direction: column;
    gap: 10px;
    min-width: auto;
  }
}
</style>