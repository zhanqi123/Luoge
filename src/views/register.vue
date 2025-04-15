<template>
  <div id="app" class="registration-container">
    <el-card class="box-card">
      <el-form label-width="auto">
        <h3 class="form-title">归档文件上传</h3>
        <!-- 确认 fromList 是否有数据 -->

        <!-- 循环生成上传项 -->
        <el-form-item v-for="(item, index) in fromList" :key="item.文件编号" :label="item.文件名称" :required="item.是否必填"
          class="btnForm">
          <el-row>
            <el-col :span="6">
              <el-upload class="upload-demo" :auto-upload="false" ref="dmtUploadFile" v-if="item.radio == 1"
                :on-change="(file, fileList) => handleChange(index, file, fileList, item)"
                :on-remove="(file, fileList) => handleRemove(index, file, fileList)" :file-list="fileLists[index]"
                multiple :limit="1" :on-exceed="handleExceed" action="#">
                <el-button size="mini" type="success" icon="el-icon-upload">点击上传</el-button>
              </el-upload>
              <!-- 显示文件实际保存名称 -->
              <el-link type="primary" class="fileTips" :underline="false"
                v-if="binaryDataArray[index] && binaryDataArray[index].文件实际保存名称">
                {{ binaryDataArray[index].文件实际保存名称 }} <i class="el-icon-circle-close"
                  style="margin-left: 5px; color: #606266;" @click="deleteFile(binaryDataArray[index], index)"></i>
              </el-link>
            </el-col>
            <el-col :span="6">
              <div class="Radio" style="margin-left: 10px;">
                <el-radio @click.native.prevent="handleRadioClick(item, index, option.value)"
                  v-for="option in radioOptions" :key="option.value" v-model="item.radio" :label="option.value">{{
                  option.label }}</el-radio>
              </div>
            </el-col>
            <el-col :span="5" style="margin-right: 5px;">
              <el-input placeholder="签署人员多人请用、符号区分" v-model="fromList[item.inputModel]" @blur="handleInput(index, item)"
                size="mini"></el-input>
            </el-col>
            <el-col :span="5" style="margin-left: 5px;">
              <el-date-picker v-model="binaryDataArray[item.dateModel]" size="mini" value-format="yyyy-MM-dd" type="date"
                placeholder="签署日期" @change="handleDateChange(item, index)"></el-date-picker>
            </el-col>

            <!-- <el-button size="mini" icon="el-icon-download" @click="downloadFile(item)">下载</el-button> -->
          </el-row>
        </el-form-item>

        <el-form-item style="text-align: center;" label-width="0">
          <el-button type="primary" class="submit-btn" style="height: 44px;" :loading="submitting"
            :disabled="binaryDataArray.every(item => item == null)" @click="handleSubmit">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="共用文件列表" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-table :header-cell-class-name="cellClass" :data="shareList" :row-key="getRowKey"
        @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="文件编号" align="center" prop="文件编号" />

        <el-table-column label="文件名称" align="center" prop="文件名称" />
        <el-table-column label="引用对象系统编号" align="center" prop="引用对象系统编号" />
        <el-table-column label="上传时间" align="center" prop="上传时间" />
        <el-table-column label="上传人员" align="center" prop="上传人员" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="() => submit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { util } from '@/utils/base64ToFile'
import { initList, submitData } from '@/api/register/index.js'

export default {
  name: 'register',
  data() {
    return {
      fileLists: [], // 根据fromList长度初始化
      submitting: false,
      shareList: [],//共用列表数据
      dialogVisible: false,
      systemcode: null,
      flag: null,
      fromList: [


      ],
      binaryDataArray: [],
      objList: [

      ],
      radio: null,
      radioOptions: [
        { value: 1, label: '原件' },
        { value: 2, label: '共用' },
      ],
      loadingInstance: null, // 用于存储 Loading 实例
      selectedFileIndex: null,
      ids: [],
      single: true,
      multiple: true,
    }
  },
  created() {
    const params = new URLSearchParams(window.location.search)
    if (params.get('systemcode') && params.get('flag')) {
      this.systemcode = params.get('systemcode')
      this.flag = params.get('flag')
    }
    this.initFileLists()
  },


  methods: {
    initFileLists() {

      let data = {
        voidid: 801,
        FileItemType: 1,
        ReportDate: '2025-04-03'
      }
      initList(data).then(res => {
        if (res.Data) {
          this.fromList = res.Data;
          this.fromList.forEach(item => {
            item.radio = 1
          })
          this.fileLists = this.fromList.map(() => []);
          this.binaryDataArray = this.fromList.map(() => null); // 初始化空数组
        }
      });
    },

    async handleSubmit() {
      // 检查必填项是否上传
      for (let i = 0; i < this.fromList.length; i++) {
        const item = this.fromList[i];
        if (item.是否必填 && !this.binaryDataArray[i]) {
          this.$message.error(`${item.文件名称} 为必填项，请上传文件！`);
          return;
        }
      }

      // 过滤出需要提交的有效数据
      const validData = this.binaryDataArray.filter(item => item !== null);
      if (validData.length === 0) {
        this.$message.error("请先上传文件再提交！");
        return;
      }

      this.submitting = true;
      this.loadingInstance = this.$loading({
        lock: true,
        text: '正在上传文件，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        // 分离需要直接上传和引用的数据
        const uploadItems = validData.filter(item => item.obj); // 含obj的需直接上传
        const quoteItems = validData.filter(item => !item.obj); // 不含obj的需引用

        // 处理直接上传
        const uploadRequests = uploadItems.map(async (item) => {
          const submitParams = {
            ...item,
            voidid: 802 // 根据实际接口要求设置
          };
          const res = await submitData(submitParams);
          if (!res.Data) throw new Error(res.ErrorInfo || `${item.FileCode} 上传失败`);
          return res.Data[0];
        });

        // 等待所有直接上传完成
        const uploadResults = await Promise.all(uploadRequests);

        // 处理引用提交（需在直接上传成功后执行）
        const quoteRequests = quoteItems.map(async (item) => {
          await this.quotesbmit(item); // 等待引用提交完成
        });

        // 等待所有引用提交完成
        await Promise.all(quoteRequests);

        // 更新结果数据
        this.objList = uploadResults;
        this.$message.success("所有文件提交成功！");

        // 清空已提交数据
        this.binaryDataArray = this.fromList.map(() => null);
        this.fileLists = this.fromList.map(() => []);

      } catch (error) {
        this.$message.error(`提交失败：${error.message}`);
      } finally {
        this.submitting = false;
        this.loadingInstance.close();
      }
    },

    handleChange(index, file, fileList, item) {
      if (fileList.length > 0) {
        if (this.beforeUpload(file)) {
          this.convertFileToBinary(file.raw).then(res => {
            const testOBJ = {
              obj: res,
              ext: file.name.split('.').pop(),
              SystemID: 'LG-SYS-00120',
              FileCode: item.文件编号,
              FileValues: item.数据标签
            };
            this.$set(this.binaryDataArray, index, testOBJ);
          }).catch(error => {
            this.$message.error('文件转换失败');
            console.error(error);
          });
        } else {

          let uid = file.uid // 关键作用代码，去除文件列表失败文件

          let idx = this.$refs.dmtUploadFile[index].uploadFiles.findIndex(item => item.uid === uid) // 关键作用代码，去除文件列表失败文件（uploadFiles为el-upload中的ref值）
          this.$refs.dmtUploadFile[index].uploadFiles.splice(idx, 1) // 关键作用代码，去除文件列表失败文件
          // this.$message.error('上传文件格式和大小未通过！')
          return false
        }
      }
    },

    beforeUpload(file) {
      // 保持原有校验逻辑
      const validTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg', 'image/png',
      ];

      const isTypeValid = validTypes.includes(file.raw.type);
      const isSizeValid = file.size / 1024 / 1024 < 100;

      if (!isTypeValid) {
        this.$message.error('文件格式不支持');
        return false;
      }
      if (!isSizeValid) {
        this.$message.error('文件大小不能超过100MB');
        return false;
      }
      return true;
    },

    handleRemove(index, file, fileList) {
      this.$set(this.fileLists, index, fileList);
      if (fileList.length === 0) {
        this.$set(this.binaryDataArray, index, null);
      }
    },
    getRowKey(row) {
      return row.A;
    },

    downloadFile(val) {
      let data = {
        FileSaveName: this.objList[0].文件实际保存名称,
        voidid: 803
      };
      submitData(data).then(res => {
        util.downloadFileByByte(res.Data[0].byte, `测试122.xlsx`);
      });
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'disabledCheck';
      }
    },

    convertFileToBinary(file) {

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // 将ArrayBuffer转换为二进制数组
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          const binaryArray = Array.from(uint8Array);  // 转换为普通数组
          resolve(binaryArray);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    handleExceed() { },
    handleClose() {
      this.dialogVisible = false
    },
    handleSelectionChange(selection) {
      if (selection.length > 1) {
        const lastSelected = selection.pop();
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(lastSelected, true);
        this.ids = [lastSelected];
      } else {
        this.ids = selection;
      }
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 单选框点击事件处理
    handleRadioClick(item, index, value) {
      this.selectedFileIndex = index
      const previousValue = item.radio;
      // 强制更新选中状态
      this.$set(item, 'radio', value === previousValue ? null : value);

      // 清理关联数据
      if (value === 1) { // 切换回"原件"时
        this.$set(this.binaryDataArray, index, null);
        this.$set(this.fileLists, index, []); // 清空文件列表
      } else if (value === 2) {
        this.handleCommonFileDialog(item);
      }
    },
    handleCommonFileDialog(item) {
      let data = {
        voidid: 800,
        SystemID: 'LG-SYS-00119',
        state: '待归档',
        ProjectID: '',
        ShowOtherSys:1,
        SystemName: ''

      };
      initList(data).then((res) => {
        console.log(res)
        if (res.Data) {
          this.shareList = res.Data;
          this.dialogVisible = true;
        }
      });
    },


    // 共用文件提交
    submit() {
      if (this.ids.length > 0) {
        this.$set(this.binaryDataArray, this.selectedFileIndex, this.ids[0]);
      }
      console.log(this.binaryDataArray)
      this.dialogVisible = false;
    },
    // 共用文件引用提交方法
    async quotesbmit(val) {
      try {
        const data = {
          SystemID: 'LG-SYS-02308',
          FileCode: val.文件编号,
          CiteSystemID: val.引用对象系统编号,
          voidid: 804
        };
        const res = await submitData(data);
        if (!res.Data) throw new Error(res.ErrorInfo || '引用提交失败');
        return res.Data;
      } catch (error) {
        throw new Error(`引用提交失败: ${error.message}`);
      }
    },
    //删除引用文件
    deleteFile(val, index) {

      this.$set(this.binaryDataArray, index, null);
      this.$set(this.fileLists, index, []);
      this.$message.success('引用文件删除成功');
    },
    handleInput(index, val) {
    const inputValue = this.fromList[index][val.inputModel];
    const regex = /^[\u4e00-\u9fa5、]*$/;
    if (!regex.test(inputValue)) {
        this.$message.error('只能输入汉字和顿号（、）');
        // 去除不符合规则的字符
        this.fromList[index][val.inputModel] = inputValue.replace(/[^\u4e00-\u9fa5、]/g, '');
    }


  }
}
};
</script>

<style scoped lang="scss">
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

::v-deep .el-form-item__conten {
  display: flex;
}

::v-deep .el-radio.is-checked .el-radio__inner {
  border-color: #409EFF !important;
  background: #409EFF !important;
}

.Radio {
  margin-left: 10px;
  // position: absolute;
  // top: -35px;
  // top: 0px;
  // left: 102px;
}

::v-deep .el-table .disabledCheck .cell .el-checkbox__inner {
  display: none;
}

::v-deep .el-table .disabledCheck .cell::before {
  content: '';
  text-align: center;
  line-height: 37px;
}

.fileTips {
  // color: #606266;
  display: block;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
  white-space: nowrap;
  margin-top: 30px;
}

// a, a:focus, a:hover {
//     cursor: pointer;
//     color: inherit;
//     text-decoration: none;
// }</style>