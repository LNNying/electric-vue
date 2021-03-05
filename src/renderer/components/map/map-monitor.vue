<style lang="less">
    .lnn-select {
        width: 150px;
        outline: none;
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 2px 2px;
        /*border: 1px solid #ffffff;*/
        color: #ffffff;
        background-color: rgba(64, 77, 110, .9);
        border: none;
        option {
            margin-top: 2px;
            padding: 5px 5px;
        }
    }

    .map-head-monitor .ivu-btn-primary {
        background: rgba(64, 77, 110, .9);
        border: 1px solid #ffffff;
    }

    .lnn-input .ivu-input {
        background: rgb(64, 77, 110);
        color: #fff;
    }

    .lnn-select-copy .ivu-select-selection {
        background: rgb(64, 77, 110);
        color: #fff;
    }

    .lnn-menu {
        position: absolute;
        z-index: 250;
        width: 150px;
        background: #fff;
        -webkit-border-radius: 5px 5px;
        -moz-border-radius: 5px 5px;
        border-radius: 5px 5px;
        li {
            list-style-type: none;
            padding: 5px;
        }
    }
</style>
<template>
    <div id="monitor-body">
        <map-collospe-menu :menu-width="300">
            <div slot="operation">
                <div class="lnn-left-menu">
                    <div class="lnn-left-menu-map">
                        <img src="../../assets/icon-title.png" style="width: 35px;height: 35px;float: left;"/>
                        <div style="float: left;margin-top: 5px">
                            <Select v-model="mapCode" size="small" class="lnn-select-copy"
                                    style="margin-left: 15px; width: 100px;" @on-change="changeMap">
                                <Option v-for="(item, index) in mapCodeList" :key="index" :value="item.mapCode">
                                    {{item.mapName}}
                                </Option>
                            </Select>
                            <Select size="small" v-model="floorNum" class="lnn-select-copy"
                                    style="margin-left: 15px; width: 100px">
                                <Option v-for="(item, index) in floorList" :key="index" :value="item.z">{{item.z +
                                    "楼"}}
                                </Option>
                            </Select>
                        </div>
                    </div>
                    <div style="padding: 5px 10px;">
                        <Select class="lnn-select-copy" style="width: 120px;" v-model="operType" size="small">
                            <Option v-for="(item, index) in operTypeList" :key="index" :value="item.dictValue">
                                {{item.dictName}}
                            </Option>
                        </Select>
                        <!--<Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom" style="margin-left: 130px">-->
                        <!--<Icon @click.native="handleChange" :type="value ? 'md-contract' : 'md-expand'"-->
                        <!--style="cursor: pointer;color: #ffffff;" :size="16"></Icon>-->
                        <!--</Tooltip>-->
                        <!--<Icon type="md-contract" v-if="showEnlarge" style="color: #fff; position: absolute;margin-top: 6px;right: 25px;cursor: pointer"/>-->
                        <!--<Icon type="md-expand" v-if="!showEnlarge" style="color: #ffffff; position: absolute;margin-top: 6px;right: 25px;cursor: pointer"/>-->
                        <!--<span class="floor-num-monitor">当前楼层： <Badge :count="floorNum" class-name="demo-badge-alone"></Badge></span>-->
                    </div>
                </div>
                <!--设备列表-->
                <car-task-info v-if="operType === 'equipList'" :data-list="carDataList" :all-car-list="allCarList"
                               :all-car-num="allCarNum"
                               :data-item="carNo"></car-task-info>

                <task-info-list v-else :data-list="taskDataList" :car-no="carNo"></task-info-list>
            </div>
            <div slot="content" class="right-map-content">
                <div class="map-head-monitor">
                    <div style="float: left;">
                        <!--<Button size="small" type="primary" v-if="floorList.length > 1" v-for="(item, index) in floorList"-->
                        <!--:style="{marginLeft: index === 0 ? 0 : `2px`}" :key="index"-->
                        <!--@click="clickFloor(index + 1)">{{index + 1}}层-->
                        <!--</Button>-->
                        <Button class="button-space" size="small" type="primary" :disabled="interval > 20"
                                @click="scale('1')"
                                icon="ios-add-circle">放大
                        </Button>
                        <Button class="button-space" size="small" type="primary" :disabled="interval <= 10"
                                @click="scale('0')"
                                icon="md-remove-circle">缩小
                        </Button>
                        <Button class="button-space" size="small" type="primary" @click="" >旋转</Button>
                        <Select class="lnn-select-copy button-space" size="small" style="width: 70px;"
                                v-model="selectType"
                                @on-change="changeQuery">
                            <Option v-for="(item, index) in selectTypeList" :key="index" :value="item.dictValue">
                                {{item.dictName}}
                            </Option>
                        </Select>
                        <Input class="lnn-input button-space" suffix="ios-search" size="small" v-model="queryInfo"
                               :placeholder="placeholder" style="width: 150px;" @on-enter="onEnter"></Input>
                    </div>
                    <div style="float: left;position: relative" v-clickoutside="onHide">
                        <Button size="small" type="primary" class="button-space" @click="showMenu = !showMenu">
                            <Icon type="md-reorder" size="24" style="color: #ffffff;margin-top: -2px"/>
                        </Button>
                        <div class="lnn-menu" v-show="showMenu">
                            <div style="border-bottom: 1px solid #b6b6b6; padding: 0 5px">
                                <Checkbox size="small" v-model="showMapLockNode">显示地图锁格</Checkbox>
                            </div>
                            <div style="border-bottom: 1px solid #b6b6b6; padding: 0 5px">
                                <Checkbox size="small" v-model="showLockNode">显示有锁点位</Checkbox>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="map-content">
                    <map-canvas-monitor ref="mapCanvas" :interval="interval" :is-save.sync="isSave" :map-code="mapCode"
                                        :floor-num="floorNum"
                                        @on-change="onChange" @on-click-car="onClickCar" @on-websocket="onWebSocket"
                                        :show-lock-node="showLockNode"
                                        :select-type="selectType"
                                        :show-map-node="showMapLockNode"
                                        :query-info="queryInfo"></map-canvas-monitor>
                </div>
            </div>
        </map-collospe-menu>
        <!--carShow-->
        <Modal class="lnn-modal"
               :value="carShow"
               :footer-hide="true"
               :mask-closable="false"
               :mask="false"
               :draggable="true"
               @on-cancel="onCancel"
               :styles="{top: '200px',left: '300px'}"
        >
            <div slot="header" style="color:#ffffff;height: 110px;">
                <div style="width: 100px;height: 20px;display: flex;align-items: center">
                    <div class="online" :style="{background: '#00B83F'}"></div>
                    <div style="font-size: 12px;padding: 5px 5px">{{carInfo.state === 'OFF_LINE' ? '离线' : '在线'}}</div>
                </div>
                <div class="lnn-modal-head-1" style="clear: both">
                    <div class="car-ber">
                        <div class="car-ber-info" style="font-size: 20px; font-weight: 600">{{carInfo.name}}</div>
                        <div class="car-ber-info" style="font-size: 10px;">移动设备</div>
                    </div>
                </div>
                <div class="lnn-modal-head-2" :style="{backgroundImage: 'url('+ carInfo.bertImg +')'}">
                    <div class="car-ber">
                        <div class="car-ber-info" style="font-size: 22px; font-weight: 600">{{carInfo.battery}}%</div>
                        <div class="car-ber-info" style="font-size: 10px">电量情况</div>
                    </div>
                </div>
            </div>
            <div class="lnn-modal-body">
                <table class="table-rgv" style="font-size: 14px; color: #525252">
                    <tbody>
                    <tr>
                        <td width="100" class="info-head">设备IP</td>
                        <td width="150" class="info">{{carInfo.ip}}</td>
                        <td width="100" class="info-head">执行状态</td>
                        <td width="150" class="info">{{handleCarStatus(carInfo.state)}}</td>
                    </tr>
                    <tr>
                        <td width="100" class="info-head">设备名称</td>
                        <td width="150" class="info">{{carInfo.name}}</td>
                        <td width="100" class="info-head">托盘编号</td>
                        <td width="150" class="info">{{carInfo.carrierCode}}</td>
                    </tr>
                    <tr>
                        <td width="100" class="info-head">起始位置</td>
                        <td width="150" class="info">{{carInfo.srcNode}}</td>
                        <td width="100" class="info-head">目标位置</td>
                        <td width="150" class="info">{{carInfo.targetNode}}</td>
                    </tr>
                    <tr>
                        <td width="100" class="info-head">点位状态</td>
                        <td width="150" class="info">{{carInfo.indLock == 1 ? '有锁' : '无锁'}}</td>
                        <td width="100" class="info-head">锁定源</td>
                        <td width="150" class="info">{{carInfo.lockSrc}}</td>
                    </tr>
                    <tr>
                        <td width="100" class="info-head">点位条码</td>
                        <td width="150" class="info">{{carInfo.barCode}}</td>
                        <td width="100" class="info-head">是否有货</td>
                        <td width="150" class="info">{{carInfo.emptyFlag == 1 ? '无货' : '有货'}}</td>
                    </tr>
                    <tr>
                        <td width="100" class="info-head">是否可用</td>
                        <td width="150" class="info">{{carInfo.isBlock == 1 ? '禁用' : '可用'}}</td>
                        <td width="100" class="info-head">任务编号</td>
                        <td>
                            <div style="width: 120px; float: left;" class="info">{{carInfo.mainTaskNum}}</div>
                            <div style="float: left;margin-top: 1px;cursor: pointer" @click="copy(carInfo.mainTaskNum)">
                                <Icon type="ios-copy" size="small"/>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 15px;width: 100%;">
                <div style="display: flex;justify-content: center">
                    <button class="btn-back" @click="clickFooterBtn('1')">托盘举升</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('2')">托盘下降</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('3')">故障恢复</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('4')">同步设备位置</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('5')">手动校准</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('6')">换向巷道</button>
                </div>
                <div class="margin-top-5" style="display: flex;justify-content: center">
                    <button class="btn-back" @click="clickFooterBtn('7')">换向坡道</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('8')">打开充电桩</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('9')">关闭充电桩</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('10')">紧急停止</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('11')">打开蜂鸣器</button>
                    <button class="margin-left10 btn-back" @click="clickFooterBtn('12')">关闭蜂鸣器</button>
                </div>
            </div>
        </Modal>
        <Modal class="lnn-modal"
               :value="infoShow"
               :footer-hide="true"
               :mask-closable="false"
               :mask="false"
               :draggable="true"
               @on-cancel="onCancelCar"
               :styles="{top: '200px',left: '300px'}"
        >
            <div slot="header" style="color:#ffffff;height: 80px;">
                <div class="lnn-modal-node-head">
                    <div class="lnn-modal-node-head-info">
                        <div style="font-weight: 600;font-size: 24px;margin-top: 15px;height: 20px">
                            {{currentNodeInfo.nodeCode}}
                            <div style="float: right;margin-top: -1px;cursor: pointer;margin-right: 65px"
                                 @click="copy(currentNodeInfo.nodeCode)">
                                <Icon type="ios-copy" :size="16"/>
                            </div>
                        </div>
                        <div style="font-size: 10px; font-weight: 600;margin-top: 10px;height: 20px">坐标:
                            {{currentNodeInfo.coordinates}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="lnn-modal-body">
                <node-task-info :data-list="nodeTaskInfo"></node-task-info>
            </div>
        </Modal>
    </div>
</template>

<script>
    import MapCollospeMenu from "./components/map-collospe-menu";
    import _ from 'lodash'
    import img100 from '../../assets/100.png'
    import img0 from '../../assets/img0.png'
    import img10 from '../../assets/img10.png'
    import img30 from '../../assets/img30.png'
    import img50 from '../../assets/img50.png'
    import img75 from '../../assets/img75.png'
    import MenuContentLayoutTitle from "../title/index";
    import MapCanvasMonitor from "./components/map-canvas-monitor";
    import CarTaskInfo from "./components/car-task-info";
    import NodeTaskInfo from "./components/node-task-info";
    import TaskInfoList from "./components/task-info-list";

    /**
     * 注意  纵轴为数据中X轴   横轴为数据中Y轴
     */
    export default {
        name: "map-monitor",
        components: {
            TaskInfoList,
            NodeTaskInfo,
            CarTaskInfo,
            MapCanvasMonitor,
            MenuContentLayoutTitle,
            MapCollospeMenu
        },
        data() {
            return {
                operType: 'equipList',
                operTypeList: [],
                mapCodeList: [],
                mapCode: 'RRS',
                floorList: [],
                baseUrl: {
                    getAllMapList: this.$address + '/api/map/getAllMapList', // 获取rgv地图数据
                    getNodeLayerCode: this.$address + '/api/node/getNodeLayerCode', // 获取rgv地图层级
                    getAllUseRgv: this.$address + '/api/rgv/getAllUseRgv', // 获取地图小车
                    getCarInfo: this.$address + '/api/node/getCarInfo', // 获取点击小车弹出框的信息
                    getTaskDataByNodeCode: this.$address + '/api/ts_sub_task/getTaskDataByNodeCode', // 根据点位编号获取任务
                    palletUp: this.$address + '/api/rgv/palletUp', // 1托盘举升
                    palletDown: this.$address + '/api/rgv/palletDown', // 2托盘下降
                    resetVehicle: this.$address + '/api/rgv/resetVehicle', // 3故障恢复
                    resetPosToVehicle: this.$address + '/api/rgv/resetPosToVehicle', // 4同步设备位置
                    manualCalibration: this.$address + '/api/rgv/manualCalibration', // 5手动校准
                    changeRoadway: this.$address + '/api/rgv/changeRoadway', // 6换向巷道
                    changeRamp: this.$address + '/api/rgv/changeRamp', // 7换向坡道
                    openCharge: this.$address + '/api/rgv/openCharge', // 8打开充电桩
                    closeCharge: this.$address + '/api/rgv/closeCharge', // 9关闭充电桩
                    emergencyStop: this.$address + '/api/rgv/emergencyStop', // 10紧急停止
                    openAlarm: this.$address + '/api/rgv/openAlarm', // 11打开蜂鸣器
                    closeAlarm: this.$address + '/api/rgv/closeAlarm' // 12关闭蜂鸣器
                },
                showMenu: false,
                showMapLockNode: false,
                showLockNode: false,
                value: false,
                nodeTaskInfo: [], // 当前点位任务信息
                carDataList: [], // 所有小车信息
                taskDataList: [], // 任务列表
                selectType: 'equip', // 查询类型
                selectTypeList: [], // 查询类型列表
                carNo: '',
                placeholder: '请输入设备编号',
                queryInfo: '', // 查询内容
                saveLoading: false,
                interval: 8,
                isSave: false,
                webInfo: [],
                floorNum: 1,
                allCarList: [],
                allCarNum: 0,
                currentNodeInfo: {},
                chooseType: 'box',
                carShow: false,
                infoShow: false,
                carInfo: {
                    name: '', // 小车编号
                    state: '', // 小车执行状态
                    battery: 0, // 电量
                    ip: '', // 小车ip
                    carrierCode: '', // 托盘
                    srcNode: '', // 起始位置
                    targetNode: '', // 目标位置
                    barCode: '', // 点位节点
                    indLock: '', // 是否被锁定
                    lockSrc: '', // 锁定源
                    emptyFlag: '', // 是否有货
                    mainTaskNum: '', // 任务号
                    bertImg: img100, // 电量图片
                    isBlock: '' // 是否可用
                }
            }
        },
        methods: {
            handleCarStatus(type) {
                return this.$util.handleCarState(type)
            },
            // 放大缩小
            scale(val) {
                if (val === '1') { // 放大
                    if (this.interval <= 20) {
                        this.interval += 5
                    }
                } else { // 缩小
                    if (this.interval <= 10) {
                        this.interval = 10
                        return
                    }
                    this.interval -= 5
                }
            },
            initCarInfo() {
                this.carInfo = {
                    name: '', // 小车编号
                    state: '', // 小车执行状态
                    battery: 0, // 电量
                    ip: '', // 小车ip
                    carrierCode: '', // 托盘
                    srcNode: '', // 起始位置
                    targetNode: '', // 目标位置
                    barCode: '', // 点位节点
                    indLock: '', // 是否被锁定
                    lockSrc: '', // 锁定源
                    emptyFlag: '', // 是否有货
                    mainTaskNum: '', // 任务号
                    bertImg: img100, // 电量图片
                    isBlock: '', // 是否可用
                    x: '',
                    y: '',
                    z: '',
                }
            },
            // 功能
            clickFooterBtn(val) {
                if (this.$isEmpty(this.carNo)) {
                    this.$warn('选择要操作的小车', 3)
                    return
                }
                switch (val) {
                    case '1': // 托盘举升
                        this.handleOperation(this.baseUrl.palletUp, this.carNo)
                        break;
                    case '2': // 托盘下降
                        this.handleOperation(this.baseUrl.palletDown, this.carNo)
                        break;
                    case '3': // 故障恢复
                        this.handleOperation(this.baseUrl.resetVehicle, this.carNo)
                        break;
                    case '4': // 同步设备位置
                        let body = {
                            rgvId: this.carNo,
                            x: this.carInfo.x,
                            y: this.carInfo.y,
                            z: this.carInfo.z
                        }
                        this.handleOperation(this.baseUrl.resetPosToVehicle, body)
                        break;
                    case '5': // 手动校准
                        this.handleOperation(this.baseUrl.manualCalibration, this.carNo)
                        break;
                    case '6': // 换向巷道
                        this.handleOperation(this.baseUrl.changeRoadway, this.carNo)
                        break;
                    case '7': // 换向坡道
                        this.handleOperation(this.baseUrl.changeRamp, this.carNo)
                        break;
                    case '8': // 打开充电桩
                        this.handleOperation(this.baseUrl.openCharge, this.carNo)
                        break;
                    case '9': // 关闭充电桩
                        this.handleOperation(this.baseUrl.closeCharge, this.carNo)
                        break;
                    case '10': // 紧急停止
                        this.handleOperation(this.baseUrl.emergencyStop, this.carNo)
                        break;
                    case '11': // 打开蜂鸣器
                        this.handleOperation(this.baseUrl.openAlarm, this.carNo)
                        break;
                    case '12': // 关闭蜂鸣器
                    this.handleOperation(this.baseUrl.closeAlarm, this.carNo)
                        break;
                    default:
                        console.log('错误方法参数');
                        break;
                }
            },
            handleOperation(url, data) {
                let errMsg = '操作失败'
                let successMsg = '操作成功'
                this.$http.post(url, data).then(response => {
                    if (response.data.returnData) {
                        this.$util.success(successMsg, 3)
                    } else {
                        this.$error(errMsg, 3)
                    }
                }).catch(err => {
                    this.$loginOut()
                })
            },
            changeQuery() {
                switch (this.selectType) {
                    case 'equip':
                        this.placeholder = '请输入设备编号'
                        break;
                    case 'local':
                        this.placeholder = '请输入坐标 X,Y '
                        break;
                    case 'taskNo':
                        this.placeholder = '请输入任务号'
                        break;
                    default:
                        this.placeholder = '请输入设备编号'
                        break;
                }
            },
            copy(data) {
                let oInput = document.createElement('input') // 创建一个隐藏input（重要！）
                oInput.value = data // 赋值
                document.body.appendChild(oInput)
                oInput.select() // 选择对象
                document.execCommand('Copy') // 执行浏览器复制命令
                oInput.className = 'oInput'
                oInput.style.display = 'none'
                this.$success('复制成功')
            },
            // clickFloor(floorNum) {
            //   this.floorNum = floorNum
            //   this.isSave = false
            //   this.carShow = false
            //   this.infoShow = false
            //      this.initCarInfo()
            //   this.currentNodeInfo = {}
            // },
            // 改变地图
            changeMap(mapCode) {
                this.isSave = false
                this.carShow = false
                this.infoShow = false
                this.currentNodeInfo = {}
                this.initCarInfo()
                this.getNodeLayerCode(mapCode)
                this.getAllUseRgv()
            },
            // 接收webSocket信息
            onWebSocket(webInfo) {
                console.log(webInfo);
                this.webInfo = webInfo
                // 处理设备信息
                this.carDataList = _.cloneDeep(webInfo)
                // 处理任务列表
                this.taskDataList = []
                webInfo.forEach(item => {
                    if (item.mainTaskNum) {
                        this.taskDataList.push(item)
                    }
                })
            },
            // 查询
            onEnter() {
                this.$refs['mapCanvas'].queryData()
            },
            // 点击小车
            onClickCar(data) {
                this.initCarInfo()
                this.getCarInfo(data)
                this.carNo = data.name
                this.carShow = true
                this.infoShow = false
            },
            // 整合小车数据
            getCarInfo(data) {
                let body = {
                    locationNodeCode: data['locationNodeCode'],
                    name: data['name']
                }
                this.$http.post(this.baseUrl.getCarInfo, body).then(response => {
                    if (response.data.returnCode === 200) {
                        let dataList = response.data.returnData
                        if (data.battery == 0) {
                            this.carInfo.bertImg = img0
                        } else if (data.battery == 100) {
                            this.carInfo.bertImg = img100
                        } else {
                            if (0 < data.battery && data.battery <= dataList.noBart) { // 快没电
                                this.carInfo.bertImg = img10
                            } else if (dataList.noBart < data.battery && data.battery <= dataList.goodBart) {
                                this.carInfo.bertImg = img30
                            } else if (dataList.goodBart < data.battery && data.battery <= dataList.fullBart) {
                                this.carInfo.bertImg = img50
                            } else if (dataList.fullBart < data.battery && data.battery <= dataList.suffBart) {
                                this.carInfo.bertImg = img75
                            } else {
                                this.carInfo.bertImg = img100
                            }
                        }
                        this.carInfo.barCode = dataList.barCode
                        this.carInfo.emptyFlag = dataList.emptyFlag
                        this.carInfo.indLock = dataList.indLock
                        this.carInfo.lockSrc = dataList.lockSrc
                        this.carInfo.isBlock = dataList.isBlock
                        this.carInfo.name = data.name
                        this.carInfo.battery = data.battery
                        this.carInfo.mainTaskNum = data.mainTaskNum
                        this.carInfo.ip = data.ip
                        this.carInfo.carrierCode = data.carrierCode
                        this.carInfo.srcNode = data.srcNode
                        this.carInfo.targetNode = data.targetNode
                        this.carInfo.state = data.state
                        this.carInfo.z = data.z
                        this.carInfo.x = data.x
                        this.carInfo.y = data.y
                    } else {
                        this.$warn(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$loginOut()
                })
            },
            getNodeTask(node) {
                let nodeCode = node.nodeCode
                this.$http.post(this.baseUrl.getTaskDataByNodeCode, nodeCode).then(response => {
                    if (response.data.returnCode === 200) {
                        this.nodeTaskInfo = response.data.returnData
                        if (!this.carShow) {
                            this.infoShow = true
                        }
                    } else {
                        this.$error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$loginOut()
                })
            },
            // 接收点击数据
            onChange(val, data, nodeList) {
                this.carNo = ''
                this.currentNodeInfo = {}
                if (val === 'click') { // 点击
                    if (nodeList.length > 0) {
                        for (let i = 0; i < nodeList.length; i++) {
                            if (!(data['x'] === (nodeList[i]['x'] + 0.5) && data['y'] === (nodeList[i]['y'] + 0.5))) {
                                let x = Math.floor(data['x'])
                                let y = Math.floor(data['y'])
                                if (nodeList[i]['x'] === x && nodeList[i]['y'] === y) { // && this.judgeNodeType(nodeList[i]['nodeType'])
                                    this.currentNodeInfo = nodeList[i]
                                    this.currentNodeInfo.coordinates = '(' + this.currentNodeInfo.x + ', ' + this.currentNodeInfo.y + ', ' + this.currentNodeInfo.z + ')'
                                    // 查询数据
                                    this.getNodeTask(nodeList[i])
                                    return true
                                } else {
                                    this.infoShow = false
                                }
                            }
                        }
                    }
                } else if (val === 'leftUp') {
                    this.infoShow = false
                    this.carShow = false
                }
            },
            // 判断是否是可以显示数据
            judgeNodeType(data) {
                if (data === 'R' || data === 'B') {
                    return false
                } else {
                    return true
                }
            },
            onCancel() {
                this.carShow = false
            },
            onCancelCar() {
                this.nodeTaskInfo = []
                this.infoShow = false
            },
            getAllMapData() {
                this.$http.post(this.baseUrl.getAllMapList).then(response => {
                    if (response.data.returnCode === 200) {
                        this.mapCodeList = response.data.returnData
                        this.getNodeLayerCode(this.mapCode)
                        this.getAllUseRgv()
                    } else {
                        this.$error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$loginOut()
                })
            },
            getNodeLayerCode(mapCode) {
                let body = {
                    mapCode: mapCode
                }
                this.floorList = []
                this.$http.post(this.baseUrl.getNodeLayerCode, body).then(response => {
                    if (response.data.returnCode === 200) {
                        this.floorList = response.data.returnData
                    } else {
                        this.$error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$loginOut()
                })
            },
            getOperTypeList() {
                this.$http.get(this.$address + '/api/dictionary/SELECT_MENU/list').then(response => {
                    if (response.data.returnCode === 200) {
                        this.operTypeList = response.data.returnData
                    } else {
                        this.$error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$loginOut()
                })
            },
            getSelectType() {
                this.$http.get(this.$address + '/api/dictionary/QUERY_TYPE/list').then(response => {
                    if (response.data.returnCode === 200) {
                        this.selectTypeList = response.data.returnData
                    } else {
                        this.$error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$loginOut()
                })
            },
            // 获取地图小车
            getAllUseRgv() {
                let body = {
                    mapCode: this.mapCode
                }
                this.$http.post(this.baseUrl.getAllUseRgv, body).then(response => {
                    if (response.data.returnCode === 200) {
                        this.allCarNum = response.data.returnData.length
                        this.allCarList = response.data.returnData
                    } else {
                        this.$error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$.loginOut()
                })
            },
            onHide() {
                this.showMenu = false
            },
            // 全屏
            handleChange() {
                let main = document.getElementById('monitor-body')
                if (this.value) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen()
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen()
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen()
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen()
                    }
                } else {
                    if (main.requestFullscreen) {
                        main.requestFullscreen()
                    } else if (main.mozRequestFullScreen) {
                        main.mozRequestFullScreen()
                    } else if (main.webkitRequestFullScreen) {
                        main.webkitRequestFullScreen()
                    } else if (main.msRequestFullscreen) {
                        main.msRequestFullscreen()
                    }
                }
                this.value = !this.value
            }
        },
        mounted() {
            this.getOperTypeList()
            this.getSelectType()
            this.getAllMapData()
        },
        watch: {
            floorNum(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.isSave = false
                    this.carShow = false
                    this.infoShow = false
                    this.initCarInfo()
                    this.currentNodeInfo = {}
                }
            }
        }
    }
</script>

<style>
    .button-space{
        margin-left: 2px;
    }
    .lnn-left-menu {
        background: rgba(64, 77, 110, .9);
        width: 100%;
        height: 90px;
    }

    .lnn-left-menu-map {
        width: 100%;
        height: 50px;
        padding: 5px 10px;
        border-bottom: 2px solid rgb(64, 77, 110);
    }

    .margin-left10 {
        margin-left: 10px;
    }

    .car-ber {
        width: 100px;
        height: 100%;
        margin-left: 90px;
    }

    .car-ber-info {
        margin-top: 5px;
        height: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .online {
        float: left;
        width: 10px;
        height: 10px;
        border-radius: 50% 50%
    }

    .btn-back {
        background: rgba(78, 90, 117, .8);
        color: #fefefe;
        padding: 2px 7px;
        width: auto;
        cursor: pointer;
        outline: none;
        border-radius: 2px 2px;
        border: 1px solid rgba(50, 60, 89, 0.6);;
    }

    .btn-back:hover {
        background: rgba(50, 60, 89, 0.6);
    }

    .map-content {
        position: relative;
        height: calc(100vh - 50px);
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        margin-top: 5px;
        padding-bottom: 5px
    }

    .map-head-monitor {
        width: 100%;
        background: rgba(64, 77, 110, .9);
        height: 40px;
        line-height: 40px;
        padding: 0px 5px;
        border-left: 2px solid #e0e0e0;
        box-shadow: 1px 1px 3px #8b8b8b;
    }

    .floor-num-monitor {
        position: relative;
        margin-left: 25px;
        color: #ffffff;
        top: 1px;
        font-size: 14px;
    }

    .lnn-modal .ivu-modal-no-mask {
        overflow: hidden;
    }

    .lnn-modal .ivu-modal-header {
        background: rgb(50, 60, 89);
        display: flex;
        justify-content: center;
        /*background-image: url(../../assets/images/monitor/title.png);*/
        /*background-position: 100px -16px;*/
    }

    .lnn-modal-head-1 {
        height: 100%;
        width: 200px;
        float: left;
        background-image: url(../../assets/car.png);
        background-repeat: no-repeat;
    }

    .lnn-modal-head-2 {
        height: 100%;
        width: 200px;
        float: left;
        /*background-image: url(../../assets/images/monitor/100.png);*/
        background-repeat: no-repeat;
        /*background-size: 100% 100%;*/
        /*background-position: 40px -76px;*/
    }

    .lnn-modal-node-head {
        height: 100%;
        width: 400px;
        background-position: 60px -30px;
        background-image: url("../../assets/title.png");
        background-repeat: no-repeat;
    }

    .lnn-modal-node-head-info {
        height: 100%;
        width: 200px;
        margin-left: 170px
    }

    .lnn-modal-body {
        width: 100%;
        height: auto;
        clear: both;
        background: rgb(223, 225, 230);;
    }

    .info-head {
        font-size: 14px;
        padding: 5px 5px;
    }

    .info {
        font-size: 12px;
        font-weight: 600;
        padding: 5px 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .table-rgv {
        border-spacing: 0;
        border-top: 2px solid #999;
        border-left: 2px solid #999;
    }

    .table-rgv td {
        border-bottom: 2px solid #999;
        border-right: 2px solid #999;
    }

    .table-rgv tr:nth-child(2n - 1) {
        background: rgb(223, 225, 230);;
    }

    .table-rgv tr:nth-child(2n) {
        background: #ffffff;
    }
</style>
<style>
    /*.demo-badge-alone {*/
    /*background: rgba(64, 77, 110, .9) !important;*/
    /*}*/
</style>
