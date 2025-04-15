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
                    <el-descriptions-item label="测评组人员">张三、李四</el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 实施报备信息 -->
            <el-card class="box-card" shadow="never" style="margin-top: 20px;">
                <template #header>
                    <span class="section-title">实施报备信息</span>
                </template>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报备审核通过时间：" label-width="180px">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.reportTime"
                                style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报备许可时间：" label-width="180px">
                            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="form.reportTime"
                                style="width: 100%;"></el-date-picker> -->
                            <el-date-picker v-model="value1" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="报备人员：" label-width="180px">
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
                    <el-col :span="24" v-for="(item, index) in projectPhases" :key="index" style="margin-left: 10px;">
                        <el-form-item :label="item.label" label-width="140px">
                            <el-row v-if="!item.datefales">
                                <div v-if="item.prop == 'stxx' || item.prop == 'lssj'">
                                    <span>
                                        <el-radio  v-model="form[`${item.prop}radio`]" label="1" border size="mini">放弃</el-radio>
                                        <el-radio  v-model="form[`${item.prop}radio`]" label="2" border size="mini">未放弃</el-radio>
                                        <span v-if="item.prop == 'stxx'"> <el-radio   v-model="form[`${item.prop}radio`]" label="3"  border size="mini">不做</el-radio></span>
                                    </span>
                                    <sapn style="margin-left: 25px;" v-if="form[`${item.prop}radio`]=='2'">
                                        <el-radio  v-model="form[`${item.prop}radio1`]" label="4"  size="mini">本地</el-radio>
                                        <el-radio  v-model="form[`${item.prop}radio1`]" label="5"  size="mini">远程</el-radio>
                                    </sapn>
                                </div>
                                <div v-else >
                                    <div v-if="item.prop!=='bgxx'">
                                    <el-col :span="2.5" style="text-align: center;">
                                        <span>开始时间：</span>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-date-picker type="date" size="mini" placeholder="选择日期"
                                            value-format="yyyy-MM-dd" v-model="form[`${item.prop}startTime`]"
                                            style="width: 100%;"></el-date-picker>
                                    </el-col>
                                    <el-col :span="2.5" style="text-align: center; margin-left: 5px;">
                                        <span>结束时间：</span>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-date-picker type="date" size="mini" placeholder="选择日期"
                                            value-format="yyyy-MM-dd" v-model="form[`${item.prop}endTime`]"
                                            style="width: 100%;"></el-date-picker>
                                    </el-col>
                                </div>
                                    <div v-if="item.prop=='xccp'">
                                        <el-col :span="2.5" style="text-align: center; margin-left: 5px;" >
                                        <span>测试组长：</span>
                                    </el-col>
                                    <el-col :span="3" style="margin-left: 5px;" >

                                        <el-input v-model="form[`${item.prop}leader`]" :placeholder="item.placeholder"
                                            size="mini"></el-input>
                                    </el-col>
                                    <el-col :span="2.5" style="text-align: center; margin-left: 5px;" >
                                        <span>组员：</span>
                                    </el-col>
                                    <el-col :span="3" style="margin-left: 5px;" >

                                        <el-input v-model="form[`${item.prop}user`]" :placeholder="item.placeholder"
                                            size="mini"></el-input>
                                    </el-col>
                                    <el-col :span="2.5" style="text-align: center; margin-left: 5px;" >
                                        <span>渗透人员：</span>
                                    </el-col>
                                    <el-col :span="3" style="margin-left: 5px;" >
                                        <el-input v-model="form[`${item.prop}permeate`]" :placeholder="item.placeholder"
                                            size="mini"></el-input>
                                    </el-col>
                                    </div>
                                </div>
                                <div v-if="item.prop=='bgxx'">
                                    <el-col :span="2.5" style="text-align: center;">
                                        <span>报告编号：</span>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input v-model="form[`${item.prop}permeate`]" :placeholder="item.placeholder"
                                            size="mini"></el-input>
                                    </el-col>
                                    <el-col :span="2.5" style="text-align: center; margin-left: 5px;">
                                        <span>报告封面时间：</span>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input v-model="form[`${item.prop}permeate`]" :placeholder="item.placeholder"
                                            size="mini"></el-input>
                                    </el-col>
                                </div>

                            </el-row>
                            <el-row v-else>
                                <!-- 打卡日期（改成表格） 打卡人员/打开日期： 2024-3-15、2024-3-18 -->
                                <el-table :data="tableData2" border style="width: 50%">
                                    <el-table-column prop="year" label="打卡日期" align="center" width="180">
                                    </el-table-column>
                                    <el-table-column prop="user" label="打卡人员" align="center">
                                    </el-table-column>

                                </el-table>
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
                <!-- <el-row v-for="(item, index) in fileUploadItems" :key="index"> -->
                <el-row v-for="(item, index) in filteredFileUploadItems" :key="index" style="margin-left: 10px;">
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
                                <el-col :span="4" v-if="item.hasInput" style="margin-right: 5px;">
                                    <el-input placeholder="签署人员多人请用、符号区分" v-model="form[item.inputModel]"
                                        @blur="handleInput(index, item)" size="mini"></el-input>
                                </el-col>
                                <el-col :span="4" v-if="item.first" style="margin-right: 5px;">
                                    <el-input placeholder="甲方人员多人请用、符号区分" v-model="form[`${item.inputModel}PartyA`]"
                                        @blur="handleInput(index, item, true)" size="mini"></el-input>
                                </el-col>
                                <div v-if="item.fileType == '现场测评授权书'">
                                    <el-col :span="6" v-if="item.hasDatePicker">
                                        <el-date-picker v-model="form[item.dateModel]" size="mini"
                                            value-format="yyyy-MM-dd" type="date" :placeholder="item.datePlaceholder"
                                            @change="handleDateChange(item, index)"></el-date-picker>
                                    </el-col>
                                </div>
                                <div v-else>
                                    <el-col :span="4" v-if="item.hasDatePicker">
                                        <el-date-picker v-model="form[item.dateModel]" size="mini"
                                            value-format="yyyy-MM-dd" type="date" :placeholder="item.datePlaceholder"
                                            @change="handleDateChange(item, index)"></el-date-picker>
                                    </el-col>
                                </div>


                                <!-- <el-col :span="2" style="margin-left: 8px;">
                                     现场签署时间范围
                                </el-col> -->
                                <el-col :span="6" v-if="item.dateList" style="margin-left: 8px;">

                                    <div v-if="item.fileType == '测试现场接收/归还文档清单'">
                                        <el-date-picker v-model="form[item.orizonDate]" type="daterange" size="mini"
                                            range-separator="至" value-format="yyyy-MM-dd" start-placeholder="接收日期"
                                            end-placeholder="归还日期" @change="handleDatehorizon(item, index)">
                                        </el-date-picker>
                                    </div>
                                    <div v-else>
                                        <el-date-picker v-model="form[item.orizonDate]" type="daterange" size="mini"
                                            range-separator="至" value-format="yyyy-MM-dd" start-placeholder="授权开始日期"
                                            end-placeholder="授权结束日期" @change="handleDatehorizon(item, index)">
                                        </el-date-picker>
                                    </div>

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
                cpzbstartTime: '',//测评开始时间
                cpzbendTime: '',// 测评结束时间
                cezbuser: '', //测评准备人员
                fabzstartTime: '',//方案编制开始时间
                fabzendTime: '',// 方案编制结束时间
                fabzuser: '', //方案编制人员
                xccpstartTime: '2025-03-15',//现场测评开始时间
                xccpendTime: '2025-03-18',// 现场测评结束时间
                xccpuser: '张三、李四', //现场测评人员
                bgbzstartTime: '',//报告编制开始时间
                bgbzendTime: '',// 报告编制结束时间
                bgbzuser: '', //报告编制测评人员
                stxxstartTime: '',//渗透信息开始时间
                stxxendTime: '',// 渗透信息结束时间
                stxxuser: '', //渗透信息测评人员
                lssjstartTime: '',//漏扫开始时间
                lssjendTime: '',// 漏扫结束时间
                lssjuser: '', //漏扫测评人员
                projectNumber: '',
                unitName: '',
                recordNumber: '',
                systemNumber: '',
                systemName: '',
                reportTime: '',
                reportPerson: '张三、李四',
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
                dispatchChangeDate: '',
                // 新增甲方人员字段
                assessmentRiskNoticeSignerPartyA: '',
                dispatchChangeSignerPartyA: '',
                sceneSigner: '张三、李四',
                firstMeetingSigner: '张三、李四',
                   stxxradio: '1', // 渗透测试信息默认选择有
                lssjradio: '1', // 漏扫时间信息默认选择有
                // 其他字段以此类推...
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
            value1: [],

            uploadError: null,
            uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
            tableData2: [
                {
                    year: '2024-12-11',
                    user: '张三',
                    address: '湖北省武汉市江岸区京汉大道38号'
                },
                {
                    year: '2024-12-07',
                    user: '李四',
                    address: '北京市朝阳区京汉大道38号'
                }
            ],
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
                {
                    label: "测评准备信息：", prop: "cpzb",
                    placeholder: "测评准备人员信息",
                    radiofalg: false
                },
                { label: "方案编制信息：", prop: "fabz", placeholder: "方案编制人员信息" },
                { label: "现场测评信息：", prop: "xccp", placeholder: "现场测评人员信息" },
                { label: "渗透测试信息：", prop: "stxx", placeholder: "渗透人员信息" },
                { label: "漏扫时间信息：", prop: "lssj", placeholder: "漏扫人员信息" },
                { label: "报告编制信息：", prop: "bgbz", placeholder: "报告编制人员信息" },
                { label: "报告信息：", prop: "bgxx", placeholder: "报告信息" },
                { label: "行程信息：", prop: "vulnerabilityScanTime", placeholder: "行程人员(打开人员获取)信息", datefales: true }
            ],
            fileUploadItems: [
                { label: "信息系统基本调查表：", fileType: "信息系统基本调查表", hasRadio: true },
                { label: "等级测评项目基本情况表：", fileType: "等级测评项目基本情况表", hasRadio: true },
                { label: "上传等级测评计划书：", fileType: "等级测评计划书", hasRadio: false, disableOnShared: true },

                { label: "派工变更单：", fileType: "派工变更单", hasRadio: true, hasInput: true, inputModel: "dispatchChangeSigner", hasDatePicker: true, dateModel: "dispatchChangeDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "等级测评方案审核单：", fileType: "等级测评方案审核单", hasRadio: false },
                { label: "等级测评方案：", fileType: "等级测评方案", hasRadio: false, hasInput: true, inputModel: "assessmentPlanSigner", hasDatePicker: true, dateModel: "assessmentPlanDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "风险规避方案：", fileType: "风险规避方案", hasRadio: true },
                { label: "首次会议签到表：", first: true, fileType: "首次会议签到表", hasRadio: true, hasInput: true, inputModel: "firstMeetingSigner", hasDatePicker: true, dateModel: "firstMeetingDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "测评风险告知书：", fileType: "测评风险告知书", hasRadio: true, hasInput: true, inputModel: "assessmentRiskNoticeSigner", hasDatePicker: false, dateModel: "assessmentRiskNoticeDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "现场测评授权书：", fileType: "现场测评授权书", hasRadio: true, hasDatePicker: true, datePlaceholder: "签署日期早于授权开始时间", dateModel: "cpDate", dateList: true, orizonDate: 'xccpsqorizonDate' },
                { label: "现场记录表：", first: true, fileType: "现场记录表", hasRadio: false, hasInput: true, inputModel: "siteRecordSigner", hasDatePicker: false, dateModel: "siteRecordDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "测评项目现场见证记录：", fileType: "测评项目现场见证记录", hasRadio: false, hasDatePicker: true, inputModel: "sceneSigner", dateModel: "sceneDate", hasInput: true, datePlaceholder: "签署日期" },
                { label: "测试现场接收/归还文档清单：", first: true, fileType: "测试现场接收/归还文档清单", hasRadio: true, hasInput: true, inputModel: "documentListSigner", hasDatePicker: false, dateModel: "documentListDate", datePlaceholder: "签署日期", radio: '1', dateList: true, orizonDate: 'csghorizonDate' },
                { label: "末次会议签到表：", first: true, fileType: "末次会议签到表", hasRadio: true, hasInput: true, inputModel: "lastMeetingSigner", hasDatePicker: true, dateModel: "lastMeetingDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "验证测试授权书：", first: true, fileType: "验证测试授权书", hasRadio: true, hasInput: false, inputModel: "verificationAuthorizationSigner", hasDatePicker: true, dateModel: "verificationAuthorizationDate", datePlaceholder: "签署日期", radio: '1', dateList: true, orizonDate: 'yzcsorizonDate' },
                { label: "验证性测试入场离场确认单：", fileType: "验证性测试入场离场确认单", hasRadio: true, hasInput: true, inputModel: "verificationConfirmationSigner", hasDatePicker: true, dateModel: "verificationConfirmationDate", datePlaceholder: "签署日期", radio: '1', dateList: true },
                { label: "自愿放弃验证测试声明：", fileType: "自愿放弃验证测试声明", hasRadio: true },
                { label: "原始扫漏记录：", first: true, fileType: "原始扫漏记录", hasRadio: true, hasInput: true, inputModel: "vulnerabilityRecordSigner", hasDatePicker: true, dateModel: "vulnerabilityRecordDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "渗透测试报告：", first: true, fileType: "渗透测试报告", hasRadio: false, hasInput: true, inputModel: "penetrationReportSigner", hasDatePicker: true, dateModel: "penetrationReportDate", datePlaceholder: "签署日期", radio: '1' },
                { label: "信息安全等级保护测评服务情况评价表：", first: true, fileType: "信息安全等级保护测评服务情况评价表", hasRadio: true, hasInput: false, inputModel: "evaluationFormSigner", hasDatePicker: true, dateModel: "evaluationFormDate", datePlaceholder: "签署日期", radio: '1' },
            ],
            downloadList: [],
            selectedFileIndex: null,
            showDispatchChangeForm: false, // 新增标志位
        };
    },
    methods: {
        onSubmit() {
            console.log(this.form)
            return
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

                // 其他字段以此类推...
            };

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
            this.dialogVisible = false
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
        handleDatehorizon(val, index) {

            if (val.fileType == '测试现场接收/归还文档清单') {
                const startDateXccp = new Date(this.form.xccpendTime);
                const [start, end] = this.form[val.dateModel];
                const startDate = new Date(start);
                const endDateRange = new Date(end);
                if (startDate > startDateXccp || endDateRange > startDateXccp) {
                    this.$alert('测试现场接收/归还文档清单的接收时间和规划日期不能晚于现场测评信息的结束时间!', '警告！', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.form[val.dateModel] = [];
                        }
                    });
                    return;
                }
            }
            if (val.fileType == '验证测试授权书') {
                const startDateXccp = new Date(this.form.xccpstartTime);
                const [start, end] = this.form[val.orizonDate];
                const startDate = new Date(start);
                if (startDate > startDateXccp) {
                    this.$alert('验证测试授权书 授权时间范围开始时间不得早于现场测评时间', '警告！', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.form[val.orizonDate] = [];

                        }
                    });
                    return;
                }
                this.form.verificationAuthorizationDate = ''
            }
            if (val.fileType == '现场测评授权书') {

                const startDateXccp = new Date(this.form.xccpstartTime);
                const [start, end] = this.form[val.orizonDate];
                const startDate = new Date(start);
                const endDateRange = new Date(end);

                // 判断 startDateXccp 是否在 [startDate, endDateRange] 区间内
                if (startDateXccp >= startDate && startDateXccp <= endDateRange) {
                    // 在区间内的处理逻辑

                } else {
                    // 不在区间内的处理逻辑
                    this.$alert('现场测评授权时间不在现场测评开始时间范围内!', '警告！', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.form[val.orizonDate] = [];
                        }
                    });
                }
            }
        },
        handleDateChange(val, index) {

            if (val.fileType == '测试现场接收/归还文档清单') {
                const startDateXccp = new Date(this.form.xccpendTime);
                const [start, end] = this.form[val.dateModel];
                const startDate = new Date(start);
                const endDateRange = new Date(end);
                if (startDate > startDateXccp || endDateRange > startDateXccp) {
                    this.$alert('测试现场接收/归还文档清单的接收时间和规划日期不能晚于现场测评信息的结束时间!', '警告！', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.form[val.dateModel] = [];
                        }
                    });
                    return;
                }
            }

            switch (val.fileType) {
                case '测评风险告知书':
                    if (!this.isDateInRange4(this.form.assessmentRiskNoticeDate, this.form.xccpstartTime)) {
                        this.$alert('测评风险告知书签署时间不能晚于现场测评时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        this.form.assessmentRiskNoticeDate = ''
                    }
                    break
                case '首次会议签到表':
                    const firstMeetingDate = new Date(this.form.firstMeetingDate);
                    const xccpstartTime = new Date(this.form.xccpstartTime);
                    if (firstMeetingDate.getTime() != xccpstartTime.getTime()) {
                        this.$alert('首次会议签到表签署必须等于评测时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        this.form.firstMeetingDate = '';
                        return;
                    }

                    break
                case '现场测评授权书':


                    if (!this.isDateInRange(this.form.xccpstartTime, this.form.xccpendTime, this.form.cpDate)) {
                        this.$alert('现场测评授权书签署时间不能晚于现场测评时间和不早于现场测评结束时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        this.form.cpDate=''
                    }
                    break
                case '原始扫漏记录':
                    if (!this.isDateInRange1(this.form.xccpendTime, this.form.vulnerabilityRecordDate)) {
                        this.$alert('原始扫漏记录不能晚于现场测评结束时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                        this.form.vulnerabilityRecordDate = ''
                    }
                    break
                case '渗透测试报告':
                    if (!this.isDateInRange1(this.form.xccpendTime, this.form.penetrationReportDate)) {
                        this.$alert('渗透测试报告不能晚于现场测评结束时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                        this.form.penetrationReportDate = ''
                    }
                    break
                case '信息安全等级保护测评服务情况评价表':
                    if (!this.isDateInRange1(this.form.xccpendTime, this.form.evaluationFormDate)) {
                        this.$alert('信息安全等级保护测评服务情况评价表签署时间不能晚于现场测评结束时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                        this.form.evaluationFormDate = ''
                    }
                    break
                case '测评项目现场见证记录':
                    if (!this.isDateInRange(this.form.xccpstartTime, this.form.xccpendTime, this.form.sceneDate)) {
                        this.$alert('测评项目现场见证记录签署时间不能晚于现场测评时间和不早于现场测评结束时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        this.form.sceneDate = ''
                    }
                    break
                case '末次会议签到表':
                    if (!this.isDateInRange2(this.form.lastMeetingDate, this.form.xccpendTime, this.form.sceneDate)) {
                        this.$alert('末次会议签到表签署时间现场测评结束当天  必须等于结束时间!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        this.form.lastMeetingDate = ''
                    }
                    break
                case '验证测试授权书':
                    if (this.form.yzcsorizonDate) {
                        if (!this.isDateInRange4(this.form.verificationAuthorizationDate, this.form.yzcsorizonDate[0])) {
                            this.$alert('签署时间不能晚于授权时间的开始时间!', '警告！', {
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });
                            this.form.verificationAuthorizationDate = ''
                        }

                    } else {
                        this.$alert('请先填写验证测试授权书授权时间范围!', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        this.form.verificationAuthorizationDate = ''
                    }

                    break
                case '等级测评方案':
                    if (this.isDateInRange5(this.form.assessmentPlanDate, this.form.xccpstartTime)) {
                        this.$alert('等级测评方案签署时间不能大于当天', '警告！', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        this.form.assessmentPlanDate = ''
                    }
                    break



                default:

            }
            const item = this.fileUploadItems[index];
            const dateValue = this.form[item.dateModel];
            return

        },
        hasRiskNotice(downloadList, val) {
            return downloadList.some(item => item.title === val);
        },
        removeRiskNotice(downloadList, val) {
            return downloadList.filter(item => item.title !== val);
        },
        handleInput(index, val, isPartyA = false) {
            console.log(index, val)
            const item = this.fileUploadItems[index];
            const inputKey = isPartyA ? `${item.inputModel}PartyA` : item.inputModel;
            const inputValue = this.form[inputKey];
            const regex = /^[\u4e00-\u9fa5、]*$/;
            if (!regex.test(inputValue)) {
                this.form[inputKey] = inputValue.replace(/[^\u4e00-\u9fa5、]/g, '');
            } else {
                const personToFiles = {};

                // 遍历所有文件输入项，重新构建 personToFiles 映射
                this.fileUploadItems.forEach(item => {
                    const input = this.form[item.inputModel];
                    const inputPartyA = this.form[`${item.inputModel}PartyA`];
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
                    if (inputPartyA) {
                        const persons = inputPartyA.split('、');
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
        },
        isDateInRange(star, end, date) {
            function getDateTimestamp(dateObj) {
                return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
            }
            const startDate = getDateTimestamp(new Date(star));
            const endDate = getDateTimestamp(new Date(end));
            const inputDate = getDateTimestamp(new Date(date));

            return inputDate >= startDate && inputDate <= endDate;

        },
        isDateInRange1(end, date) {
            function getDateTimestamp(dateObj) {
                return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
            }
            const endDate = getDateTimestamp(new Date(end));
            const inputDate = getDateTimestamp(new Date(date));

            return inputDate <= endDate;

        },
        isDateInRange2(end, date) {
            function getDateTimestamp(dateObj) {
                return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
            }
            const endDate = getDateTimestamp(new Date(end));
            const inputDate = getDateTimestamp(new Date(date));

            return inputDate == endDate;

        },
        isDateInRange3(end, date) {
            function getDateTimestamp(dateObj) {
                return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
            }
            const endDate = getDateTimestamp(new Date(end));
            const inputDate = getDateTimestamp(new Date(date));

            return inputDate == endDate;

        },
        isDateInRange4(end, date) {
            function getDateTimestamp(dateObj) {
                return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
            }
            const endDate = getDateTimestamp(new Date(end));
            const inputDate = getDateTimestamp(new Date(date));

            return inputDate >= endDate;

        },
        isDateInRange5(end, date) {
            function getDateTimestamp(dateObj) {
                return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
            }
            const endDate = getDateTimestamp(new Date(end));
            const inputDate = getDateTimestamp(new Date(date));

            return inputDate < endDate;

        },
    },
    watch: {
        // 监听现场测评人员和报备人员的变化
        'form.xccpuser': function (newVal, oldVal) {
            this.showDispatchChangeForm = newVal === this.form.reportPerson;
        },
        'form.reportPerson': function (newVal, oldVal) {
            this.showDispatchChangeForm = this.form.xccpuser === newVal;
        }
    },
    computed: {
        // 过滤fileUploadItems数组
        filteredFileUploadItems() {
    const stxxAbandon = this.form.stxxradio == '1'||this.form.stxxradio == '3';  // 渗透测试放弃
    const lssjAbandon = this.form.lssjradio == '1';  // 漏扫放弃
    const bothAbandon = stxxAbandon && lssjAbandon;    // 两者都放弃

    return this.fileUploadItems.filter(item => {
      // 处理派工变更单的独立逻辑
      if (item.fileType === '派工变更单') {
        return this.form.xccpuser !== this.form.reportPerson;
      }

      // 处理渗透和漏扫相关的过滤
      const isPenetrationReport = item.fileType === '渗透测试报告';
      const isVulnerabilityRecord = item.fileType === '原始扫漏记录';
      const isVerificationAuth = item.fileType === '验证测试授权书';
      const isVerificationConfirm = item.fileType === '验证性测试入场离场确认单';

      // 渗透放弃时过滤渗透报告
      if (stxxAbandon && isPenetrationReport) return false;
      
      // 漏扫放弃时过滤原始记录
      if (lssjAbandon && isVulnerabilityRecord) return false;
      
      // 两者都放弃时过滤验证相关文件
      if (bothAbandon && (isVerificationAuth || isVerificationConfirm)) return false;

      return true;
    });
  }
    },
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