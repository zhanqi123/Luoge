<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="270px">
            <!-- 基本信息 -->
            <el-card class="box-card" shadow="never">
                <template #header>
                    <span class="section-title">基本信息</span>
                </template>
                <el-descriptions title="" border>
                    <el-descriptions-item label="项目编号">{{ parsedData.OA.项目编号 }}</el-descriptions-item>
                    <el-descriptions-item label="单位名称">{{ parsedData.OA.单位名称 }}</el-descriptions-item>
                    <el-descriptions-item label="备案编号">{{ parsedData.DJCP.备案证号 }}</el-descriptions-item>
                    <el-descriptions-item label="系统编号">{{ parsedData.OA.系统编号 }}</el-descriptions-item>
                    <el-descriptions-item label="系统名称">{{ parsedData.OA.系统名称 }}</el-descriptions-item>
                    <el-descriptions-item label="测评组人员">{{ (parsedData.DJCP.测评师 || []).join('、')
                        }}</el-descriptions-item>
                    <!-- <el-descriptions-item label="测评组人员">{{ parsedData.DJCP.测评师.join('、') }}</el-descriptions-item> -->
                </el-descriptions>
            </el-card>

            <!-- 实施报备信息 -->
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">实施报备信息</span>
                </template>
                <!-- <el-row>
                    <el-col :span="8">
                        <el-form-item label="报备审核通过时间：" label-width="180px">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.reportTime"
                                style="width: 100%;" :disabled="btnFlag"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报备许可时间：" label-width="180px">

                            <el-date-picker v-model="value1" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" :disabled="btnFlag">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="报备人员：" label-width="180px">
                            <el-input v-model="form.reportPerson" placeholder="请输入报备人员" :disabled="btnFlag"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-descriptions title="" border>
                    <el-descriptions-item label="报备审核通过时间">2025-03-15</el-descriptions-item>
                    <el-descriptions-item label="报备许可时间">2025-02-22</el-descriptions-item>
                    <!-- <el-descriptions-item label="报备人员">{{ parsedData.OA.报备人员.join('、') }}</el-descriptions-item> -->
                </el-descriptions>
            </el-card>

            <!-- 项目实施信息 -->
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">项目实施信息</span>
                </template>
                <el-descriptions class="project-info" title="" border :column="2">
                    <el-descriptions-item label="测评准备信息时间">
                        <span class="time-range">{{ parsedData.DJCP.测评准备阶段开始日期 }} 至 {{ parsedData.DJCP.测评准备阶段结束日期
                        }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="方案编制信息时间">
                        <span class="time-range">{{ parsedData.DJCP.方案编制阶段开始日期 }} 至 {{ parsedData.DJCP.方案编制阶段结束日期
                        }}</span>
                    </el-descriptions-item>

                    <!-- <el-descriptions-item label="渗透测试信息" class="info-item"> -->
                    <el-descriptions-item label="渗透状态" class="info-item">

                        <el-tag :type="getStatusTag(parsedData.DJCP.渗透状态).type" size="small" effect="dark">{{
                            getStatusTag(parsedData.DJCP.渗透状态).label }}</el-tag>
                    </el-descriptions-item>

                    <!-- <el-descriptions-item label="漏扫时间信息" class="info-item"> -->
                    <el-descriptions-item label="漏扫状态" class="info-item">
                        <el-tag :type="getStatusTag(parsedData.DJCP.漏扫状态).type" size="small" effect="dark">{{
                            getStatusTag(parsedData.DJCP.漏扫状态).label }}</el-tag>

                    </el-descriptions-item>

                    <el-descriptions-item label="报告编制信息时间" class="info-item">
                        <span class="time-range">{{ parsedData.DJCP.报告编制阶段开始日期 }} 至 {{ parsedData.DJCP.报告编制阶段结束日期
                        }}</span>
                    </el-descriptions-item>

                    <el-descriptions-item label="报告信息" class="info-item multi-content">
                        <div class="report-info">
                            <span class="report-number">报告编号：{{ parsedData.DJCP.报告编号 }}</span>
                            <span class="report-date">报告封面日期：{{ parsedData.DJCP.报告编制时间 }}</span>
                        </div>
                    </el-descriptions-item>

                    <el-descriptions-item label="现场测评信息时间" class="info-item multi-content" :span="2">
                        <div class="scene-info">
                            <span class="time-range"> <span class="time-range">{{ parsedData.DJCP.现场测评阶段开始日期 }} 至 {{
                                parsedData.DJCP.现场测评阶段结束日期 }}</span></span>
                            <div class="personnel-list">
                                <span class="person-group leader"><i class="el-icon-user-solid"></i> 测试组长：{{
                                    parsedData.DJCP.测评组长
                                }}</span>
                                <span class="person-group member"><i class="el-icon-user"></i> 组员：{{

                                    (parsedData.DJCP.组员 || []).join('、')
                                }}</span>
                                <span class="person-group penetration"><i class="el-icon-s-flag"></i> 渗透人员：{{

                                    (parsedData.DJCP.渗透人员 || []).join('、')
                                }}</span>
                            </div>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
                <el-radio-group v-model="viewMode" @change="handleViewChange" size="mini" style="margin-bottom: 5px;">
                    <el-radio-button label="day">按天查看</el-radio-button>
                    <el-radio-button label="person">按人查看</el-radio-button>
                </el-radio-group>

                <el-table :data="tableData2">
                    <el-table-column :prop="viewMode === 'day' ? 'year' : 'person'"
                        :label="viewMode === 'day' ? '打卡日期' : '人员姓名'" />
                    <el-table-column :prop="viewMode === 'day' ? 'user' : 'dates'"
                        :label="viewMode === 'day' ? '打卡人员' : '打卡日期'" />
                </el-table>
            </el-card>

            <!-- 预审文件上传 -->
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">预审文件上传(1阶段)
                        <el-button type="info" @click="handleBatchDownload" plain class="download-title" size="small"
                            icon="el-icon-download">批量下载</el-button>
                    </span>
                </template>
                <AuditFrom :myObject="oneObject" ref="auditFromRef1"></AuditFrom>
            </el-card>
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">过程文件上传(2阶段)</span>
                </template>
                <submitFrom :myObject="twoObject" ref="submitFromRef" v-if="this.formState == 1"></submitFrom>
                <AuditFrom :myObject="twoObject" ref="auditFromRef2" v-else></AuditFrom>
                <div style="margin-top: 5px;" v-if="this.errorFalg">
                    <el-card class="box-card">
                        {{ this.formState }}
                        <div slot="header" class="clearfix">
                            <el-tag type="danger" effect="plain">报错信息</el-tag>
                        </div>
                        <div v-for="o in 4" :key="o" class="text item">

                            <el-link type="danger"> {{ '信息系统基本调查表填写错误 ' + o }}</el-link>
                        </div>
                    </el-card>
                </div>
            </el-card>

            <!-- 文件信息 -->
            <el-card class="box-card" shadow="never" v-if="this.formState == 2">
                <template #header>
                    <span class="section-title">主观判断(3阶段)</span>
                </template>
                <el-form ref="form" :model="sizeForm" size="mini" label-width="300px">
                    <el-form-item :label="item.label" v-for="(item, index) in fileUploadItems" :key="index">
                        <el-radio-group v-model="sizeForm.responses[index].result" size="small"
                            @change="handleRadioChange">
                            <el-radio border label="正确">正确</el-radio>
                            <el-radio border label="错误">错误</el-radio>
                        </el-radio-group>
                    </el-form-item>

                </el-form>
            </el-card>

            <el-form-item v-if="this.formState == 1" style="position: relative;
            
                left: 27%;">
                <el-button type="warning" icon="el-icon-edit">暂存</el-button>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
            <!-- 审核意见区域 -->

            <el-card class="box-card" shadow="never" style="margin-top: 20px;" v-if="this.formState == 2">
                <el-descriptions title="审核意见" :column="1" border class="audit-opinion">
                    <el-descriptions-item label="审核结果">
                        <el-radio-group v-model="auditResult" size="medium">
                            <el-radio label="通过">通过</el-radio>
                            <el-radio label="不通过">不通过</el-radio>
                        </el-radio-group>
                    </el-descriptions-item>

                    <el-descriptions-item v-if="auditResult === '不通过'" label="不通过原因">
                        <el-input type="textarea" v-model="rejectReason" :rows="5" placeholder="请输入不通过原因"></el-input>
                    </el-descriptions-item>
                </el-descriptions>

                <!-- 按钮区域 -->
                <div class="submit-buttons">
                    <el-button type="success" icon="el-icon-folder-checked" class="submit-btn" @click="auditSbmit">
                        提交审核

                    </el-button>
                    <el-button class="submit-btn cancel-btn" @click="back">
                        取消
                    </el-button>
                </div>
            </el-card>

        </el-form>


    </div>
</template>

<script>
import AuditFrom from './components/auditFrom'
import submitFrom from './components/submitFrom'
import { initList } from '@/api/register/index.js'
import downloadMixin from '@/mixins/downloadMixin'; // 根据实际路径调整

export default {
    name: 'addForm',
    components: {
        AuditFrom,
        submitFrom
    },
    mixins: [downloadMixin], // 引入 mixin
    data() {
        return {
            testData: [
                // {
                //     "DJCP信息": "{'DJCP信息生成时间':'2025-05-12','系统名称':'智慧仓储物流管理系统','被测单位名称':'广东广物物流有限公司','系统级别A':2,'系统级别S':2,'系统级别G':2,'系统扩展项':['安全通用要求','云计算安全扩展要求'],'备案证号':'4401124700200021','报告编号':'4401124700200021-23-0154-01','OA系统编号':'','报告编制时间':'2024-10-31','测评准备阶段开始日期':'2024-09-01','测评准备阶段结束日期':'2024-09-30','方案编制阶段开始日期':'2024-10-01','方案编制阶段结束日期':'2024-10-01','现场测评阶段开始日期':'2024-10-24','现场测评阶段结束日期':'2024-10-24','报告编制阶段开始日期':'2024-10-25','报告编制阶段结束日期':'2024-10-31','测评组长':'邹升','组员':['李书勤','邱玲'],'渗透人员':['邱张聪'],'测评师':['邹升','李书勤','邱玲'],'渗透状态':1,'漏扫状态':1}",
                //     "OA信息": "{'项目编号':'LG-GD-22090825','系统编号':'LG-SYS-01250','单位名称':'广东广物物流有限公司','系统名称':'智慧仓储物流管理系统','系统级别':2,'备案证号':'44011247002-00021','报备日期':'2023-05-25','备案机关':'广州市公安局','报备人员':['广州市公安局'],'人员打卡信息（按人）':[{'李书勤':['2024-10-24']}],'人员打卡信息（按天）':[{'2024-10-24':['李书勤']}]}",
                //     "数据校验信息": "{'GD':['尚未在归档管理系统中提交过程文件材料，请提交后再进行后续操作']}"
                // }
            ],
            parsedData: {
                DJCP: {},
                OA: {}
            },
            viewMode: 'day',
            oneObject: {
                ReportDate: "",
                SystemID: "",
                FileItemType: 1
            },
            twoObject: {
                ReportDate: "",
                SystemID: "",
                FileItemType: 2
            },
            formState: null,
            sizeForm: {},
            form: {
                fabzuser: '', //方案编制人员
                projectNumber: '',
                unitName: '',
                recordNumber: '',
                systemNumber: '',
                systemName: '',
                reportTime: '',
                reportPerson: '张三、李四',
                assessmentPrepareTime: '',

                planCompilationTime: '',
                onSiteAssessmentTime: '',
                reportCompilationTime: '',
                penetrationTime: '',
                penetrationPerson: '',
                vulnerabilityScanTime: '',
                assessmentRiskNoticeSigner: '',
                assessmentRiskNoticeDate: '',
                dispatchChangeSigner: '',
                dispatchChangeDate: '',

            },
            loading: true,
            dialogVisible: false,
            errorFalg: false,
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
            uploadError: null,
            auditResult: '',
            rejectReason: '',
            tableData2: [

            ],
            sizeForm: {
                responses: [] // 初始化响应数组
            },
            fileUploadItems: [
                { label: "信息系统基本调查表：", fileType: "信息系统基本调查表", hasRadio: true },
                { label: "等级测评项目基本情况表：", fileType: "等级测评项目基本情况表", hasRadio: true },
                { label: "上传等级测评计划书：", fileType: "等级测评计划书", hasRadio: false, disableOnShared: true },
                { label: "派工变更单：", fileType: "派工变更单", hasRadio: true, hasInput: true, inputModel: "dispatchChangeSigner", hasDatePicker: true, dateModel: "dispatchChangeDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "等级测评方案审核单：", fileType: "等级测评方案审核单", hasRadio: false },
                { label: "等级测评方案：", fileType: "等级测评方案", hasRadio: false, hasInput: true, inputModel: "assessmentPlanSigner", hasDatePicker: true, dateModel: "assessmentPlanDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "风险规避方案：", fileType: "风险规避方案", hasRadio: true },

                { label: "测评风险告知书：", fileType: "测评风险告知书", hasRadio: true, hasInput: true, inputModel: "assessmentRiskNoticeSigner", hasDatePicker: false, dateModel: "assessmentRiskNoticeDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "现场测评授权书：", fileType: "现场测评授权书", hasRadio: true, hasDatePicker: true, datePlaceholder: "签署日期早于授权开始时间", dateModel: "cpDate", dateList: true, orizonDate: 'xccpsqorizonDate' },
                { label: "现场记录表：", first: true, fileType: "现场记录表", hasRadio: false, hasInput: true, inputModel: "siteRecordSigner", hasDatePicker: false, dateModel: "siteRecordDate", datePlaceholder: "签署日期", radio: '1' },

                { label: "测试现场接收/归还文档清单：", first: true, fileType: "测试现场接收/归还文档清单", hasRadio: true, hasInput: true, inputModel: "documentListSigner", hasDatePicker: false, dateModel: "documentListDate", datePlaceholder: "签署日期", radio: '1', dateList: true, orizonDate: 'csghorizonDate' },
                { label: "末次会议签到表：", first: true, fileType: "末次会议签到表", hasRadio: true, hasInput: true, inputModel: "lastMeetingSigner", hasDatePicker: true, dateModel: "lastMeetingDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "验证测试授权书：", first: true, fileType: "验证测试授权书", hasRadio: true, hasInput: false, inputModel: "verificationAuthorizationSigner", hasDatePicker: true, dateModel: "verificationAuthorizationDate", datePlaceholder: "签署日期", radio: '1', dateList: true, orizonDate: 'yzcsorizonDate' },
                { label: "验证性测试入场离场确认单：", fileType: "验证性测试入场离场确认单", hasRadio: true, hasInput: true, inputModel: "verificationConfirmationSigner", hasDatePicker: true, dateModel: "verificationConfirmationDate", datePlaceholder: "签署日期", radio: '1', dateList: true },
                { label: "自愿放弃验证测试声明：", fileType: "自愿放弃验证测试声明", hasRadio: true },
                { label: "原始扫漏记录：", first: true, fileType: "原始扫漏记录", hasRadio: true, hasInput: true, inputModel: "vulnerabilityRecordSigner", hasDatePicker: true, dateModel: "vulnerabilityRecordDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "渗透测试报告：", first: true, fileType: "渗透测试报告", hasRadio: false, hasInput: true, inputModel: "penetrationReportSigner", hasDatePicker: true, dateModel: "penetrationReportDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "信息安全等级保护测评服务情况评价表：", first: true, fileType: "信息安全等级保护测评服务情况评价表", hasRadio: true, hasInput: false, inputModel: "evaluationFormSigner", hasDatePicker: true, dateModel: "evaluationFormDate", datePlaceholder: "签署日期", radio: '1' },
            ],

            btnFlag: false,
        };
    },
    methods: {
        async onSubmit() {
            const submitFromComponent = this.formState == 1 ? this.$refs.submitFromRef : this.$refs.auditFromRef
            // const submitFromComponent = this.$refs.submitFromRef;
            if (submitFromComponent && typeof submitFromComponent.handleSubmit === 'function') {
                try {
                    const result = await submitFromComponent.handleSubmit();
                    if (result) {
                        this.submitDada()
                    }
                } catch (error) {

                }
            }


        },
        async handleBatchDownload() {
            try {
                // 获取第一阶段文件
                const auditFiles1 = this.$refs.auditFromRef1?.fileLists?.flat().filter(f => f) || [];

                // 获取第二阶段文件：注意这里要访问 fileLists 属性
                let auditFiles2 = [];
                if (this.formState === 1 && this.$refs.submitFromRef?.fileLists) {
                    auditFiles2 = this.$refs.submitFromRef.fileLists.flat().filter(f => f);
                } else if (this.formState !== 1 && this.$refs.auditFromRef2?.fileLists) {
                    auditFiles2 = this.$refs.auditFromRef2.fileLists.flat().filter(f => f);
                }

                if (auditFiles1.length === 0 && auditFiles2.length === 0) {
                    this.$message.warning('没有可下载的文件');
                    return;
                }

                // 第一阶段文件：按索引排序并加前缀
                const sortedFiles1 = auditFiles1.map((file, index) => ({
                    ...file,
                    name: `${String(index + 1).padStart(2, '0')}_${file.name}`
                }));

                // 第二阶段文件：按索引排序并加前缀
                const sortedFiles2 = auditFiles2.map((file, index) => ({
                    ...file,
                    name: `${String(index + 1).padStart(2, '0')}_${file.name}`
                }));

                // 单独打包下载第一阶段文件
                if (sortedFiles1.length > 0) {
                    await this.zipDownloadFiles(sortedFiles1, '预审文件上传(1阶段).zip', initList);
                }

                // 单独打包下载第二阶段文件
                if (sortedFiles2.length > 0) {
                    await this.zipDownloadFiles(sortedFiles2, '过程文件上传(2阶段).zip', initList);
                }

                this.$message.success('批量下载完成');

            } catch (error) {
                console.error('批量下载失败', error);
                this.$message.error('批量下载失败');
            }
        },

        async downloadFilesAsZip(files, zipName = '批量下载.zip') {
            const JSZip = require('jszip');
            const { saveAs } = require('file-saver');
            const zip = new JSZip();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const response = await fetch(file.url);
                const blob = await response.blob();
                zip.file(file.name, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, zipName);
        },

        beforeUpload(file) {
            const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
            const isAllowedType = allowedTypes.includes(file.type);
            const isLt5M = file.size / (1024 * 1024) < 50;

            if (!isAllowedType) {
                this.uploadError = '上传文件只能是 doc、docx、pdf 格式!';
                return false;
            }
            if (!isLt5M) {
                this.uploadError = '上传文件大小不能超过 50MB!';
                return false;
            }
            this.uploadError = null;
            return true;
        },

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
        submitDada() {
            this.$confirm('请确认你要提交的归档文件表单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    SystemID: this.oneObject.SystemID,
                    voidid: 815
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


        back() {
            this.$router.go(-1);
        },
        getFrom() {
        
            // 处理打卡数据
            this.tableData2 = this.parseDailyData()
       
            initList({
                SystemID: this.oneObject.SystemID,
                voidid: 822

            }).then(res => {

                if (res.Data) {
                    this.parsedData = {
                        DJCP: this.safeParse(res.Data[0].DJCP信息),
                        OA: this.safeParse(res.Data[0].OA信息),
                    }
                    if (this.safeParse(res.Data[0].数据校验信息)) {
                        let obj = this.safeParse(res.Data[0].数据校验信息).DJCP
                        const message = obj.map(item => `⚠️ ${item}`).join('<br>');
                        this.$alert(message, '警告', {
                            confirmButtonText: '返回',
                            dangerouslyUseHTMLString: true,
                            callback: () => this.back()
                        });
                    }


                } else {
                    this.$alert('DJCP信息和OA信息暂无数据', '警告', {
                        confirmButtonText: '返回',
                        callback: action => {
                            this.back()
                        }
                    });
                }
            })
            return

        },
        initializeResponses() {
            this.sizeForm.responses = this.fileUploadItems.map(item => ({
                result: null,
                label: item.label
            }));
        },
        safeParse(jsonStr) {
            if (!jsonStr) return {};
            try {
                return JSON.parse(jsonStr.replace(/'/g, '"'));
            } catch (e) {
                console.error('JSON parse error:', e);
                return {};
            }
        },
        handleRadioChange() {
            const errors = this.sizeForm.responses.filter(response => response.result == '错误');
            // 只有当存在错误时才设置 auditResult 为 "不通过"
            if (errors.length > 0) {
                this.auditResult = '不通过';
                this.rejectReason = errors.map(e => `${e.label}不通过`).join('\n');
            } else {
                // 如果之前是"通过"，就不需要清除
                if (this.auditResult !== '通过') {
                    this.auditResult = '';
                }
                this.rejectReason = '';
            }
        },
        handleViewChange() {
            this.tableData2 = this.viewMode === 'day'
                ? this.parseDailyData()
                : this.parsePersonalList()
        },
        parseDailyData() {
            const dailyData = this.parsedData?.OA?.['人员打卡信息（按天）'];
            if (!Array.isArray(dailyData)) return [];
            return dailyData.flatMap(item => {
                return Object.entries(item).map(([date, users]) => ({
                    year: date,
                    user: users.join('、')
                }));
            });
        },
        parsePersonalList() {
            const personalData = this.parsedData?.OA?.['人员打卡信息（按人）'];
            if (!Array.isArray(personalData)) return [];

            const personalMap = {};
            personalData.forEach(item => {
                Object.entries(item).forEach(([person, dates]) => {
                    personalMap[person] = [...new Set([...(personalMap[person] || []), ...dates])];
                });
            });

            return Object.entries(personalMap).map(([person, dates]) => ({
                person,
                dates: dates.join('、')
            }));
        },

        getStatusTag(status) {
            switch (status) {
                case 0:
                    return { type: 'info', label: '未操作' };
                case 1:
                    return { type: 'success', label: '已操作' };
                case 2:
                    return { type: 'danger', label: '已放弃' };
                case -1:
                    return { type: 'warning', label: '免操作' };
                default:
                    return { type: 'default', label: '未知' };
            }
        },

        auditSbmit() {
            // 校验审核结果是否已选择
            if (!this.auditResult) {
                this.$message.warning('请选择审核结果');
                return;
            }

            // 如果审核结果为 "不通过"，校验不通过原因是否填写
            if (this.auditResult === '不通过' && !this.rejectReason.trim()) {
                this.$message.warning('请填写不通过原因');
                return;
            }

            const message = `请确认审核结果：${this.auditResult}` +
                (this.auditResult === '不通过'
                    ? `<div style="margin-top: 10px;"><strong>不通过原因：</strong><br>${this.rejectReason || '无'}</div>`
                    : '')
            this.$confirm(
                message,
                '确认审核结果',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }
            ).then(() => {
                // 用户点击“确定”，执行提交逻辑
                let data = {
                    SystemID: this.oneObject.SystemID,
                    Remark: this.rejectReason,
                    voidid: 819
                };

                initList(data).then(res => {
                    if (res.Data) {
                        this.$message({
                            message: '提交成功',
                            type: 'success',
                            duration: 2000,
                            onClose: () => {
                                this.$router.go(-1);
                            }
                        });
                    } else {
                        this.$modal.alertError(res.ErrorInfo);
                    }
                });
            }).catch(() => {

            });
        }
    },

    created() {
        if (this.$route.query.data) {
            let data = JSON.parse(this.$route.query.data)
            this.oneObject.ReportDate = data.ReportDate,
                this.oneObject.SystemID = data.SystemID
            this.oneObject.ReportDate = data.ReportDate,
                this.twoObject.SystemID = data.SystemID
            this.twoObject.ReportDate = data.ReportDate
            this.formState = data.formState

            if (this.formState == '2' || this.formState == '3') {
                this.btnFlag = true
                // this.errorFalg=false
            } else {
                this.btnFlag = false
                //  this.errorFalg=true
            }
            this.errorFalg = false
        }

        // 初始化响应数据结构
        this.initializeResponses();
        this.getFrom()

    },



};
</script>

<style scoped>
/* 项目信息描述项样式 */
.project-info {
    margin: 15px 0;
}

.project-info :deep(.el-descriptions__body) {
    background-color: #f8f9fa;
}

.info-item :deep(.el-descriptions__label) {
    font-weight: 600;
    color: #606266;
    background-color: #f8f9fa !important;
}

.info-item :deep(.el-descriptions__content) {
    color: #303133;
    padding-left: 25px;
}

/* 时间范围样式 */
.time-range {
    color: #409EFF;
    font-weight: 500;
    letter-spacing: 0.5px;
}



/* 多内容区块样式 */
.multi-content {
    vertical-align: top;
}

.report-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.report-number {
    color: #303133;
    font-weight: 500;
}

.report-date {
    color: #909399;
    font-size: 0.9em;
}

/* 现场人员信息样式 */
.scene-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.personnel-list {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 10px;
}

.person-group {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.9em;
}

.person-group i {
    margin-right: 5px;
}

.leader {
    background-color: #e8f4ff;
    color: #409EFF;
}

.member {
    background-color: #f0f9eb;
    color: #67c23a;
}

.penetration {
    background-color: #fef0f0;
    color: #f56c6c;
}

/* 打卡表格样式 */
.sign-table {
    margin-top: 25px;
    width: 100%;
}

::v-deep.table-header th {
    background-color: #f8f9fa !important;
    font-weight: 600;
    color: #606266;
}

::v-deep.table-row td {
    padding: 12px 0;
}

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

.download-title {
    position: absolute;
    right: 4%;
    margin-bottom: 5px;
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

.submit-buttons {
    /* margin-top: 40px; */
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid #ebeef5;
}
</style>