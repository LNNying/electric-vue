<style lang="less" scoped>
  .equip-head {
    text-align: center;
    color: #ffffff;
    cursor: pointer;
  }
  .car {
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
  <div class="car">
    <Row class="equip-head">
      <i-col span="4" v-for="(item, index) in headList" :key="index">
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
  import { mapState } from 'vuex'
  import MenuContentLayoutTitle from "../../title/index";
  export default {
    name: "car-task-info",
    components: {MenuContentLayoutTitle},
    props: {
      dataList: {
        Array
      },
      dataItem: {
        String
      },
      allCarList: {
        Array
      },
      allCarNum: {
        Number
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
            key: 'online',
            label: '在线',
            value: 0
          },
          {
            key: 'leave',
            label: '离线',
            value: 0
          },
          {
            key: 'abnormal',
            label: '异常',
            value: 0
          },
          {
            key: 'exclude',
            label: '排除',
            value: 0
          },
          {
            key: 'repair',
            label: '维修',
            value: 0
          }
        ],
        columns: [
          {
            key: 'name',
            title: '设备编号',
            width: 120,
            align: 'center'
          },
          // {
          //   key: 'state',
          //   title: '状态',
          //   width: 80,
          //   align: 'center'
          // },
          {
            key: 'mainTaskNum',
            title: '设备任务',
            width: 80,
            align: 'center'
          },
          {
            key: 'status',
            title: '执行状态',
            width: 120,
            align: 'center'
          },
          {
            key: 'battery',
            title: '电量',
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
    methods: {
      clickEvent(item) {
        for (let i = 0; i < this.headList.length; i++) {
          this.$refs[this.headList[i]['key']][0].style.backgroundColor = ''
        }
        this.$refs[item['key']][0].style.backgroundColor = 'rgb(64,77,110)'
      },
      selectRow() {
        this.$nextTick(() => {
          if (this.dataList.length > 0) {
            for (let i = 0; i < this.dataList.length; i++) {
              if (this.dataList[i].name === this.dataItem) {
                this.$refs.multipleTable.clearSelection();
                this.$refs.multipleTable.toggleRowSelection(this.dataList[i])
                return true
              }
            }
          }
        })
      }
    },
    mounted() {
      if (this.dataItem !== '') {
        this.selectRow()
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    watch: {
      dataItem(newVal, oldVal) {
        if (newVal !== '' && newVal !== oldVal) {
          this.selectRow()
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      allCarNum(newVal) {
        this.headList[0]['value'] = newVal
      }
    }
  }
</script>

