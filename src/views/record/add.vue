<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="280px">
            <el-form-item label="项目编号：">
                <el-col :span="8">
                    <el-input v-model="form.name"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="备案编号：">
                <el-col :span="8">
                    <el-input v-model="form.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="系统名称：">
                <el-col :span="8">
                    <el-input v-model="form.name"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="系统编号：">
                <el-col :span="8">
                    <el-input v-model="form.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="单位名称：">
                <el-col :span="8">
                    <el-input v-model="form.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="报备时间：">
                <el-col :span="8">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                        style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="实际时间：">
                <el-col :span="8">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                        style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="上传等级测评计划书：">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                            :on-change="handleChange" :file-list="fileList">
                            <el-button size="mini" type="success" :disabled="radio == '2'">点击上传</el-button>
                        </el-upload>
                    </el-col>

                </el-row>


            </el-form-item>
            <el-form-item label="信息系统基本调查表">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                            :on-change="handleChange1" :file-list="fileList1">
                            <el-button size="mini" type="success">点击上传</el-button>
                        </el-upload>
                    </el-col>
                </el-row>

            </el-form-item>
            <el-form-item label="等级测评项目基本情况表">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                         <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange2" :file-list="fileList2">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
                <!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange2" :file-list="fileList2">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload> -->
            </el-form-item>
            <el-form-item label="提前进场说明">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange3" :file-list="fileList3">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
        
            </el-form-item>
            <el-form-item label="派工变更单">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange4" :file-list="fileList4">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
            
            </el-form-item>
            <el-form-item label="等级评测方案审核单">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange5" :file-list="fileList5">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
           
            </el-form-item>
            <el-form-item label="等级评测方案">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange6" :file-list="fileList6">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
             
            </el-form-item>
            <el-form-item label="风险规避方案">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange7" :file-list="fileList7">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
            
            </el-form-item>
            <el-form-item label="首次会议签到表">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange8" :file-list="fileList8">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
            
            </el-form-item>
            <el-form-item label="测评风险告知书">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange9" :file-list="fileList9">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
           
            </el-form-item>
            <el-form-item label="现场测评授权书">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange10" :file-list="fileList10">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
           
            </el-form-item>
            <el-form-item label="现场记录表">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange11" :file-list="fileList11">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
     
            </el-form-item>
            <el-form-item label="测试现场见证记录">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange12" :file-list="fileList12">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
          
            </el-form-item>
            <el-form-item label="测试现场接收/归还文档清单">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange13" :file-list="fileList13">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
           
            </el-form-item>
            <el-form-item label="末次会议签到表">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange14" :file-list="fileList14">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
           
            </el-form-item>
            <el-form-item label="验证测试授权书">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange15" :file-list="fileList15">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
              
            </el-form-item>

            <el-form-item label="验证性测试入场离场确认单">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange16" :file-list="fileList16">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
             
            </el-form-item>
            <el-form-item label="自愿放弃验证测试声明">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange17" :file-list="fileList17">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
            
            </el-form-item>
            <el-form-item label="原始扫漏记录">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange18" :file-list="fileList18">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
              
            </el-form-item>
            <el-form-item label="渗透测试报告">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange19" :file-list="fileList19">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
          
            </el-form-item>
            <el-form-item label="报告审核单">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange20" :file-list="fileList20">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
             
            </el-form-item>
            <el-form-item label="打卡截图">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange21" :file-list="fileList21">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
          
            </el-form-item>
            <el-form-item label="信息安全等级保护测评服务情况评价表">
                <el-row>
                    <el-col :span="4">
                        <span class="btn">
                            <el-radio v-model="radio" label="1" @change="handleRadioChange">原件</el-radio>
                            <el-radio v-model="radio" label="2" @change="handleRadioChange">共用</el-radio>
                        </span>
                    </el-col>
                    <el-col :span="12">
                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange22" :file-list="fileList22">
                    <el-button size="mini" type="success">点击上传</el-button>

                </el-upload>
                    </el-col>
                </el-row>
              
            </el-form-item>

            <el-form-item style="text-align: center; margin-top: 40px;">
                <el-button type="primary" @click="onSubmit">创建</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>

        <el-dialog title="共用文件列表" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
            <!-- 添加 row-key 和 selection-change 事件 -->
            <el-table :data="tableData1" :row-key="getRowKey" @selection-change="handleSelectionChange"
                ref="multipleTable">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="文件编号" align="center" prop="A" />
                <el-table-column label="文件系统" align="center" prop="b" />
                <el-table-column label="文件日期" align="center" prop="c" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Addrecord",
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
            dialogVisible: false,
            radio: '1',

            title: "",
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            upload: {
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " }
            },
            uploadedFiles: [],
            previewUrl: null,
            uploadError: null,
            fileList: [

            ],
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],

            fileList5: [],
            fileList6: [],
            fileList7: [],
            fileList8: [],
            fileList9: [],
            fileList10: [],
            fileList11: [],
            fileList12: [],
            fileList13: [],
            fileList14: [],
            fileList15: [],
            fileList16: [],
            fileList17: [],
            fileList18: [],
            fileList19: [],
            fileList20: [],
            fileList21: [],
            fileList22: [],
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
                },

            ],
        };
    },
    created() {

    },
    methods: {
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
            this.ids = selection
            // if (selection.length > 1) {
            //     // 取消之前的选中状态
            //     this.$refs.multipleTable.clearSelection();
            //     // 选中当前行
            //     this.$refs.multipleTable.toggleRowSelection(selection[selection.length - 1], true);
            // }
            // this.ids = selection.map(item => item.serialNumber)
            // this.single = selection.length !== 1
            // this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加公告";
        },
        // 上传文件前的钩子
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
        // 上传成功的回调
        handleUploadSuccess(response, file, fileList) {
            if (!this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                this.$message.success('文件上传成功');
                this.uploadedFiles.push(file);
                this.uploadError = null;
            }
        },
        // 上传失败的回调
        handleUploadError(error, file, fileList) {
            this.uploadError = '文件上传失败，请检查网络或文件格式。';
        },
        // 文件选择变化时的回调
        handleFileChange(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(file.raw);
        },
        // 打开文件预览
        openPreview() {
            window.open(this.previewUrl, '_blank');
        },
        // 提交表单
        onSubmit() {
            console.log('表单数据:', this.form);
            console.log('上传的文件:', this.uploadedFiles);
            // 这里可以添加更多的提交逻辑
        },
        // 格式化文件大小
        formatFileSize(size) {
            if (size < 1024) {
                return size + 'B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + 'KB';
            } else {
                return (size / (1024 * 1024)).toFixed(2) + 'MB';
            }
        },
        handleChange(file, fileList) {

            file.name = '等级测评计划书-' + file.name
            this.fileList = fileList;
            console.log(this.fileList)
        },
        handleChange1(file, fileList) {
            console.log(file, fileList)
            file.name = '信息系统基本调查表-' + file.name
            this.fileList1 = fileList;
        },
        handleChange2(file, fileList) {
            console.log(file, fileList)
            file.name = '等级测评项目基本情况表-' + file.name
            this.fileList2 = fileList;
        },
        handleChange3(file, fileList) {
            console.log(file, fileList)
            file.name = '提前进场说明-' + file.name
            this.fileList3 = fileList;
        },
        handleChange4(file, fileList) {
            console.log(file, fileList)
            file.name = '派工变更单-' + file.name
            this.fileList4 = fileList;
        },
        handleChange5(file, fileList) {
            console.log(file, fileList)
            file.name = '等级评测方案审核单-' + file.name
            this.fileList5 = fileList;
        },
        handleChange6(file, fileList) {
            console.log(file, fileList)
            file.name = '等级评测方案-' + file.name
            this.fileList6 = fileList;
        },
        handleChange7(file, fileList) {
            console.log(file, fileList)
            file.name = '风险规避方案-' + file.name
            this.fileList7 = fileList;
        },
        handleChange8(file, fileList) {
            console.log(file, fileList)
            file.name = '首次会议签到表-' + file.name
            this.fileList8 = fileList;
        },
        handleChange9(file, fileList) {
            console.log(file, fileList)
            file.name = '测评风险告知书-' + file.name
            this.fileList9 = fileList;
        },
        handleChange10(file, fileList) {
            console.log(file, fileList)
            file.name = '现场测评授权书-' + file.name
            this.fileList10 = fileList;
        },
        handleChange11(file, fileList) {
            console.log(file, fileList)
            file.name = '现场记录表-' + file.name
            this.fileList11 = fileList;
        },
        handleChange12(file, fileList) {
            console.log(file, fileList)
            file.name = '测试现场见证记录-' + file.name
            this.fileList12 = fileList;
        },
        handleChange13(file, fileList) {
            console.log(file, fileList)
            file.name = '测试现场接收/归还文档清单-' + file.name
            this.fileList13 = fileList;
        },
        handleChange14(file, fileList) {
            console.log(file, fileList)
            file.name = '末次会议签到表-' + file.name
            this.fileList14 = fileList;
        },
        handleChange15(file, fileList) {
            console.log(file, fileList)
            file.name = '验证测试授权书-' + file.name
            this.fileList15 = fileList;
        },
        handleChange16(file, fileList) {
            console.log(file, fileList)
            file.name = '验证性测试入场离场确认单-' + file.name
            this.fileList16 = fileList;
        },
        handleChange17(file, fileList) {
            console.log(file, fileList)
            file.name = '自愿放弃验证测试声明-' + file.name
            this.fileList17 = fileList;
        },
        handleChange18(file, fileList) {
            console.log(file, fileList)
            file.name = '原始扫漏记录-' + file.name
            this.fileList18 = fileList;
        },
        handleChange19(file, fileList) {
            console.log(file, fileList)
            file.name = '渗透测试报告-' + file.name
            this.fileList19 = fileList;
        },
        handleChange20(file, fileList) {
            console.log(file, fileList)
            file.name = '报告审核单-' + file.name
            this.fileList20 = fileList;
        },
        handleChange21(file, fileList) {
            console.log(file, fileList)
            file.name = '打卡截图-' + file.name
            this.fileList21 = fileList;
        },
        handleChange22(file, fileList) {
            console.log(file, fileList)
            file.name = '信息安全等级保护测评服务情况评价表-' + file.name
            this.fileList22 = fileList;
        },
        handleRadioChange(value) {
            this.fileList = []
            if (value == 2) {
                this.ids = []
                this.dialogVisible = true
            }
            // 在这里可以添加你需要的逻辑
        },
        back() {
            this.$router.go(-1)
        },
        getRowKey(row) {
            return row.A; // 这里假设 'A' 是唯一标识
        },
        handleClose() {
            // 关闭对话框时的逻辑
        },
        submit() {
            if (this.ids.length > 0) {
                this.fileList = [
                    {
                        "status": "ready",
                        "name": "等级测评计划书-" + this.ids[0].A,
                        "size": 92160,
                        "percentage": 0,
                        "uid": 1742450981889,
                        "raw": {
                            "uid": 1742450981889
                        }
                    }
                ]
            }

            this.$refs.multipleTable.clearSelection();
            this.ids = []
            this.dialogVisible = false

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

.upload-error-message {
    color: red;
    margin-top: 5px;
}

.file-info {
    margin-top: 10px;
}

.file-info ul {
    list-style-type: none;
    padding: 0;
}

.file-info li {
    margin-bottom: 5px;
}

.btn {
    margin-left: 10px;
    display: block;
}

/* .table-wrap{
  /deep/.el-table__header{
    .el-checkbox{
      display: none;
    }
  }
} */
</style>