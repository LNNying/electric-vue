<template>
  <div>
    <el-table
      :data="dataList"
      height="250px"
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
  import { mapState } from 'vuex'
  export default {
    name: "node-task-info",
    props: {
      dataList: {
        Array
      }
    },
    data() {
      return {
        dataLoading: false,
        columns: [
          {
            key: 'subTaskNum',
            title: '任务号',
            width: 120,
            align: 'center'
          },
          {
            key: 'robotCode',
            title: '车号',
            width: 80,
            align: 'center'
          },
          {
            key: 'taskStatus',
            title: '任务状态',
            width: 80,
            align: 'center'
          },
          {
            key: 'startBercode',
            title: '起始点位',
            width: 120,
            align: 'center'
          },
          {
            key: 'endBercode',
            title: '目标点位',
            width: 120,
            align: 'center'
          }
        ]
      }
    },
    computed: {
      ...mapState('task', {
        headerCellStyle: state => state.headerCellStyle
      })
    },
  }
</script>

<style scoped>

</style>
