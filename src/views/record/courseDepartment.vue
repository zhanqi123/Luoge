<template>
    <div class="app-container">
        <el-card class="box-card">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                label-width="110px">
                <el-form-item label="项目编码" prop="ProjectID">
                    <el-input v-model="queryParams.ProjectID" placeholder="请输入项目编号" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="系统编号" prop="SystemID">
                    <el-input v-model="queryParams.SystemID" placeholder="请输入系统编号" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="系统名称" prop="SystemName">
                    <el-input v-model="queryParams.SystemName" placeholder="请输入系统名称" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="项目负责人" prop="SaleStaffName">
                    <el-input v-model="queryParams.SaleStaffName" placeholder="请输入项目负责人" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="所属部门" prop="deptId">
                    <treeselect v-model="queryParams.deptId" :options="deptOptions" :normalizer="normalizer"
                        :appendToBody="true" placeholder="请选择归属部门" style="width: 215px;" />
                </el-form-item>
                <el-form-item label="是否为测评组长" prop="leader">
                    <el-select v-model="queryParams.leader" placeholder="请选择是否为测评组长">
                        <el-option v-for="item in leaderOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="归档状态" prop="state">
                    <el-select v-model="queryParams.state" placeholder="请选择" multiple @change="handleStateChange">
                        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-table :data="currentTableData" v-loading="loading">
            <el-table-column label="项目编号" align="center" prop="项目编号" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="项目状态" align="center" prop="项目状态" width="120" />
            <el-table-column label="项目名称" align="center" prop="项目名称" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="系统编号" align="center" prop="系统编号" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="系统名称" align="center" prop="系统名称" width="250" :show-overflow-tooltip="true" />

            <el-table-column label="被测单位名称" align="center" prop="被测单位名称" width="150" :show-overflow-tooltip="true" />
            <el-table-column label="项目负责人" align="center" prop="项目负责人" width="150" />
            <el-table-column label="项目归属部门" align="center" prop="项目归属部门" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="项目归属一级部门" align="center" prop="项目归属一级部门" :show-overflow-tooltip="true"
                width="180" />

            <el-table-column label="一阶段审核人员" align="center" prop="一阶段审核人员" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="一阶段审核时间" align="center" prop="一阶段审核时间" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="一阶段审核状态" align="center" prop="一阶段审核状态" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="二阶段审核人员" align="center" prop="二阶段审核人员" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="二阶段审核时间" align="center" prop="二阶段审核时间" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="二阶段审核状态" align="center" prop="二阶段审核状态" :show-overflow-tooltip="true" width="180" />
            <el-table-column label="系统级别" align="center" prop="系统级别">
                <template slot-scope="scope">
                    <el-tag :effect="'plain'" :type="getTagType(scope.row.系统级别)" size="small">
                        {{ scope.row.系统级别 }}级
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="归档状态" align="center" width="120">
                <template slot-scope="scope">
                    <el-tag :effect="'dark'" :type="getState(scope.row.归档状态)" size="small">
                        {{ scope.row.归档状态?scope.row.归档状态:'暂无状态' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="报告封面日期" align="center" prop="报告封面日期" width="150" />
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleLook(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
            @pagination="handlePagination" />
    </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import { Splitpanes, Pane } from "splitpanes";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { initList } from '@/api/record.js'
import { getToken } from '@/utils/auth'
export default {
    name: "courseDepartment",
    components: { Treeselect, Splitpanes, Pane },
    data() {
        return {
            // 遮罩层
            loading: true,

            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            currentPage: 1,
            pageSize: 10,
            // 原始表格数据
            originalTableData: [],
            // 当前页表格数据
            currentTableData: [],

            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                state: ['已分配归档人员', '归档材料审核中', '归档材料返回修改中', '归档材料审核通过', '档案未入库', '归档完成'],
                pageNum: 1,
                pageSize: 10,
                ProjectID: '',
                SystemID: '',
                SystemName: '',
                ShowOtherSys: 0,
                SaleStaffName: '',
                EvaluationStaffName: '',
                ArchiveStaffName: '',
                deptId: null,
                leader: ''
            },
            userName: '',
            deptOptions: [],
            originaldeptList: [],
            departmentList: [], //所有部门数据
            treeLoading: false,
            stateOptions: [
                {
                    value: '已分配归档人员',
                    label: '已分配归档人员'
                }, {
                    value: '归档材料审核中',
                    label: '归档材料审核中'
                }, {
                    value: '归档材料返回修改中',
                    label: '归档材料返回修改中'
                },
                {
                    value: '归档材料审核通过',
                    label: '归档材料审核通过'
                },
                {
                    value: '档案未入库',
                    label: '档案未入库'
                },
                {
                    value: '归档完成',
                    label: '归档完成'
                },
                { value: 'all', label: '全部' } // 使用 'all' 标识
            ],
            leaderOptions: [
                {
                    value: '1',
                    label: '否'
                }, {
                    value: '0',
                    label: '是'
                }
            ]
        };
    },
    created() {
        if (localStorage.getItem('name')) {
            this.userName = localStorage.getItem('name')
        }
        // 并行获取部门数据和列表数据
        Promise.all([
            this.initDepartment(),
            this.getList()
        ]).catch(error => {
            this.$message.error('初始化数据失败');
        });
    },
    methods: {
        // 获取部门数据
        initDepartment() {
            return new Promise((resolve, reject) => {
                let formData = {
                    voidid: 830,
                    DepID: '1'
                }
                
                initList(formData).then(res => {
                    if (res.Data) {
                        this.departmentList = [this.transformData(res.Data[0])]
                        this.getdepartment()
                        resolve();
                    } else {
                        this.$message.error(res.ErrorInfo);
                        reject(res.ErrorInfo);
                    }
                }).catch(error => {
                    this.$message.error('获取部门数据失败');
                    reject(error);
                });
            });
        },
        // 获取列表数据
        getList() {
            // 判断 leader 是否为 0 或 1 来决定 EvaluationStaffName 的值
            let evaluationStaffName = '';
            if (this.queryParams.leader === '0') {
                evaluationStaffName = this.userName; // leader 为 0 时赋值 userName
            } else {
                evaluationStaffName = ''; // leader 为 1 时清空
            }

            let formData = {
                State: this.queryParams.state.join(','),
                ShowOtherSys: this.queryParams.ShowOtherSys,
                ProjectID: this.queryParams.ProjectID,
                SystemID: this.queryParams.SystemID,
                SystemName: this.queryParams.SystemName,
                SaleStaffName: this.queryParams.SaleStaffName,
                EvaluationStaffName: evaluationStaffName, // 动态赋值
                ArchiveStaffName: '',
                ReviewerStaffName: '',
                LabStaffName: '',
                DepID: this.queryParams.deptId ? this.queryParams.deptId : 0,
                StartNum: (this.currentPage - 1) * this.pageSize + 1,
                EndNum: this.currentPage * this.pageSize,
                voidid: 800
            };

            this.loading = true;
            initList(formData).then(res => {
                if (res.Data) {
                    
                    this.currentTableData = res.Data;
                    if (this.currentTableData.length > 0) {
                        this.total = this.currentTableData[0].记录总数;
                    } else {
                        this.total = 0
                    }
                    this.loading = false;
            
                } else {
                    this.loading = false;
                    this.$message.error(res.ErrorInfo || '获取数据失败');
                }
            }).catch(error => {
                this.$message.error('请求出错，请稍后重试');
                this.loading = false;
            });
        },
    
        /** 搜索按钮操作 */
        handleQuery() {
            this.currentPage = 1; // 重置当前页码为1
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            // 确保重置时与初始化时的数据一致
            this.queryParams = {
                state: ['已分配归档人员', '归档材料审核中', '归档材料返回修改中', '归档材料审核通过', '档案未入库', '归档完成'],
                pageNum: 1,
                pageSize: 10,
                ProjectID: '',
                SystemID: '',
                SystemName: '',
                ShowOtherSys: 0, // 修正为1，与初始化时一致
                SaleStaffName: '',
                EvaluationStaffName: '',
                ArchiveStaffName: '',
                deptId: null,
                leader: ''
            };
            this.currentPage = 1; // 重置当前页码为1
            this.getList();
        },
        // 处理分页变化
        handlePagination({ page, limit }) {
            this.currentPage = page;
            this.pageSize = limit;
            // 更新查询参数中的每页数量
       
            this.getList();
        },
        //查看
        handleLook(row) {
            let data = {
                SystemID: row.系统编号,
                ReportDate: row.报告封面日期,
                formState: 3
            }
            this.$router.push({
                name: 'Lookrecord',
                query: {
                    data: JSON.stringify(data)
                }
            })
        },
        // 获取标签类型
        getTagType(level) {
            if (level > 5) {
                return 'danger';
            } else if (level > 4) {
                return 'warning';
            } else if (level > 2) {
                return '';
            } else if (level > 0) {
                return 'success';
            }
            return '';
        },
        // 获取状态标签类型
        getState(level) {
            switch (level) {
                case '已分配归档人员':
                    return '';
                case '归档材料审核中':
                    return 'warning';
                case '归档材料返回修改中':
                    return 'danger';
                case '归档材料审核通过':
                    return 'success';
                default:
                    return '';
            }
        },
        /** 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.deptId,
                label: node.deptName,
                children: node.children
            };
        },
        // 获取部门权限
        getdepartment() {
            let data = {
                StaffID: getToken(),
                voidid: 842,
            }
            initList(data).then(res => {
                if (res.Data) {
                    const targetIds = res.Data.filter(item => item.角色ID == 1 || item.角色ID == 2).map(item => item['部门ID']);

                    if (targetIds.includes('1')) {
                        this.originaldeptList = this.departmentList;
                        this.deptOptions = this.departmentList
                        this.treeLoading = false
                    } else {
                        const filteredData = this.filterDepartments(this.departmentList, targetIds);
                        this.originaldeptList = filteredData;
                        this.deptOptions = filteredData
                        this.treeLoading = false
                    }
                } else {
                    this.$message.error(res.ErrorInfo || '获取部门权限失败');
                }
            }).catch(error => {
                this.$message.error('获取部门权限失败');
            })
        },
        // 过滤部门数据
        filterDepartments(data, ids) {
            let result = [];
            for (let item of data) {
                if (ids.includes(String(item.deptId))) {
                    result.push(item);
                } else if (item.children && item.children.length > 0) {
                    let sub_result = this.filterDepartments(item.children, ids);
                    result = result.concat(sub_result);
                }
            }
            return result;
        },
        // 转换部门数据格式
        transformData(data, parentId = 0, ancestors = '0') {
            const newDeptId = parseInt(data["部门ID"])

            const result = {
                "createBy": "admin",
                "deptId": newDeptId,
                "parentId": parentId,
                "ancestors": ancestors,
                "deptName": data["部门名称"],
                "children": []
            };

            // 处理下级部门
            let subDepts = [];
            if (typeof data["下级部门名称"] === 'string') {
                try {
                    subDepts = JSON.parse(data["下级部门名称"].replace(/'/g, '"'));
                } catch (e) {
                    console.error('解析下级部门数据失败:', e);
                    subDepts = [];
                }
            } else if (Array.isArray(data["下级部门名称"])) {
                subDepts = data["下级部门名称"];
            }

            for (const subDept of subDepts) {
                const newAncestors = `${ancestors},${newDeptId}`;
                const subResult = this.transformData(subDept, newDeptId, newAncestors);
                result.children.push(subResult);
            }

            return result;
        },
        // 处理归档状态变更
        handleStateChange(selectedValues) {
            if (selectedValues.includes('all')) {
                // 如果选择了“全部”，清空其他选项只保留“全部”
                this.queryParams.state = ['all'];
            } else {
                // 确保不包含“全部”选项
                this.queryParams.state = selectedValues.filter(value => value !== 'all');
            }
        },
    }
};
</script>

<style scoped>
::v-deep .el-table__body-wrapper {
    overflow-x: auto;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 12px;
    /* 调整横向滚动条高度 */
}

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
</style>