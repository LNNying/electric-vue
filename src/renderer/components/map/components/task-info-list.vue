<style scoped lang="less">
  .task-head {
    text-align: center;
    color: #ffffff;
    cursor: pointer;
  }
  .task {
    position: relative;
    width: 100%;
    height: 40px;
    background-color: rgba(64,77,110,.9);
    margin-bottom: 10px;
    &::after {
      position: absolute;
      top: 40px;
      left: 25px;
      content: '';
      width: 250px;
      box-shadow: 0 0 8px 3px rgba(64,77,110,.9);
    }
  }
</style>
<template>
  <div>
    <div class="task">
      <Row class="task-head">
        <i-col span="6" v-for="(item, index) in headList" :key="index">
          <div :ref="item.key" style="border-radius: 5px 5px;" @click="clickEvent(item)">
            <div>{{item.label}}</div>
            <div>{{item.value}}</div>
          </div>
        </i-col>
      </Row>
    </div>
    <el-table
      :data="dataList"
      height="calc(50vh - 200px)"
      border
      style="width: 100%"
      size="mini"
      highlight-current-row
      :header-cell-style="headerCellStyle"
      oncontextmenu="return false;"
      ref="multipleTable"
      sortable="custom"
      empty-text="暂无数据"
      v-loading="dataLoading">
      <el-table-column
        type="selection"
        width="36">
      </el-table-column>
      <el-table-column
        v-for="(item, key) in columns" :key="key"
        :prop="item.key"
        :label="item.title"
        :width="item.width"
        :align="item.align"
        :formatter="item.formatter"
        :sortable="item.sortable!==undefined?'custom': false"
        :show-overflow-tooltip="true"
        :fixed="item.key=='userName'"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "task-info-list",
    props: {
      dataList: {
        Array
      },
      carNo: {
        String
      }
    },
    data() {
      return {
        dataLoading: false,
        headList: [
          {
            key: 'all',
            label: '全部',
            value: 0
          },
          {
            key: 'execution',
            label: '执行中',
            value: 0
          },
          {
            key: 'implemented',
            label: '待执行',
            value: 0
          },
          {
            key: 'reissued',
            label: '待重发',
            value: 0
          }
        ],
        columns: [
          {
            key: 'carrierCode',
            title: '托盘号',
            width: 120,
            align: 'center'
          },
          {
            key: 'name',
            title: '设备编号',
            width: 120,
            align: 'center'
          },
          {
            key: 'mainTaskType',
            title: '任务类型',
            width: 120,
            align: 'center'
          },
          {
            key: 'taskStatus',
            title: '任务状态',
            width: 120,
            align: 'center'
          },
        ]
      }
    },
    computed: {
      ...mapState('task', {
        headerCellStyle: state => state.headerCellStyle
      })
    },
    methods: {
      clickEvent(item) {
        for (let i = 0; i < this.headList.length; i++) {
          this.$refs[this.headList[i]['key']][0].style.backgroundColor = ''
        }
        this.$refs[item['key']][0].style.backgroundColor = 'rgb(64,77,110)'
      },
      // 处理数量
      handleNum(newVal) {
        if (newVal.length > 0) {
          this.headList[0].value = newVal.length
          // 执行中
          let taskingNum = newVal.forEach(item => {
            return item.taskStatus == 1
          })
          // 待执行
          let noTaskNum = newVal.forEach(item => {
            return item.taskStatus == 0
          })
          // 待重发(取消)
          let cancelTaskNum = newVal.forEach(item => {
            return item.taskStatus == 10
          })
          this.headList[1].value = taskingNum.length
          this.headList[2].value = noTaskNum.length
          this.headList[3].value = cancelTaskNum.length
        }
      }
    },
    mounted() {
      this.handleNum(this.dataList)
    },
    watch: {
      carNo(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.handleNum(this.dataList)
        }
      }
    }
  }
</script>
