<template>
    <div class="app-container">
        <h4 class="form-header h4">分配人员</h4>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-row>
                <el-col :span="8" :offset="2">
                    <el-form-item label="归属部门" prop="deptId">
                        <treeselect v-model="form.deptId" :options="enabledDeptOptions" :show-count="true"
                            :normalizer="normalizer" placeholder="请选择归属部门" />
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="2">
                    <el-form-item label="角色" prop="userName">
                        <el-select v-model="form.userName" placeholder="请选择所属角色">
                            <el-option v-for="item in roleList" :key="item.角色ID" :label="item.角色名称" :value="item.角色ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <h4 class="form-header h4">人员信息</h4>
        <!-- 搜索表单 -->

        <div class="transfer-container">

            <!-- 左侧列表 -->
            <div class="list-container">
                <el-form :inline="true" class="search-form">
                    <!-- <el-form-item label="工号">
                        <el-input v-model="searchForm.staffId" placeholder="输入工号" clearable />
                    </el-form-item> -->
                    <el-form-item label="姓名">
                        <el-input v-model="searchForm.staffName" placeholder="输入姓名" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                </el-form>
                <h5>可选人员（{{ leftTotal }}）</h5>

                <el-table ref="leftTable" v-loading="loading" :data="paginatedLeftList" border height="400"
                    @selection-change="handleLeftSelection">
                    <el-table-column type="selection" width="55" align="center" />
                    <!-- <el-table-column prop="员工ID" label="工号" align="center" /> -->
                    <el-table-column prop="员工姓名" label="员工姓名" align="center" />
                </el-table>
                <div class="pagination-wrapper">
                    <el-pagination :current-page="pagination.pageNum" :page-sizes="[5, 10, 20, 50]"
                        :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next"
                        :total="filteredLeftTotal" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="operation-buttons">
                <el-button type="primary" icon="el-icon-arrow-right" @click="addToRight"
                    :disabled="leftSelected.length === 0" />
                <el-button type="primary" icon="el-icon-arrow-left" @click="removeFromRight"
                    :disabled="rightSelected.length === 0" />
            </div>

            <!-- 右侧列表 -->
            <div class="list-container">
                <h4>待绑定人员</h4>
                <h5>已选人员（{{ rightList.length }}）</h5>
                <el-table ref="rightTable" :data="rightList" border height="400"
                    @selection-change="handleRightSelection">
                    <el-table-column type="selection" width="55" align="center" />
                    <!-- <el-table-column prop="员工ID" label="工号" align="center" /> -->
                    <el-table-column prop="员工姓名" label="员工姓名" align="center" />
                </el-table>
            </div>
        </div>
        <el-form label-width="100px">
            <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="close()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { initList } from '@/api/record.js'
import _ from 'lodash'
export default {
    name: "addRole",
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: true,
            pagination: {
                pageNum: 1,
                pageSize: 10
            },
            // 分页信息
            total: 0,
            // 选中角色编号
            roleIds: [],
            // 角色信息

            roleList: [],
            rules: {
                deptId: [
                    { required: true, message: '请选择归属部门', trigger: 'change' },

                ],
                userName: [
                    { required: true, message: '请选择所属角色', trigger: 'change' }
                ],
            },
            // 用户信息
            form: {
                deptId: '',
                userName: ''
            },
            // 搜索表单
            searchForm: {
                staffId: '',
                staffName: ''
            },
            // 左侧列表数据
            leftList: [
            ], // 初始数据
            // 右侧列表数据
            rightList: [],
            // 选中数据
            leftSelected: [],
            rightSelected: [],
            rawLeftList: [],
            // 列信息
            enabledDeptOptions: undefined,
        };
    },
    created() {
        this.form.deptId = this.$route.params && this.$route.params.userId;
        this.getuserList()
        this.getDeptTree()
        this.getRolist()
    },
    computed: {
        // 过滤后的左侧列表
        filteredLeftList() {
            if (!this.rawLeftList) {
                return [];
            }
            return this.rawLeftList.filter(item => {
                const idMatch = item.员工ID.toString().includes(this.searchForm.staffId)
                const nameMatch = item.员工姓名.includes(this.searchForm.staffName)
                return idMatch && nameMatch
            })
        },
        // 分页后的数据
        paginatedLeftList() {
            const start = (this.pagination.pageNum - 1) * this.pagination.pageSize;
            const end = start + this.pagination.pageSize;
            return this.filteredLeftList.slice(start, end);
        },
        // 总数统计
        filteredLeftTotal() {
            return this.filteredLeftList.length
        },
        leftTotal() {
            return this.filteredLeftList.length
        }
    },
    methods: {
        /** 关闭按钮 */
        close() {
            this.$router.go(-1)
        },
        //获取所有角色列表
        getRolist() {
            let data = {
                Keyword: '',
                voidid: 838
            }
            initList(data).then(res => {
                if (res.Data) {
                    this.roleList = res.Data
                }
            })
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
        //获取部门列表
        getDeptTree() {
            let formData = {
                voidid: 830,
                DepID: '1'
            }
            this.loading = true;
            initList(formData).then(res => {
                if (res.Data) {
                    this.enabledDeptOptions = [this.transformData(res.Data[0])]
                    this.loading = false;
                }
            })
        },
        transformData(data, parentId = 0, ancestors = '0') {
            const newDeptId = parseInt(data["部门ID"])
            const result = {
                "createBy": "admin",
                "createTime": "2024-06-30 11:27:07",
                "deptId": newDeptId,
                "parentId": parentId,
                "ancestors": ancestors,
                "deptName": data["部门名称"],
                "leader": "珞格",
                "phone": "15888888888",
                "children": []
            };
            // 处理下级部门
            let subDepts = [];
            if (typeof data["下级部门名称"] === 'string') {
                subDepts = JSON.parse(data["下级部门名称"].replace(/'/g, '"'));
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
        // 处理左侧选中
        handleLeftSelection(selection) {
            this.leftSelected = selection
        },
        // 处理右侧选中
        handleRightSelection(selection) {
            this.rightSelected = selection
        },
        // 添加到右侧
        addToRight() {
            const newRight = [...new Set([...this.rightList, ...this.leftSelected])]
            const leftIds = new Set(this.leftSelected.map(item => item.员工ID))
            this.rightList = newRight
            this.rawLeftList = this.rawLeftList.filter(item => !leftIds.has(item.员工ID))
            this.$refs.leftTable.clearSelection()
        },
        // 从右侧移除
        removeFromRight() {
            const removeIds = new Set(this.rightSelected.map(item => item.员工ID))
            this.rawLeftList = [...this.rawLeftList, ...this.rightSelected]
            this.rightList = this.rightList.filter(item => !removeIds.has(item.员工ID))
            this.$refs.rightTable.clearSelection()
        },
        // 搜索处理
        handleSearch() {
            this.pagination.pageNum = 1;
        },
        // 提交处理
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.rightList.length > 0) {
                        const result = this.rightList.map(item => item["员工ID"]).join(',');
                        let data = {
                            DepID: this.form.deptId,
                            RoleID: this.form.userName,
                            StaffID: result,
                            voidid: 845,
                        }
                        initList(data).then(res => {

                            if (res.Data) {
                                this.$modal.msgSuccess("设置成功");
                                this.close()
                            }else{
                                this.$modal.msgError(res.ErrorInfo);
                            }
                        }).finally(() => {
                            this.loading = false
                        })
                    } else {
                        this.$modal.msgWarning('请先选择待绑定人员！');
                    }
                }
            });
            return

            return

        },
        getuserList() {
            let data = {
                voidid: 844,
                Keyword: this.searchForm.staffName
            }
            this.loading = true;
            initList(data).then(res => {
                if (res.Data) {
                    this.rawLeftList = res.Data // 保存原始数据
                    this.pagination.pageNum = 1 // 重置页码
                }
            }).finally(() => {
                this.loading = false
            })
        },
        // 分页大小改变
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
        },
        // 页码改变
        handleCurrentChange(val) {
            this.pagination.pageNum = val
        },
        // 搜索输入处理（500ms防抖）
        handleSearchInput: _.debounce(function () {
            this.pagination.pageNum = 1
        }, 500),
    },
};
</script>
<style scoped>
/* 整体容器优化 */
.app-container {
    padding: 20px 30px;
    background: #f5f7fa;
    min-height: calc(60vh - 20px);
}

/* 标题样式美化 */
.form-header {
    color: #303133;
    font-weight: 600;
    border-left: 4px solid #409eff;
    padding-left: 12px;
    margin: 20px 0;
}

/* 转移容器布局优化 */
.transfer-container {
    display: flex;
    gap: 30px;
    margin: 20px 0;
    align-items: stretch;
}

/* 列表容器增强 */
.list-container {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    padding: 15px;
    transition: all 0.3s ease;
}

.list-container:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, .12);
}

/* 操作按钮美化 */
.operation-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    margin: 0 10px;
}

.operation-buttons .el-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 0;
    font-size: 16px;
    transition: all 0.3s ease;
}

.operation-buttons .el-button:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 6px rgba(64, 158, 255, .3);
}

/* 搜索表单优化 */
.search-form {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-form .el-form-item {
    margin-bottom: 0;
}

/* 表格样式增强 */
.el-table {
    border-radius: 6px;
    overflow: hidden;
}

.el-table::before {
    height: 0;
}

.el-table /deep/ th {
    background: #f8f9fa;
    color: #606266;
    font-weight: 600;
}

.el-table /deep/ tr:hover td {
    background-color: #f5f7fa !important;
}

/* 分页样式调整 */
.pagination-container {
    margin-top: 15px;
}

/* 提交按钮区域优化 */
.el-form-item--submit {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
}

/* 统计标题样式 */
h5 {
    color: #606266;
    margin: 0 0 15px 0;
    font-size: 14px;
    font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 1200px) {
    .transfer-container {
        flex-direction: column;
    }

    .operation-buttons {
        flex-direction: row;
        justify-content: center;
        margin: 15px 0;
    }

    .operation-buttons .el-button {
        margin: 0 10px;
    }
}
</style>