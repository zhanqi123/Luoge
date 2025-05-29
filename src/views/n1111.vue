<template>
    <div id="app" class="registration-container">
        <el-row style="background: #f5f7fa;">
            <el-col :span="isAuditRejected ? 18 : 24">
                <el-card class="box-card">
                    <el-form ref="uploadForm" :model="formData" label-width="auto" class="custom-form">
                        <h3 class="form-title">项目过程文件上传 <span style="color:red;font-size: 14px;">({{
                                this.formFlag.一阶段审核状态 }})</span></h3>
                        <!-- 循环生成表单项 -->

                        <div v-if="formState">
                            <div v-for="(item, index) in fileList" :key="item.文件编号" class="form-item-wrapper">
                                <el-descriptions :title="item.文件名称" :column="1" border>
                                    <!-- 文件信息 -->
                                    <el-descriptions-item label="文件">
                                        <div class="file-display">
                                            <span v-if="fileLists[index] && fileLists[index].length > 0"
                                                class="file-name">
                                                {{ fileLists[index][0].name }}
                                            </span>
                                            <span v-else class="no-file">暂无文件</span>
                                            <el-button v-if="fileLists[index] && fileLists[index].length > 0"
                                                size="mini" type="primary" icon="el-icon-download"
                                                @click="downloadFile(index)" style="float: right;">
                                                下载
                                            </el-button>
                                        </div>
                                    </el-descriptions-item>

                                    <!-- 数据标签信息 -->
                                    <template v-if="item.数据标签">
                                        <el-descriptions-item v-for="(value, key) in parseDataTags(item.数据标签)"
                                            :key="key" :label="key">
                                            <el-date-picker v-if="key.includes('日期')" v-model="formData[item.文件编号][key]"
                                                type="date" :placeholder="key" size="mini" disabled
                                                value-format="yyyy-MM-dd" class="custom-date-picker"></el-date-picker>

                                            <span v-else-if="key.includes('是否')">
                                                <div v-if="formData[item.文件编号][key]">
                                                    <el-tag effect="dark"
                                                        :type="formData[item.文件编号][key] == '是' ? 'success' : 'danger'">
                                                        {{
                                                        formData[item.文件编号][key] }}</el-tag>
                                                </div>
                                                <div v-else>
                                                    暂无数据
                                                </div>

                                            </span>

                                            <el-input v-else v-model="formData[item.文件编号][key]" :placeholder="key"
                                                size="mini" disabled class="custom-input"></el-input>
                                        </el-descriptions-item>
                                    </template>
                                </el-descriptions>
                            </div>
                        </div>
                        <div v-else>
                            <div v-for="(item, index) in fileList" :key="item.文件编号" class="form-item-wrapper">
                                <el-descriptions :column="1" border>
                                    <template slot="title">
                                        {{ item.文件名称 }}
                                        <el-tag type="danger" effect="dark" size="mini" v-if="item.是否必填">必填</el-tag>
                                    </template>
                                    <el-descriptions-item :labelStyle='labelStyle'>
                                        <template slot="label">
                                            {{ item.文件名称 }}
                                        </template>
                                        <el-form-item class="file-upload-item" :label-width="'20px'"
                                            :required="item.是否必填" :rules="getDynamicRules(item, item.文件名称)">
                                            <el-upload class="upload-demo" :auto-upload="false"
                                                :http-request="uploadFileDrawer" :ref="`dmtUploadFile${index}`"
                                                :before-upload="beforeUpload"
                                                :on-change="(file, fileList) => handleChange(index, file, fileList, item)"
                                                :on-exceed="(files) => handleExceed(files, index)"
                                                :before-remove="(file) => beforeRemove(file, index)"
                                                :file-list="fileLists[index]" multiple :limit="1" action="#"
                                                :on-remove="(file, fileList) => handleRemove(index, file, fileList)">
                                                <el-button size="mini" type="success"
                                                    icon="el-icon-upload">点击上传</el-button>
                                                <el-button size="mini" type="primary" @click.stop="downloadFile(index)"
                                                    icon="el-icon-download" class="download-btn"
                                                    v-if="fileLists[index] && fileLists[index].length > 0">下载查看</el-button>
                                            </el-upload>
                                        </el-form-item>
                                    </el-descriptions-item>
                                    <template v-if="item.数据标签">
                                        <el-descriptions-item v-for="(value, key) in parseDataTags(item.数据标签)"
                                            :key="key" :label="key" class="dynamic-control-item">

                                            <el-form-item :rules="getDynamicRules(item, key)" :label="key"
                                                :prop="`${item.文件编号}.${key}`"
                                                :label-width="key.includes('是否') ? '200px' : '200px'"
                                                class="nested-form-item">

                                                <el-date-picker v-if="key.includes('日期')"
                                                    v-model="formData[item.文件编号][key]" type="date"
                                                    :disabled="!fileLists[index].length" :placeholder="key" size="mini"
                                                    @change="handleImmediateValidate(item.文件编号, key)"
                                                    value-format="yyyy-MM-dd"
                                                    class="custom-date-picker"></el-date-picker>
                                                <el-radio-group v-else-if="key.includes('是否')"
                                                    :disabled="!fileLists[index].length"
                                                    @change="handleImmediateValidate(item.文件编号, key)"
                                                    v-model="formData[item.文件编号][key]" size="mini"
                                                    class="custom-radio-group">
                                                    <el-radio label="是">是</el-radio>
                                                    <el-radio label="否">否</el-radio>
                                                </el-radio-group>
                                                <el-input v-else v-model="formData[item.文件编号][key]"
                                                    :disabled="!fileLists[index].length"
                                                    @input="handleImmediateValidate(item.文件编号, key)" :placeholder="key"
                                                    size="mini" class="custom-input"></el-input>
                                            </el-form-item>
                                        </el-descriptions-item>
                                    </template>
                                </el-descriptions>
                            </div>
                        </div>


                        <el-form-item class="submit-buttons">
                            <!-- <el-button type="success" icon="el-icon-folder-checked" class="submit-btn" :loading="submitting"
                @click="debouncedSubmit">
                提交
              </el-button> -->
                            <!-- <el-button  class="submit-btn" :loading="submitting"
                @click="test()">
                测试提交
              </el-button>
              <el-button class="submit-btn cancel-btn" @click="back">
                取消
              </el-button> -->
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <el-col :span="6" v-if="isAuditRejected">
                <el-card class="audit-card" shadow="hover">
                    <div slot="header" class="audit-header">
                        <span>审核信息</span>
                    </div>
                    <el-descriptions direction="vertical" border size="medium" :column="1"
                        label-class-name="label-style" class="audit-descriptions">
                        <el-descriptions-item label="审核状态">
                            <el-tag :type="auditStatusText" effect="dark">{{ this.formFlag.一阶段审核状态 }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="审核时间">
                            {{ this.formFlag.一阶段审核日期 }}
                        </el-descriptions-item>
                        <el-descriptions-item label="审核人">
                            {{ this.formFlag.一阶段审核人 }}
                        </el-descriptions-item>
                        <el-descriptions-item label="审核意见">
                            <span v-if="this.formFlag.一阶段审核人"> {{ this.formFlag.一阶段审核备注 }}</span>
                            <span v-else style="color: #999;">暂无审核意见</span>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>

import { initList, submitList } from '@/api/oneRegister/index.js'
import { debounce } from 'lodash'

export default {
    name: 'oneRegister',
    data() {
        return {
            fileLists: [], // 根据fileList长度初始化
            submitting: false,
            systemcode: null,

            SystemID: null,//系统编号
            ReportDate: null,//报告封面日期
            formData: {}, // 存储所有表单数据
            dynamicRules: {},
            fileList: [

            ],
            labelStyle: { 'width': '200px' },
            uploadLoading: [], // 上传加载状态数组
            existingData: [],//已经有的数据
            RuleList: [],   //比较规则
            obj: null,
            uuid: '',
            formFlag: {},
            formState: false,
            // uuid:'token:TUpcPHcqvAlGsx3L0Pn+aHH1jHb7+3CGw/mkQjz32hGW9dSJbeR4JWieFu3I/oWkSoW+Qdqo6yVB0oyKhp0hwyiMDUGURYzQ',
        }
    },
    created() {


        this.debouncedSubmit = debounce(this.handleSubmit, 1000)
        this.parseQueryData();
        this.initFromflag();
        this.getList();


    },
    methods: {

        fixUrlParam(param) {
            if (!param) return '';
            try {
                // 先解码一次
                let decoded = decodeURIComponent(param);
                // 如果有额外空格，替换成 +
                decoded = decoded.replace(/ /g, '+');
                return decoded;
            } catch (e) {
                console.error('URL 解码失败:', e);
                return param; // 失败时返回原始值
            }
        },
        parseQueryData() {
            let data = null;

            if (this.$route.query.data) {
                try {
                    const decodedData = decodeURIComponent(this.$route.query.data);
                    data = JSON.parse(decodedData);
                } catch (e) {
                    console.error('解析 data 参数出错:', e);
                    this.$message.error('解析 data 参数出错，请检查链接参数');
                }
            } else if (this.$route.query.ReportDate && this.$route.query.SystemID && this.$route.query.uuid) {
                data = {
                    ReportDate: this.fixUrlParam(this.$route.query.ReportDate),
                    SystemID: this.fixUrlParam(this.$route.query.SystemID),
                    uuid: this.fixUrlParam(this.$route.query.uuid)
                };
            }

            if (data) {
                this.ReportDate = data.ReportDate;
                this.SystemID = data.SystemID;
                this.uuid = data.uuid;
            } else {
                this.$message.error('暂无数据，请返回重新操作');
            }
        },
        initFromflag() {
            let data = {
                SystemID: this.SystemID,
                voidid: 821,
                uuid: this.uuid
            }
            this.$modal.loading('正在加载中...');
            initList(data).then(res => {
                if (res.Data) {
                    this.formState = res.Data[0].一阶段审核状态 == '一阶段审核通过' ? true : false

                    this.formFlag = res.Data[0]
                    this.getList()
                    // setTimeout(() => {
                    //   this.$modal.closeLoading()
                    // }, 500);
                }
            })
        },
        test() {
            this.submitDada()
        },
        fixUrlParam(param) {
            const decodedParam = decodeURIComponent(param);
            return decodedParam.replace(/ /g, '+');
        },
        getList() {

            let data = {
                voidid: 801,
                FileItemType: 1,
                ReportDate: this.ReportDate,
                uuid: this.uuid
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
        uploadFileDrawer(params) {

            let formData = new FormData();
            formData.append('file', params.file);

        },
        handleImmediateValidate(fileCode, fieldName) {
            this.$nextTick(() => {
                // 验证当前字段
                this.$refs.uploadForm.validateField(`${fileCode}.${fieldName}`)

                // 触发关联字段验证
                const relatedFields = this.getRelatedFields(fileCode, fieldName)
                console.log(relatedFields, 'ppppii')
                relatedFields.forEach(field => {
                    this.$refs.uploadForm.validateField(field)
                })
            })
        },
        // 获取相关联的字段
        getRelatedFields(fileCode, fieldName) {
            return this.RuleList
                .filter(rule =>
                    (rule.基准文件编号 === fileCode && rule.基准文件属性名称 === fieldName) ||
                    (rule.比较对象文件编号 === fileCode && rule.比较对象属性名称 === fieldName)
                )
                .flatMap(rule => [
                    `${rule.基准文件编号}.${rule.基准文件属性名称}`,
                    `${rule.比较对象文件编号}.${rule.比较对象属性名称}`
                ])
        },
        // 生成动态验证规则
        getDynamicRules(item, key) {
            const ruleKey = `${item.文件编号}.${key}`
            if (!this.dynamicRules[ruleKey]) {
                this.dynamicRules[ruleKey] = [
                    {
                        required: item.是否必填,
                        message: `请输入${key}`,
                        trigger: ['blur', 'change', 'input'] // 增加input触发
                    },
                    {
                        validator: this.createCrossFieldValidator(item.文件编号, key),
                        trigger: ['change', 'blur', 'input'] // 增加触发时机
                    }
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
                        case '大于':
                            const baseDate = new Date(baseValue);
                            const compareDate = new Date(compareValue);

                            if (baseDate <= compareDate) {
                                isValid = false;
                                errorMessage = `${this.getFileName(rule.基准文件编号)}的${rule.基准文件属性名称}必须大于${this.getFileName(rule.比较对象文件编号)}的${rule.比较对象属性名称}`;
                            }
                            break;
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
                            const baseArr = baseValue.split(separatorRegex).filter(item => item.trim() !== '').map(s => s.trim())
                            const compareArr = compareValue.split(separatorRegex).filter(item => item.trim() !== '').map(s => s.trim())
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
                        this.$set(this.formData[item.文件编号], key, '',)
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
                    .replace(/[""]/g, '"')
                    .replace(/[“”]/g, '"')  // 替换中文双引号
                    .replace(/['']/g, '"')
                    .replace(/\\"/g, '"')
                    .replace(/\s+/g, '')
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

        submitDada() {
            this.$confirm('请确认你要提交的归档文件表单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                let data = {
                    SystemID: this.SystemID,
                    voidid: 815,
                    uuid: this.uuid
                }
                initList(data).then(res => {
                    if (res.Data) {
                        this.$message({
                            message: '提交成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.$router.go(-1)
                            }
                        })
                    } else {
                        this.$message.error(res.ErrorInfo)
                    }
                })
            }).catch(() => {

            });

        },

        // 提交处理
        async handleSubmit() {


            try {
                this.submitting = true

                // 1. 检查必填文件是否已上传
                const fileErrors = []
                this.fileList.forEach((item, index) => {
                    if (item.是否必填 && (!this.fileLists[index] || this.fileLists[index].length === 0)) {
                        fileErrors.push(`${item.文件名称}`)
                    }
                })

                if (fileErrors.length > 0) {
                    this.$message({
                        message: `请上传以下必填文件：${fileErrors.join('、')}`,
                        type: 'error',
                        duration: 5000,
                        showClose: true
                    })
                    return
                }

                // 2. 执行Element表单验证
                let formValid = true
                await this.$refs.uploadForm.validate((valid) => {
                    if (!valid) {
                        formValid = false
                        this.$message({
                            message: '请检查表单填写是否正确',
                            type: 'warning',
                            duration: 3000
                        })
                    }
                })

                if (!formValid) {
                    return
                }

                // 3. 执行跨字段验证
                const validateResults = await Promise.all(
                    Object.keys(this.dynamicRules).map(field =>
                        new Promise(resolve => {
                            this.$refs.uploadForm.validateField(field, error => resolve({ field, error }))
                        })
                    )
                )

                const fieldErrors = validateResults.filter(result => result.error)
                if (fieldErrors.length > 0) {
                    this.$message({
                        message: '请检查数据标签的填写是否正确',
                        type: 'warning',
                        duration: 3000
                    })
                    return
                }
                this.submitDada()

            } catch (error) {
                console.error('提交失败:', error)
            } finally {
                this.submitting = false
            }
        },

        // 在methods中修改handleChange方法

        async handleChange(index, file, fileList, item) {
            if (!file) return;

            const rawFile = file.raw || file;
            if (!this.beforeUpload(rawFile)) {
                const uploadRef = this.$refs[`dmtUploadFile${index}`];
                if (uploadRef && uploadRef[0]) {
                    uploadRef[0].uploadFiles = uploadRef[0].uploadFiles.filter(f => f.uid !== file.uid);
                }
                return false;
            }

            try {
                const formData = new FormData();
                formData.append('file', rawFile);
                this.$modal.loading('拼命上传中...');
                const data = {
                    obj: '',
                    ext: file.name,
                    file: rawFile,
                    SystemID: this.SystemID,
                    FileCode: item.文件编号,
                    FileValues: '',
                    voidid: 802,
                    uuid: this.uuid
                };

                const res = await submitList(data);
                if (res.Data) {
                    // 清空数据标签字段
                    const fileCode = item.文件编号;
                    Object.keys(this.formData[fileCode] || {}).forEach(key => {
                        this.$set(this.formData[fileCode], key, '');
                    });

                    file.url = res.Data[0].文件实际保存名称;
                    this.$set(this.fileLists, index, [file]);
                    this.fileList[index].obj = res.Data[0].文件实际保存名称;

                    // 触发 handleDataTagChange
                    // this.handleDataTagChange(null, fileCode, null);

                    this.$modal.closeLoading();
                    this.$message.success('上传成功');
                } else {
                    this.$message.error(res.ErrorInfo);
                }
            } catch (error) {
                this.$message.error('上传失败，请检查网络连接');
            } finally {
                this.$modal.closeLoading();
            }
        },

        beforeUpload(file) {
            const validTypes = [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'image/jpeg',
                'image/png',
            ]

            // 文件扩展名校验（双重校验）
            const fileExt = file.name.split('.').pop().toLowerCase()
            const validExtensions = ['doc', 'docx', 'pdf', 'xlsx', 'xls', 'jpg', 'jpeg', 'png']

            const isTypeValid = validTypes.includes(file.type) && validExtensions.includes(fileExt)
            const isSizeValid = file.size / 1024 / 1024 < 100

            if (!isTypeValid) {
                this.$message.error('仅支持上传文档、PDF、Excel格式（doc/docx/pdf/xlsx/xls/jpg/png）')
                return false
            }
            if (!isSizeValid) {
                this.$message.error('文件大小不能超过100MB')
                return false
            }
            return true
        },

        handleRemove(index, file, fileList) {
            if (fileList.length === 0) {
                // 如果文件列表为空，但用户取消了删除操作，我们需要恢复文件
                if (this.fileList[index].obj) {
                    this.$set(this.fileLists, index, [file]);
                }
            }
        },
        // 统一处理上传错误
        handleUploadError(index, file) {
            // 清除上传组件的文件列表
            const uploadRef = this.$refs[`dmtUploadFile${index}`];
            if (uploadRef && uploadRef[0]) {
                uploadRef[0].uploadFiles = uploadRef[0].uploadFiles.filter(
                    f => f.uid !== file.uid
                );
            }

            // 清除状态中的文件记录
            this.$set(this.fileLists, index, []);
            this.fileList[index].obj = '';
            this.fileList[index].fileId = '';
        },
        async deleteOldFile(index) {
            try {
                const data = {
                    FileSaveName: this.fileList[index].obj,
                    voidid: 807,
                    uuid: this.uuid
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
                }).then(async () => {
                    const data = {
                        FileSaveName: this.fileList[index].obj,
                        voidid: 807,
                        uuid: this.uuid
                    };

                    const res = await initList(data);
                    if (res.Data) {
                        const fileCode = this.fileList[index].文件编号;

                        // 清空数据标签字段
                        Object.keys(this.formData[fileCode] || {}).forEach(key => {
                            this.$set(this.formData[fileCode], key, '');
                        });

                        // 触发 handleDataTagChange
                        // this.handleDataTagChange(null, fileCode, null);

                        this.$set(this.fileLists, index, []);
                        this.fileList[index].obj = '';
                        this.fileList[index].fileId = '';

                        const uploadRef = this.$refs[`dmtUploadFile${index}`];
                        if (uploadRef?.[0]) {
                            uploadRef[0].uploadFiles = [];
                        }

                        this.$message.success('删除成功');
                        resolve(true);
                    } else {
                        this.$message.error(res.ErrorInfo);
                        resolve(false);
                    }
                }).catch(() => {
                    const uploadRef = this.$refs[`dmtUploadFile${index}`];
                    if (uploadRef?.[0]) {
                        this.$set(this.fileLists, index, [file]);
                        uploadRef[0].uploadFiles = [file];
                    }
                    // this.$message.info('已取消删除');
                    resolve(false);
                });
            });
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
                SystemID: this.SystemID,
                voidid: 806,
                uuid: this.uuid
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
                voidid: 814,
                uuid: this.uuid
            }
            initList(data).then(res => {
                if (res.Data) {
                    this.RuleList = res.Data
                } else {
                    this.$message.error(res.ErrorInfo)
                }
            })
        },


        // 处理数据标签值变化
        async handleDataTagChange(value, fileCode, fieldName) {

            // if (!fileCode || !fieldName) return;

            let fileValuesString = '';
            const formValues = this.formData[fileCode];

            if (formValues) {
                fileValuesString = Object.entries(formValues)
                    .map(([key, value]) => `${key}:${value || ''}`)
                    .join(',');
            }

            try {
                const requestData = {
                    SystemID: this.SystemID,
                    FileCode: fileCode,
                    FieldValue: fileValuesString,
                    voidid: 816,
                    uuid: this.uuid
                };
                const response = await initList(requestData);
                if (response.Data) {
                    this.$set(this.formData[fileCode], fieldName, value);
                    this.$message.success('验证成功');
                } else {
                    this.$set(this.formData[fileCode], fieldName, '');
                    this.$message.error(response.ErrorInfo || '验证失败');
                }
            } catch (error) {
                this.$set(this.formData[fileCode], fieldName, '');
                this.$message.error('验证失败，请重试');
            }
            this.handleImmediateValidate(fileCode, fieldName)
        },

        //返回
        back() {
            let data = {
                SystemID: this.SystemID,
                Remark: '',
                voidid: 818,
                uuid: this.uuid
            }
            initList(data).then(res => {
                if (res.Data) {
                    return
                    this.$router.go(-1)
                } else {
                    this.$message.error(res.ErrorInfo);
                }
            })
        },
        // 下载文件
        async downloadFile(index) {
            try {
                const file = this.fileLists[index][0];
                if (!file) return;

                const data = {
                    FileSaveName: file.url,

                    voidid: 803, // 假设这是下载文件的接口ID
                    uuid: this.uuid
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

    },
    computed: {
        isAuditRejected() {
            return this.formFlag.一阶段审核状态 === '已退回';
        },
        auditStatusText() {

            switch (this.formFlag.一阶段审核状态) {
                case '审核通过': return 'success';
                case '未提交': return 'danger';
                case '已退回': return 'warning';
                default: return 'info';
            }
        },

    }
}
</script>
<style scoped lang="scss">
.audit-card {
    height: 500px;
    margin: 10px 20px 20px 20px;
    display: flex;
    flex-direction: column;

    .audit-header {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        text-align: center;
    }

    .audit-descriptions {
        flex-grow: 1;
        background-color: #f9f9f9;
    }

    .label-style {
        width: 100px;
        font-weight: bold;
        background-color: #f5f7fa;
    }
}

.registration-container {
    background: #f5f7fa;
    // min-height: 100vh;
    padding: 30px 20px;
}

.box-card {
    margin: 0 auto;
    max-width: 1250px;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
}

.custom-form {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
}

.form-title {
    text-align: center;
    color: #409eff;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 25px;
}

.form-item-wrapper {
    margin-bottom: 25px;
    padding: 20px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;

    // &:hover {
    //   background-color: #f9fbff;
    //   transform: translateY(-2px);
    // }
}

.file-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    border: 1px solid #ebeef5;
}

.file-name {
    font-size: 14px;
    color: #333;
}

.no-file {
    color: #999;
    font-style: italic;
}

.form-item-wrapper:hover {
    background: #f0f2f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-upload-item {
    margin-bottom: 0;
}

.form-item-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
}

.upload-demo {
    margin-right: 20px;
}

.data-tags-container {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    padding: 10px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.dynamic-control-item {
    /* display: flex; */
    align-items: center;
    min-width: 0;
    margin-bottom: 13px;
}

.nested-form-item {
    margin-bottom: 0;
}

.custom-date-picker,
.custom-input {
    width: 180px;
    min-width: 120px;
}

.custom-radio-group {
    /* display: flex; */
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;

}

.radio-label {
    margin-right: 8px;
    white-space: nowrap;
    /* 如有需要可加省略号 */
    /* max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis; */
}

.download-btn {
    position: absolute;
    right: 2%;
}

.submit-buttons {
    margin-top: 30px;
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
}

.submit-btn {
    width: 130px;
    height: 40px;
    font-size: 16px;
    margin: 0 10px;

    border-radius: 4px;
    transition: all 0.3s;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    .data-tags-container {
        grid-template-columns: 1fr;
    }

    .form-item-content {
        flex-direction: column;
    }

    .upload-demo {
        margin-right: 0;
        margin-bottom: 15px;
    }

    .submit-btn {
        width: 100%;
        margin: 10px 0;
    }
}
</style>