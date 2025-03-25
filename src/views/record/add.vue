<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="270px">
            <!-- 基本信息 -->
            <el-card class="box-card" shadow="never">
                <template #header>
                    <span class="section-title">基本信息</span>
                </template>
                <el-descriptions title="">
                    <el-descriptions-item label="项目编号">486886</el-descriptions-item>
                    <el-descriptions-item label="单位名称">武汉市中心医院</el-descriptions-item>
                    <el-descriptions-item label="备案编号">F55DA5546812DJIOL</el-descriptions-item>
                    <el-descriptions-item label="系统编号">F55DA5546812DJIOL1188</el-descriptions-item>
                    <el-descriptions-item label="系统名称">安全支付系统</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 实施报备信息 -->
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">实施报备信息</span>
                </template>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="报备时间：">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.reportTime"
                                style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报备人员：">
                            <el-input v-model="form.reportPerson" placeholder="请输入报备人员"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 项目实施信息 -->
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">项目实施信息</span>
                </template>
                <el-row>
                    <el-col :span="8" v-for="(item, index) in projectPhases" :key="index">
                        <el-form-item :label="item.label" label-width="150px">
                            <el-row>
                                <el-col :span="11">
                                    <el-date-picker type="date" size="mini" placeholder="选择日期" v-model="form[item.prop]"
                                        style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col :span="11" style="margin-left: 5px;">
                                    <el-input v-model="form[`${item.prop}Person`]" :placeholder="item.placeholder"
                                        size="mini"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 过程文件上传 -->
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">过程文件上传</span>
                </template>
                <el-row v-for="(item, index) in fileUploadItems" :key="index">
                    <el-col :span="24">
                        <el-form-item :label="item.label">
                            <el-row>
                                <el-col :span="4">
                                    <el-upload class="upload-demo" :action="uploadUrl"
                                        :on-change="handleFileChange(index)" :file-list="fileLists[index]"
                                        :before-upload="beforeUpload">
                                        <el-button size="mini" type="success"
                                            :disabled="item.radio === '2' && item.disableOnShared" plain
                                            icon="el-icon-upload">点击上传</el-button>
                                    </el-upload>
                                </el-col>
                                <el-col :span="5" v-if="item.hasRadio">
                                    <span class="btn">
                                        <el-radio v-model="item.radio" label="1"
                                            @change="handleRadioChange">原件</el-radio>
                                        <el-radio v-model="item.radio" label="2"
                                            @change="() => handleRadioChange(index)">共用</el-radio>
                                    </span>
                                </el-col>
                                <el-col :span="6" v-if="item.hasInput">
                                    <el-input placeholder="签署人员多人请用、符号区分" v-model="form[item.inputModel]"
                                        @blur="handleInput(index, item)" size="mini"></el-input>
                                </el-col>
                                <el-col :span="5" v-if="item.hasDatePicker" style="margin-left: 8px;">
                                    <el-date-picker v-model="form[item.dateModel]" size="mini" value-format="yyyy-MM-dd"
                                        type="date" :placeholder="item.datePlaceholder"
                                        @change="handleDateChange(index)"></el-date-picker>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <!-- 文件信息 -->
            <el-card class="box-card" shadow="never">
                <template #header>
                    <span class="section-title">文件信息</span>
                </template>
                <el-divider content-position="center" v-if="downloadList.length == 0">暂无数据</el-divider>
                <el-table :data="downloadList" style="width: 100%" border v-else>
                    <el-table-column prop="user" label="参与人员" align="center" width="120"></el-table-column>
                    <el-table-column prop="title" label="文件类型" align="center"></el-table-column>
                </el-table>
            </el-card>

            <el-form-item style="position: relative;
    left: 27%;">
                <el-button type="warning" icon="el-icon-edit">暂存</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>

        <el-dialog title="共用文件列表" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
            <el-table :header-cell-class-name="cellClass" :data="tableData1" :row-key="getRowKey"
                @selection-change="handleSelectionChange" ref="multipleTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="文件编号" align="center" prop="A" />
                <el-table-column label="文件系统" align="center" prop="b" />
                <el-table-column label="文件日期" align="center" prop="c" />
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="() => submit(selectedFileIndex)">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                projectNumber: '',
                unitName: '',
                recordNumber: '',
                systemNumber: '',
                systemName: '',
                reportTime: '',
                reportPerson: '',
                assessmentPrepareTime: '',
                assessmentPreparePerson: '',
                planCompilationTime: '',
                planCompilationPerson: '',
                onSiteAssessmentTime: '',
                onSiteAssessmentPerson: '',
                reportCompilationTime: '',
                reportCompilationPerson: '',
                penetrationTime: '',
                penetrationPerson: '',
                vulnerabilityScanTime: '',
                vulnerabilityScanPerson: '',
                assessmentRiskNoticeSigner: '',
                assessmentRiskNoticeDate: '',
                dispatchChangeSigner: '',
                dispatchChangeDate: ''
            },
            radio: '1',
            loading: true,
            ids: [],
            single: true,
            multiple: true,
            dialogVisible: false,
            rules: {
                projectNumber: [{ required: true, message: '项目编号不能为空', trigger: 'blur' }],
                unitName: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
                recordNumber: [{ required: true, message: '备案编号不能为空', trigger: 'blur' }],
                systemNumber: [{ required: true, message: '系统编号不能为空', trigger: 'blur' }],
                systemName: [{ required: true, message: '系统名称不能为空', trigger: 'blur' }],
                reportTime: [{ required: true, message: '请选择报备时间', trigger: 'change' }],
                reportPerson: [{ required: true, message: '请输入报备人员', trigger: 'blur' }],
                assessmentPrepareTime: [{ required: true, message: '请选择测评准备时间', trigger: 'change' }],
                planCompilationTime: [{ required: true, message: '请选择方案编制时间', trigger: 'change' }],
                onSiteAssessmentTime: [{ required: true, message: '请选择现场测评时间', trigger: 'change' }],
                reportCompilationTime: [{ required: true, message: '请选择报告编制时间', trigger: 'change' }],
                penetrationTime: [{ required: true, message: '请选择渗透时间', trigger: 'change' }],
                vulnerabilityScanTime: [{ required: true, message: '请选择漏扫时间', trigger: 'change' }]
            },
            fileLists: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            uploadedFiles: [],

            uploadError: null,
            uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
            tableData1: [
                {
                    year: 2024,
                    A: 1553553,
                    b: "档案管理系统",
                    c: "LG-SYS-03767",
                    d: "屈志远",
                    e: 'LS系统,PAC5系统,电子运维',
                    f: '本地机房',
                    g: '通用',
                    h: '系统分类',
                    j: '50',
                    k: '三级',
                    m: '宜宾人民医院',
                    n: '一般'
                },
                {
                    year: 2024,
                    A: 28996366,
                    b: "HiS系统",
                    c: "JHY-RYW-078207",
                    d: "屈志远",
                    e: 'LS系统,PAC5系统,电子运维',
                    f: '本地机房',
                    g: '通用',
                    h: '系统分类',
                    j: '50',
                    k: '三级',
                    m: '宜宾人民医院',
                    n: '一般'
                },
                {
                    year: 2023,
                    A: 36633414566,
                    b: "HiS系统",
                    c: "NG-YS-03767",
                    d: "屈志远",
                    e: 'LS系统,PAC5系统,电子运维',
                    f: '本地机房',
                    g: '通用',
                    h: '系统分类',
                    j: '50',
                    k: '三级',
                    m: '宜宾人民医院',
                    n: '一般'
                },
                {
                    year: 2022,
                    A: 4,
                    b: "电子病历系统",
                    c: "LG-OHB-52637",
                    d: "屈志远",
                    e: 'LS系统,PAC5系统,电子运维',
                    f: '本地机房',
                    g: '通用',
                    h: '系统分类',
                    j: '50',
                    k: '三级',
                    m: '宜宾人民医院',
                    n: '一般'
                }
            ],
            projectPhases: [
                { label: "测评准备时间：", prop: "assessmentPrepareTime", placeholder: "测评准备人员" },
                { label: "方案编制时间：", prop: "planCompilationTime", placeholder: "方案编制人员" },
                { label: "现场测评时间：", prop: "onSiteAssessmentTime", placeholder: "现场测评人员" },
                { label: "报告编制时间：", prop: "reportCompilationTime", placeholder: "报告编制人员" },
                { label: "渗透时间：", prop: "penetrationTime", placeholder: "渗透人员" },
                { label: "漏扫时间：", prop: "vulnerabilityScanTime", placeholder: "漏扫人员" }
            ],
            fileUploadItems: [
                { label: "上传等级测评计划书：", fileType: "等级测评计划书", hasRadio: false, disableOnShared: true },
                { label: "信息系统基本调查表：", fileType: "信息系统基本调查表", hasRadio: true },
                { label: "等级测评项目基本情况表：", fileType: "等级测评项目基本情况表", hasRadio: true },
                { label: "现场测评授权书：", fileType: "现场测评授权书", hasRadio: true },
                { label: "等级评测方案审核单：", fileType: "等级评测方案审核单", hasRadio: true },
                { label: "测试现场见证记录：", fileType: "测试现场见证记录", hasRadio: true },
                { label: "风险规避方案：", fileType: "风险规避方案", hasRadio: true },
                { label: "自愿放弃验证测试声明：", fileType: "自愿放弃验证测试声明", hasRadio: true },
                { label: "测评风险告知书：", fileType: "测评风险告知书", hasRadio: true, hasInput: true, inputModel: "assessmentRiskNoticeSigner", hasDatePicker: true, dateModel: "assessmentRiskNoticeDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "派工变更单：", fileType: "派工变更单", hasRadio: true, hasInput: true, inputModel: "dispatchChangeSigner", hasDatePicker: true, dateModel: "dispatchChangeDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "现场记录表：", fileType: "现场记录表", hasRadio: true, hasInput: true, inputModel: "siteRecordSigner", hasDatePicker: true, dateModel: "siteRecordDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "等级评测方案：", fileType: "等级评测方案", hasRadio: true, hasInput: true, inputModel: "assessmentPlanSigner", hasDatePicker: true, dateModel: "assessmentPlanDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "测试现场接收/归还文档清单：", fileType: "测试现场接收/归还文档清单", hasRadio: true, hasInput: true, inputModel: "documentListSigner", hasDatePicker: true, dateModel: "documentListDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "末次会议签到表：", fileType: "末次会议签到表", hasRadio: true, hasInput: true, inputModel: "lastMeetingSigner", hasDatePicker: true, dateModel: "lastMeetingDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "验证测试授权书：", fileType: "验证测试授权书", hasRadio: true, hasInput: true, inputModel: "verificationAuthorizationSigner", hasDatePicker: true, dateModel: "verificationAuthorizationDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "验证性测试入场离场确认单：", fileType: "验证性测试入场离场确认单", hasRadio: true, hasInput: true, inputModel: "verificationConfirmationSigner", hasDatePicker: true, dateModel: "verificationConfirmationDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "首次会议签到表：", fileType: "首次会议签到表", hasRadio: true, hasInput: true, inputModel: "firstMeetingSigner", hasDatePicker: true, dateModel: "firstMeetingDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "原始扫漏记录：", fileType: "原始扫漏记录", hasRadio: true, hasInput: true, inputModel: "vulnerabilityRecordSigner", hasDatePicker: true, dateModel: "vulnerabilityRecordDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "渗透测试报告：", fileType: "渗透测试报告", hasRadio: true, hasInput: true, inputModel: "penetrationReportSigner", hasDatePicker: true, dateModel: "penetrationReportDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "信息安全等级保护测评服务情况评价表：", fileType: "信息安全等级保护测评服务情况评价表", hasRadio: true, hasInput: true, inputModel: "evaluationFormSigner", hasDatePicker: true, dateModel: "evaluationFormDate", datePlaceholder: "签署日期", radio: '1' }
            ],
            downloadList: [],
            selectedFileIndex: null
        };
    },
    methods: {
        onSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {

                    this.$message.success('提交成功');
                } else {
                    this.$message.error('请完善必填项');
                    return false;
                }
            });
        },
        reset() {
            this.form = {
                projectNumber: '',
                unitName: '',
                recordNumber: '',
                systemNumber: '',
                systemName: '',
                reportTime: '',
                reportPerson: '',
                assessmentPrepareTime: '',
                assessmentPreparePerson: '',
                planCompilationTime: '',
                planCompilationPerson: '',
                onSiteAssessmentTime: '',
                onSiteAssessmentPerson: '',
                reportCompilationTime: '',
                reportCompilationPerson: '',
                penetrationTime: '',
                penetrationPerson: '',
                vulnerabilityScanTime: '',
                vulnerabilityScanPerson: '',
                assessmentRiskNoticeSigner: '',
                assessmentRiskNoticeDate: '',
                dispatchChangeSigner: '',
                dispatchChangeDate: ''
            };
            this.$refs.form.resetFields();
        },
        handleSelectionChange(selection) {
            this.ids = selection;
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        beforeUpload(file) {
            const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
            const isAllowedType = allowedTypes.includes(file.type);
            const isLt5M = file.size / (1024 * 1024) < 5;

            if (!isAllowedType) {
                this.uploadError = '上传文件只能是 doc、docx、pdf 格式!';
                return false;
            }
            if (!isLt5M) {
                this.uploadError = '上传文件大小不能超过 5MB!';
                return false;
            }
            this.uploadError = null;
            return true;
        },
        handleFileChange(index) {
            return (file, fileList) => {
                file.name = `${this.fileUploadItems[index].fileType}-${file.name}`;
                this.fileLists[index] = fileList;
                console.log(this.fileLists[index]);
            };
        },
        handleRadioChange(index) {
            this.fileLists[index] = [];
            this.selectedFileIndex = index;
            if (this.fileUploadItems[index].radio === '2') {
                this.ids = [];
                this.dialogVisible = true;
            }
        },
        back() {
            this.$router.go(-1);
        },
        getRowKey(row) {
            return row.A;
        },
        cellClass(row) {
            if (row.columnIndex === 0) {
                return 'disabledCheck';
            }
        },
        handleClose() {
            // 关闭对话框时的逻辑
        },
        submit(index) {
            if (this.ids.length > 0) {
                this.fileLists[index] = [
                    {
                        "status": "ready",
                        "name": `${this.fileUploadItems[index].fileType}-${this.ids[0].A}`,
                        "size": 92160,
                        "percentage": 0,
                        "uid": 1742450981889,
                        "raw": {
                            "uid": 1742450981889
                        }
                    }
                ];
            }
            this.$refs.multipleTable.clearSelection();
            this.ids = [];
            this.dialogVisible = false;
        },
        handleSearch(index, obj) {
            const item = this.fileUploadItems[index];
            const inputValue = this.form[item.inputModel];
            if (inputValue) {
                if (!this.hasRiskNotice(this.downloadList, item.fileType)) {
                    this.downloadList.push({
                        title: item.fileType,
                        user: inputValue,
                        date: ""
                    });
                } else {
                    this.downloadList.forEach(item => {
                        if (item.title === item.fileType) {
                            item.user = inputValue;
                        }
                    });
                }
            } else {
                if (this.downloadList.length > 0) {
                    this.downloadList = this.removeRiskNotice(this.downloadList, item.fileType);
                }
            }
        },
        handleDateChange(index) {
            const item = this.fileUploadItems[index];
            const dateValue = this.form[item.dateModel];
            return
            // if (this.downloadList.length > 0) {
            //     this.downloadList.forEach(item => {
            //         if (item.title === item.fileType) {
            //             item.date = dateValue;
            //         }
            //     });
            //     this.$forceUpdate();
            // }
        },
        hasRiskNotice(downloadList, val) {
            return downloadList.some(item => item.title === val);
        },
        removeRiskNotice(downloadList, val) {
            return downloadList.filter(item => item.title !== val);
        },
        handleInput(index, val) {
            const item = this.fileUploadItems[index];
            const inputValue = this.form[item.inputModel];
            const regex = /^[\u4e00-\u9fa5、]*$/;
            if (!regex.test(inputValue)) {
                this.form[item.inputModel] = inputValue.replace(/[^\u4e00-\u9fa5、]/g, '');
            } else {
                const personToFiles = {};

                // 遍历所有文件输入项，重新构建 personToFiles 映射
                this.fileUploadItems.forEach(item => {
                    const input = this.form[item.inputModel];
                    if (input) {
                        const persons = input.split('、');
                        persons.forEach(person => {
                            if (!personToFiles[person]) {
                                personToFiles[person] = [];
                            }
                            if (!personToFiles[person].includes(item.fileType)) {
                                personToFiles[person].push(item.fileType);
                            }
                        });
                    }
                });

                // 根据 personToFiles 重新生成 downloadList
                this.downloadList = Object.keys(personToFiles).map(person => ({
                    user: person,
                    title: personToFiles[person].join('、')
                }));
            }
        }
    }
};
</script>

<style scoped>
::v-deep .el-upload-list {
    float: right;
}

::v-deep.el-form-item {
    margin-top: 0px !important;
    margin-bottom: 20px !important;
}

::v-deep.el-upload-list__item-name {
    float: right !important;
}

::v-deep .el-table .disabledCheck .cell .el-checkbox__inner {
    display: none;
}

::v-deep .el-table .disabledCheck .cell::before {
    content: '';
    text-align: center;
    line-height: 37px;
}


.app-container {
    padding: 20px;
    background: #f5f7fa;
}

.box-card {
    margin-bottom: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
}

.box-card:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    display: flex;
    align-items: center;
}

.section-title::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #409eff;
    margin-right: 12px;
    border-radius: 2px;
}

.el-form {
    margin: 0 auto;
}

.el-form-item {
    margin-bottom: 24px;
}

.el-form-item__label {
    color: #606266;
    font-weight: 500;
}

.upload-demo ::v-deep .el-upload-list__item {
    transition: all 0.3s;
}

.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: #f5f7fa;
}

.upload-btn {
    width: 120px;
}

.el-form-item:last-child {
    margin-top: 40px;
}

@media (max-width: 768px) {
    .el-col {
        width: 100%;
        margin-bottom: 15px;
    }

    .el-form-item {
        margin-bottom: 18px;
    }

    .section-title {
        font-size: 14px;
    }
}

.el-date-editor {
    width: 100% !important;
}

.btn ::v-deep .el-radio {
    margin-right: 15px;
}

.btn ::v-deep .el-radio__label {
    color: #606266;
}

.el-button--warning {
    background: #ffba00;
    border-color: #ffba00;
}

.el-button--warning:hover {
    background: #ffa500;
    border-color: #ffa500;
}

.upload-label {
    display: block;
    margin-bottom: 8px;
    color: #909399;
    font-size: 13px;
}
</style>