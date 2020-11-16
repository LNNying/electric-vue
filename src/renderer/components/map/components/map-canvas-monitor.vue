<style lang="less">
    .map-viewer {
        position: relative;
        overflow-x: scroll;
        overflow-y: hidden;
        width: 100%;
        background: rgb(219, 226, 232);
    }

    .shelter {
        position: absolute;
        z-index: 200;
    }

    .current-robot {
        position: absolute;
        z-index: 1;
        background: radial-gradient(rgba(243, 113, 16, 0.7) 0%, rgba(0, 0, 0, 0) 70%);
        border-radius: 50% 50%;
        margin-left: -100px;
        margin-top: -100px;
    }

    .robot {
        position: absolute;
        border: solid 1px rgba(54, 27, 0, 0.5);
        z-index: 210;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        /*border-radius: 2px 2px;   !* 与width    10 / 2*!*/
        /*box-shadow: -1px -1px 10px 4px #d80304;*/
    }

    .robot-transform {
        transition: top 2.5s linear, left 2.5s linear;
    }

    .dot {
        position: absolute;
        /*width: 5px;      !*父级与子集  10 / 5*!*/
        /*height: 5px;*/
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        background: rgba(255, 21, 12, 0.5);
        z-index: 120;
        border: 1px solid rgba(249, 251, 255, 0.8);
    }

    #canvasLock {
        z-index: 120;
    }

    #router {
        z-index: 124;
    }

    #empty {
        z-index: 122;
    }

    .lnn-tips {
        width: 100%;
        height: auto;
        position: fixed;
        z-index: 128;
        /*border-bottom: 1px solid #a6c4ee;*/
        font-weight: 600;
        font-size: 14px;
        color: #000;
        div {
            float: left;
            min-width: 50px;
            padding: 2px 5px;
            border-right: 1px dotted #979bff;
        }
        div:last-child {
            border-right: none;
        }
    }
</style>
<template>
    <div>
        <div class="map-viewer" :style="{height: 240 * interval + 'px'}" v-loading="loading">
            <div class="lnn-tips" id="lnn-top">
                <div>坐标: {{tipForm['coordinates'] ? tipForm['coordinates'] : '(X, Y, Z)'}}</div>
                <div>点位编号: {{tipForm['nodeCode'] ? tipForm['nodeCode'] : '无'}}</div>
                <div>托盘编号: {{tipForm['carrierCode'] ? tipForm['carrierCode'] : '无'}}</div>
            </div>
            <!--top: (interval) + 'px', 长度加一-->
            <div :style="viewerStyle" class="nifo">
                <div :class="{'robot': true, 'robot-transform': robotTransfrom}" :key="index"
                     v-for="(item, index) in carList" :style="{ width: interval + 'px',
        height: interval + 'px', borderRadius: interval / 5 + 'px', background: '#ff7100',
        top: ((2.1 *  interval / 1.01) * item['x'] + 1) + 'px', left: ((5 * interval / 2.5) * item['y'] + 1) + 'px'
      }" :ref="item.name" @click="onClickCar(item)" @dblclick="dbCar(item)">
                    <div class="dot" v-if="item['mainTaskNum']"
                         :style="{width: interval/2+'px', height: interval/2+'px'}"></div>
                    <!--资源占用  海康-->
                    <!--<div v-if="item.isTop == 1 && item.size>0 && showMapNode" :style="{position: 'absolute', width: interval + 'px',height: (interval * 2.2 * (item.size)) + 'px', backgroundColor: 'rgba(255,83,168,.5)',-->
                    <!--top: (-interval * 2.2 * (item.size)) + 'px'}"></div>-->
                    <!--<div v-if="item.isBottom == 1 && item.size>0 && showMapNode" :style="{position: 'absolute', width: interval + 'px',height: (interval * 2.2 * (item.size)) + 'px', backgroundColor: 'rgba(255,83,168,.5)',-->
                    <!--bottom: (-interval * 2.2 * (item.size)) + 'px'}"></div>-->
                    <!--<div v-if="item.isLeft == 1 && item.size>0 && showMapNode" :style="{position: 'absolute', width: (interval * 2.2 * (item.size)) + 'px',height: (interval) + 'px', backgroundColor: 'rgba(255,83,168,.5)',-->
                    <!--left: (-interval * 2 * (item.size)) + 'px'}"></div>-->
                    <!--<div v-if="item.isRight == 1 && item.size>0 && showMapNode" :style="{position: 'absolute', width: (interval * 2 * (item.size)) + 'px',height: (interval) + 'px', backgroundColor: 'rgba(255,83,168,.5)',-->
                    <!--left: (interval) + 'px'}"></div>-->
                </div>
                <!--最low版-->
                <div v-if="typeof resList !== 'undefined' && showMapNode" v-for="(it, ind) in resList" :key="ind"
                     :ref="ind">
                    <div v-for="(its, indx) in it" :key="indx" :style="{position: 'absolute',top: ((2.1 *  interval) * its['x'] + 1) + 'px', left: ((5 * interval / 2.5) * its['y'] + 1) + 'px',
          width: (its['width'] * interval) + 'px', height: (its['height'] * interval)+ 'px',
          backgroundColor: 'rgba(255,83,168,.5)', zIndex: 209}">
                    </div>
                </div>
            </div>
            <!--资源占用-->

            <div class="shelter" :style="{height: 240 * interval + 'px',width: '100%'}"
                 @mousedown="viewerDown" @mouseup="viewerUp" @mousemove="viewerMove"
                 @mouseleave="viewerLeave"></div>

            <!--有无货-->
            <canvas id="empty" :width="150 * interval" :height="240 * interval"
                    :style="viewerStyle"></canvas>
            <!--路线-->
            <canvas id="router" :width="150 * interval" :height="240 * interval"
                    :style="viewerStyle"></canvas>
            <!--查询 点击-->
            <canvas id="canvasLock" :width="150 * interval" :height="240 * interval"
                    :style="viewerStyle"></canvas>
            <!--地图-->
            <canvas id="canvas" :width="150 * interval" :height="240 * interval"
                    :style="viewerStyle"></canvas>
        </div>

    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "map-canvas-monitor",
        props: {
            interval: {
                Number
            },
            mapCode: {
                String
            },
            floorNum: {
                Number
            },
            isSave: {
                Boolean
            },
            showLockNode: { // 显示有锁
                Boolean
            },
            selectType: { // 查询类型
                String
            },
            queryInfo: { // 查询内容
                String
            },
            showMapNode: { // 显示锁资源
                Boolean
            }
        },
        data() {
            return {
                nodeList: [],
                lockNodeList: [],
                clickKey: null,
                tipForm: {},
                mapCans: null, // 要重置
                lockCan: null, // 要重置
                routerCan: null, // 要重置
                emptyCan: null, // 要重置
                loading: false,
                currentCarNo: null,
                showRouter: false,
                baseUrlMonitor: {
                    getNodeList: this.$address + '/api/node/getNodeData', // 获取rgv点位信息
                    getAllLockNode: this.$address + '/api/node/getAllLockNode', // 获取rgv有锁点位信息
                    initializeVehicle: this.$address + '/api/rgv/initializeVehicle' // 初始化 获取所有小车位置信息
                },
                showTip: false,
                resList: {}, // 乘以宽高2
                connNum: 0, // 连接次数
                robotTransfrom: false,
                lineWidth: 4, // 路线宽度
                lineColors: '#88e358',
                intervalTime: null,
                emptyFlagList: [], // 有货
                goodMapList: null, // 有货map
                currentCarInfo: {},
                nodeInfoList: null,
                notConnect: true, // 没有连接
                socket: null,
                webSocketUrl: this.$socketUrl,
                carList: [],
                viewerDragFlag: false,
                viewerInfo: {
                    x: 30,
                    y: 40,
                    currentX: 0,
                    currentY: 0,
                    startX: 0,
                    startY: 0
                },
                currentClick: {
                    x: null,
                    y: null,
                    startOffsetX: null,
                    startOffsetY: null,
                    endX: null,
                    endY: null,
                    endOffsetX: null,
                    endOffsetY: null,
                }
            }
        },
        computed: {
            viewerStyle() {
                return {
                    position: 'absolute',
                    top: this.viewerInfo.y + 'px',
                    left: this.viewerInfo.x + 'px'
                }
            }
        },
        methods: {
            // 清除小车背景
            clearCarBck() {
                if (this.carList.length > 0) {
                    for (let i = 0; i < this.carList.length; i++) {
                        this.$refs[this.carList[i].name][0].style.boxShadow = ''
                    }
                }
            },
            // 点击小车
            onClickCar(carInfo) {
                // this.socket.send('12323')
                this.currentCarInfo = _.cloneDeep(carInfo)
                this.clearCarBck()
                this.$refs[carInfo.name][0].style.boxShadow = '-1px -1px 10px 4px #d80304'
                this.$emit('on-click-car', carInfo)
                let router = document.getElementById('router') // 清除路线
                if (this.routerCan) {
                    this.routerCan.clearRect(0, 0, router.width, router.height)
                }
                this.currentCarNo = null
                this.showRouter = false
            },
            // 鼠标按下
            viewerDown(e) {
                this.clickKey = e.button
                if (e.button === 2) { // 右键
                    this.viewerDragFlag = true
                    this.viewerInfo.currentX = this.viewerInfo.x
                    this.viewerInfo.currentY = this.viewerInfo.y
                    this.viewerInfo.startX = e.offsetX
                    this.viewerInfo.startY = e.offsetY
                } else if (e.button === 0) { // 左键
                    this.currentClick.x = e.offsetX - this.viewerInfo.x //鼠标点击位置到地图右上角的距离
                    this.currentClick.y = e.offsetY - this.viewerInfo.y
                    this.currentClick.startOffsetX = e.offsetX    //鼠标点击点在canvas中的位置
                    this.currentClick.startOffsetY = e.offsetY
                }
            },
            // 鼠标抬起
            viewerUp(e) {
                this.viewerDragFlag = false
                if (this.clickKey === 0) {
                    this.clickView(e)
                    this.clearCarBck()
                } else if (this.clickKey === 2) {  // 右键拖动
                    this.$emit('on-change', 'leftUp')
                }
            },
            // 点击  如果底层x,y加多少  在这里计算的就得减多少
            clickView(e) {
                // x, y 有时会多0.5   判断x, y不能同时都多0.5
                let x = Math.floor(((e.offsetX - this.viewerInfo.x) / (this.interval * 2))) // 点击处的坐标
                let y = Math.floor(((e.offsetY - this.viewerInfo.y) / (this.interval * 5 / 2.4)))
                let body = {
                    x: y,
                    y: x
                }
                // console.log(body);
                this.$emit('on-change', 'click', body, this.nodeList)
                this.drawClick(body)
            },
            // 画点击图
            drawClick(data) {
                // 画图
                let canvas = document.getElementById('canvasLock')
                if (!this.lockCan) {
                    this.lockCan = canvas.getContext('2d')
                }
                this.lockCan.clearRect(0, 0, canvas.width, canvas.height)
                this.$nextTick(() => {
                    if (this.nodeList.length > 0) {
                        for (let i = 0; i < this.nodeList.length; i++) {
                            if (!(data['x'] === (this.nodeList[i]['x'] + 0.5) && data['y'] === (this.nodeList[i]['y'] + 0.5))) {
                                let x = Math.floor(data['x'])
                                let y = Math.floor(data['y'])
                                if (this.nodeList[i]['x'] === x && this.nodeList[i]['y'] === y) { // && this.judgeNodeType(nodeList[i]['nodeType'])
                                    let body = {
                                        x: this.nodeList[i]['x'],
                                        y: this.nodeList[i]['y']
                                    }
                                    this.drawImage(body, this.lockCan, 'click')
                                    return true
                                } else {
                                    this.lockCan.clearRect(0, 0, canvas.width, canvas.height)
                                }
                            }
                        }
                    }
                })
            },
            // 移动
            viewerMove(e) {
                if (this.viewerDragFlag) {
                    if (this.clickKey === 0) { // 左键框选
                    } else if (this.clickKey === 2) {// 右键拖动
                        this.viewerInfo.x = event.offsetX - this.viewerInfo.startX + this.viewerInfo.currentX
                        this.viewerInfo.y = event.offsetY - this.viewerInfo.startY + this.viewerInfo.currentY
                    }
                }
                let x = Math.floor(((e.offsetX - this.viewerInfo.x) / (this.interval * 2))) // 点击处的坐标
                let y = Math.floor(((e.offsetY - this.viewerInfo.y) / (this.interval * 5 / 2.4)))
                let body = {
                    x: y,
                    y: x
                }
                this.searchDataItem(body, this.nodeList)
            },
            searchDataItem(data, nodeList) {
                if (nodeList.length > 0) {
                    for (let i = 0; i < nodeList.length; i++) {
                        if (!(data['x'] === (nodeList[i]['x'] + 0.5) && data['y'] === (nodeList[i]['y'] + 0.5))) {
                            let x = Math.floor(data['x'])
                            let y = Math.floor(data['y'])
                            if (nodeList[i]['x'] === x && nodeList[i]['y'] === y) {
                                this.tipForm = nodeList[i]
                                this.tipForm.coordinates = '(' + this.tipForm.x + ', ' + this.tipForm.y + ', ' + this.tipForm.z + ')'
                                this.showTip = true
                                return true
                            } else {
                                this.tipForm = {}
                                this.showTip = false
                            }
                        }
                    }
                }
            },
            // 鼠标移出
            viewerLeave(ev) {

            },
            // 画图
            drawImage(data, ctx, val) {
                let type = data.type
                let startX = (2 * this.interval) * data['y'] + 1
                let startY = (5 * this.interval / 2.4) * data['x'] + 1
                if (val === 'map') {
                    switch (type) {
                        case 'P': // 货位
                            this.drawRect(ctx, startX, startY, '#fdf8ff', '#202842')
                            break;
                        case 'R': // 通道
                            this.drawRect(ctx, startX, startY, 'rgb(200,220,230)')
                            break;
                        case 'L': // 提升机
                            this.drawHoist(ctx, startX, startY, this.interval)
                            break;
                        case 'B': // 禁用
                            this.drawRect(ctx, startX, startY, '#6f0069')
                            break;
                        case 'C': // 充电桩
                            this.drawCharge(ctx, startX, startY)
                            break;
                        case 'I': // 入库口
                            this.drawWork(ctx, startX, startY)
                            break;
                        case 'O': // 出库口
                            this.drawWork(ctx, startX, startY)
                            break;
                        case 'S': // 输送线
                            this.drawWork(ctx, startX, startY)
                            break;
                        case 'TL': // 穿层提升机
                            this.drawWork(ctx, startX, startY)
                            break;
                        default:
                            console.log('错误类型' + type);
                            break;
                    }
                    // 画左右上下通道以及三角形
                    this.drawWay(data, ctx, startX, startY)
                    this.loading = false
                } else if (val === 'lock') {
                    if (data['emptyFlag'] != 1 && data['indLock'] != 1) {
                        this.drawRect(ctx, startX, startY, '#', '#202842')
                    } else {
                        if (data['emptyFlag'] == 1 && data['indLock'] == 1) {
                            this.drawGood(ctx, startX, startY, true)
                        } else {
                            if (data['emptyFlag'] == 1 && data['indLock'] != 1) {
                                this.drawGood(ctx, startX, startY, false) // 有货 并没有锁
                            } else {
                                this.drawRect(ctx, startX, startY, '#d8b60c', '#202842') // 有锁
                            }
                        }
                    }
                } else if (val === 'query') {
                    this.drawFrame(ctx, startX, startY, '#ff0930')
                } else if (val === 'click') {
                    this.drawFrame(ctx, startX, startY, '#ff0930')
                }
            },
            // 点击 查询
            drawFrame(ctx, startX, startY, color) {
                ctx.beginPath()
                ctx.lineWidth = 3
                ctx.fillStyle = 'rgba(225,225,225,0.3)';
                ctx.rect(startX, startY, this.interval, this.interval)
                ctx.fill()
                ctx.strokeStyle = `${color}`
                ctx.stroke()
                ctx.closePath()
            },
            // 画提升机
            drawHoist(ctx, startX, startY) {
                ctx.beginPath()
                ctx.lineWidth = 1
                ctx.strokeStyle = 'rgb(255,255,255)'
                ctx.fillStyle = '#fdf8ff'
                ctx.lineWidth = 2
                ctx.rect(startX, startY, this.interval, this.interval)
                ctx.stroke()
                ctx.fill()
                ctx.closePath()
                // 提升机底座
                ctx.beginPath()
                ctx.fillStyle = '#666162'
                ctx.strokeStyle = '#666162'
                let x = startX + this.interval / 10
                let y = startY + this.interval / 1.5
                ctx.rect(x, y, this.interval / 2, this.interval / 6)
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.moveTo(x + this.interval / 10, y);
                ctx.lineTo(x + this.interval / 1.7, y - this.interval / 2.7);
                ctx.lineTo(x + this.interval / 3, y);
                ctx.fillStyle = '#ffc457'
                ctx.strokeStyle = '#ffc457'
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
                ctx.beginPath()
                ctx.moveTo(x + this.interval / 1.4, y - this.interval / 2)
                ctx.lineTo(x + this.interval / 1.4, y - this.interval / 4)
                ctx.strokeStyle = '#706a71'
                ctx.lineWidth = 1
                ctx.stroke()
                ctx.closePath()
                ctx.beginPath()
                ctx.rect(x + this.interval / 1.6, y - this.interval / 4, this.interval / 5, this.interval / 5)
                ctx.fillStyle = '#343434'
                ctx.fill()
                ctx.closePath()
            },
            // 画充电任务
            drawCharge(ctx, startX, startY) {
                ctx.beginPath()
                ctx.lineWidth = 1
                ctx.strokeStyle = 'rgba(255,255,255,1)'
                ctx.fillStyle = '#fdf8ff'
                ctx.lineWidth = 1
                ctx.rect(startX, startY, this.interval, this.interval)
                ctx.stroke()
                ctx.fill()
                ctx.closePath()
                ctx.beginPath()
                ctx.fillStyle = '#82fd91'
                ctx.strokeStyle = '#82fd91'
                ctx.rect(startX + this.interval / 3.5, startY + this.interval / 1.8, this.interval / 2.5, this.interval / 3)
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
                ctx.beginPath()
                ctx.fillStyle = '#d8d3d9'
                ctx.strokeStyle = '#d8d3d9'
                ctx.rect(startX + this.interval / 3.5, startY + this.interval / 2.5, this.interval / 2.5, this.interval / 6)
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
                ctx.beginPath()
                ctx.fillStyle = '#d0d0d0'
                ctx.strokeStyle = '#d0d0d0'
                ctx.rect(startX + this.interval / 2.6, startY + this.interval / 4.5, this.interval / 5, this.interval / 6.5)
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
            },
            // 画是否有货
            drawGood(ctx, startX, startY, val) {
                ctx.beginPath()
                ctx.strokeStyle = '#fff'
                ctx.lineWidth = 1
                ctx.rect(startX, startY, this.interval, this.interval)
                ctx.stroke()
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.strokeStyle = '#505987'
                ctx.rect(startX + this.interval / 5.5, startY + this.interval / 6, this.interval / 1.5, this.interval / 2);
                if (val) { // 是否有锁
                    ctx.fillStyle = '#ffb628'
                    ctx.fill()
                }
                ctx.stroke()
                ctx.closePath()
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.strokeStyle = '#505987'
                ctx.strokeRect(startX + this.interval / 3.6, startY + this.interval / 1.3, this.interval / 2, this.interval / 20)
                ctx.closePath()
            },
            // 画出入库口
            drawWork(ctx, startX, startY) {
                ctx.beginPath()
                ctx.strokeStyle = '#164BFF'
                ctx.lineWidth = 1
                ctx.rect(startX, startY, this.interval, this.interval)
                ctx.fillStyle = '#164BFF'
                ctx.fill()
                ctx.stroke()
                ctx.lineWidth = 2
                ctx.strokeStyle = '#fff'
                ctx.strokeRect(startX + this.interval / 5.5, startY + this.interval / 6, this.interval / 1.5, this.interval / 2);
                ctx.strokeRect(startX + this.interval / 3.6, startY + this.interval / 1.3, this.interval / 2, this.interval / 20)
                ctx.closePath()
            },
            // 画正方形
            drawRect(ctx, startX, startY, fillColor, borderColor = null) {
                ctx.beginPath()
                ctx.lineWidth = 1
                ctx.fillStyle = `${fillColor}`
                ctx.rect(startX, startY, this.interval, this.interval)
                ctx.fill()
                if (borderColor) {
                    ctx.strokeStyle = `${borderColor}`
                    ctx.stroke()
                }
                ctx.closePath()
            },
            // 画库位左右通道
            drawWay(data, ctx, startX, startY) {
                let width = this.interval / 1.5
                let height = this.interval / 2
                // 顶部
                if (data['canUp'] == 1) {
                    let x = startX + this.interval / 6
                    let y = startY - this.interval / 1.8
                    // 画头上线
                    ctx.beginPath()
                    ctx.fillStyle = '#fdf8ff'
                    ctx.rect(x, y, width, height)
                    ctx.fill()
                    ctx.closePath()
                    // 三角形
                    // 右边
                    let x1 = startX + this.interval / 3
                    let y1 = startY - this.interval / 4
                    // 中间
                    let x2 = startX + this.interval / 2
                    let y2 = startY - this.interval / 2
                    // 左边
                    let x3 = startX + this.interval / 1.5
                    let y3 = startY - this.interval / 4
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3)
                }
                // 底部
                if (data['canDown'] == 1) {
                    let x = startX + this.interval / 6
                    let y = startY + this.interval + (this.interval / 20)
                    // 画头上线
                    ctx.beginPath()
                    ctx.fillStyle = '#fdf8ff'
                    ctx.rect(x, y, width, height)
                    ctx.fill()
                    ctx.closePath()
                    // 三角形
                    // 右边
                    let x1 = startX + this.interval / 3
                    let y1 = startY + this.interval + (this.interval / 4)
                    // 中间
                    let x2 = x1 + (this.interval / 6)
                    let y2 = startY + this.interval + (this.interval / 2.1)
                    // 左边
                    let x3 = startX + this.interval / 1.5
                    let y3 = y1
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3)
                }
                // 左边
                if (data['canLeft'] == 1) {
                    let x = startX - height - (this.interval / 17)
                    let y = startY + this.interval / 6
                    // 画头上线
                    ctx.beginPath()
                    ctx.fillStyle = '#fdf8ff'
                    ctx.rect(x, y, height, width)
                    ctx.fill()
                    ctx.closePath()
                    // 三角形
                    // 右边
                    let x1 = startX - this.interval / 4
                    let y1 = startY + this.interval / 3
                    // 中间
                    let x2 = x1 - (this.interval / 4.5)
                    let y2 = startY + this.interval / 2
                    // 左边
                    let x3 = x1
                    let y3 = startY + this.interval / 1.5
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3)
                }
                // 右边
                if (data['canRight'] == 1) {
                    let x = startX + this.interval + 1
                    let y = startY + this.interval / 6
                    // 画头上线
                    ctx.beginPath()
                    ctx.fillStyle = '#fdf8ff'
                    ctx.rect(x, y, height, width)
                    ctx.fill()
                    ctx.closePath()
                    // 三角形
                    let x1 = startX + this.interval + (this.interval / 4)
                    let y1 = startY + this.interval / 3
                    // 中间
                    let x2 = startX + this.interval + (this.interval / 2)
                    let y2 = startY + this.interval / 2
                    // 左边
                    let x3 = x1
                    let y3 = startY + this.interval / 1.5
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3)
                }
            },
            // 画三角形
            drawTriangle(ctx, x1, y1, x2, y2, x3, y3, color = '#585858') {
                ctx.beginPath()
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.fillStyle = color
                ctx.fill()
                ctx.strokeStyle = color
                ctx.stroke()
                ctx.closePath()
            },
            // 构建地图数据
            drawCanvas(data) {
                this.$nextTick(() => {
                    let canvas = document.getElementById('canvas')
                    if (!this.mapCans) {
                        this.mapCans = canvas.getContext('2d')
                    }
                    this.mapCans.clearRect(0, 0, canvas.width, canvas.height)
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            let body = {
                                x: data[i].x,
                                y: data[i].y,
                                type: data[i].nodeType,
                                nodeType: data[i].nodeType,
                                indLock: data[i].indLock,
                                emptyFlag: data[i].emptyFlag,
                                offsetX: data[i].offsetx,
                                offsetY: data[i].offsety,
                                canUp: data[i].canUp,
                                canDown: data[i].canDown,
                                canLeft: data[i].canLeft,
                                canRight: data[i].canRight
                            }
                            this.drawImage(body, this.mapCans, 'map')
                        }
                        // this.setWebSocket()
                        // 初始化小车
                        this.initCarData()
                    } else {
                        this.loading = false
                        this.$error('当前地图编号' + this.mapCode + '下点位数量为空', 3)
                    }
                })
            },
            // 初始化小车
            initCarData() {
                // 在初始化完小车时连接socket
                let body = {
                    z: this.floorNum,
                    mapCode: this.mapCode
                }
                this.$http.post(this.baseUrlMonitor.initializeVehicle, body).then(response => {
                    if (response.data.returnCode === 200) {
                        let dataList = _.cloneDeep(response.data.returnData)
                        this.carList = dataList.filter(item => {
                            return item.z === this.floorNum
                        })
                        this.setWebSocket()
                    } else if (response.data.code === '1') {
                        this.$util.error(response.data.message, 3)
                    } else {
                        this.$util.error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$util.loginOut()
                })

            },
            // 初始化有货
            drawAllGood(dataList) {
                this.$nextTick(() => {
                    let canvas = document.getElementById('empty')
                    if (!this.emptyCan) {
                        this.emptyCan = canvas.getContext('2d')
                    }
                    this.emptyCan.clearRect(0, 0, canvas.width, canvas.height)
                    for (let i = 0; i < dataList.length; i++) {
                        let startX = (2 * this.interval) * dataList[i]['y'] + 1
                        let startY = (5 * this.interval / 2.4) * dataList[i]['x'] + 1
                        this.drawGood(this.emptyCan, startX, startY, false)
                    }
                })
            },
            // 画有无货
            drawEmptyFlag(dataList) {
                if (dataList.length > 0) {
                    // 初始化有货信息
                    this.drawAllGood(dataList)
                    // 处理map
                    this.goodMapList = new Map()
                    for (let j = 0; j < dataList.length; j++) {
                        let key = dataList[j].x + ',' + dataList[j].y + ',' + dataList[j].z
                        if (this.goodMapList.get(key)) {
                            this.goodMapList.delete(key)
                            this.goodMapList.set(key, dataList[j])
                        } else {
                            this.goodMapList.set(key, dataList[j])
                        }
                    }
                    console.log(this.goodMapList);
                }
            },
            // 查询方法
            queryData() {
                if (!this.$util.isEmpty(this.queryInfo)) {
                    switch (this.selectType) {
                        case 'equip':
                        case 'taskNo':
                            this.searchEquip(this.selectType)
                            break;
                        case 'local':
                            this.searchLocal()
                            break;
                        default:
                            console.log('所选查询标识不存在 ->' + this.selectType);
                    }
                } else {
                    if (this.selectType === 'equip' || this.selectType === 'taskNo') {
                        this.clearCarBck()
                    } else {
                        if (this.lockCan) {
                            let canvas = document.getElementById('canvasLock')

                            this.lockCan.clearRect(0, 0, canvas.width, canvas.height)
                        }
                    }
                }
            },
            // 查询设备
            searchEquip(val) {
                this.clearCarBck()
                let data
                if (val === 'taskNo') { // 根据任务号查询
                    data = this.carList.filter(item => {
                        if (typeof item.mainTaskNum !== 'undefined') {
                            return item.mainTaskNum === this.queryInfo
                        }
                    })
                } else {
                    data = this.carList.filter(item => {
                        return item.name === this.queryInfo
                    })
                }
                if (data.length !== 1) {
                    this.$warn('未找到该设备', 3)
                    return
                }
                this.$refs[data[0]['name']][0].style.boxShadow = '-1px -1px 10px 4px #d80304'
            },
            // 查询坐标
            searchLocal() {
                if (this.queryInfo.indexOf(',') === -1) {
                    this.$warn('坐标之间请用逗号隔开', 3)
                    return
                }
                let x = this.queryInfo.split(',')[0].trim()
                let y = this.queryInfo.split(',')[1].trim()
                let dataList = this.nodeList.filter(item => {
                    return item['x'] == x && item['y'] == y && item['z'] == this.floorNum
                })
                if (dataList.length !== 1) {
                    this.$warn('未找到该坐标', 3)
                    return
                }
                this.$nextTick(() => {
                    let canvas = document.getElementById('canvasLock')
                    if (!this.lockCan) {
                        this.lockCan = canvas.getContext('2d')
                    }
                    this.lockCan.clearRect(0, 0, canvas.width, canvas.height)
                    let body = {
                        x: dataList[0].x,
                        y: dataList[0].y,
                    }
                    this.drawImage(body, this.lockCan, 'query')
                })
            },
            // 搭建地图
            getAllNodeData() {
                let body = {
                    z: this.floorNum,
                    mapCode: this.mapCode
                }
                this.loading = true
                this.$http.post(this.baseUrlMonitor.getNodeList, body).then(response => {
                    if (response.data.returnCode === 200) {
                        this.nodeList = response.data.returnData
                        if (this.nodeList.length > 0) {
                            this.drawCanvas(_.cloneDeep(this.nodeList))
                            this.createNodeList(_.cloneDeep(this.nodeList))
                            this.emptyFlagList = _.cloneDeep(this.nodeList).filter(item => {
                                return item.emptyFlag == 0
                            })
                            // 搭建有无货
                            this.drawEmptyFlag(this.emptyFlagList)
                        } else {
                            let canvas = document.getElementById('canvas')
                            if (!this.mapCans) {
                                this.mapCans = canvas.getContext('2d')
                            }
                            this.mapCans.clearRect(0, 0, canvas.width, canvas.height)
                            this.loading = false
                            this.$error('当前地图编号' + this.mapCode + '下点位数量为空', 3)
                        }
                    } else {
                        this.loading = false
                        this.$error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.loading = false
                    this.$loginOut()
                })
            },
            createNodeList(dataList) {
                this.nodeInfoList = new Map()
                if (dataList.length > 0) {
                    for (let i = 0; i < dataList.length; i++) {
                        if (this.nodeInfoList.get(dataList[i].posList)) {
                            this.nodeInfoList.delete(dataList[i].posList)
                            this.nodeInfoList.set(dataList[i].posList, dataList[i])
                        } else {
                            this.nodeInfoList.set(dataList[i].posList, dataList[i])
                        }
                    }
                }
            },
            // 画有锁点位
            drawLockMap(data) {
                if (data.length > 0) {
                    this.$nextTick(() => {
                        let canvas = document.getElementById('canvasLock')
                        if (!this.lockCan) {
                            this.lockCan = canvas.getContext('2d')
                        }
                        this.lockCan.clearRect(0, 0, canvas.width, canvas.height)
                        for (let i = 0; i < data.length; i++) {
                            let body = {
                                x: data[i].x,
                                y: data[i].y,
                                type: data[i].nodeType,
                                nodeType: data[i].nodeType,
                                indLock: data[i].indLock,
                                emptyFlag: data[i].emptyFlag,
                                offsetX: data[i].offsetx,
                                offsetY: data[i].offsety,
                                canUp: data[i].canUp,
                                canDown: data[i].canDown,
                                canLeft: data[i].canLeft,
                                canRight: data[i].canRight
                            }
                            this.drawImage(body, this.lockCan, 'lock')
                        }
                    })
                } else {
                    console.log('有锁数据为空');
                }
            },
            dbCar(carInfo) {
                this.showRouter = true
                this.currentCarNo = carInfo.name
            },
            // 画路线
            drawRouter(carInfo) {
                let routerList = carInfo.locationNodeList
                // let routerList = ["(5,3,1)", "(4,3,1)","(3,3,1)","(3,4,1)","(2,4,1)","(1,4,1)","(0,4,1)"]
                if (typeof routerList !== 'undefined' && routerList !== null && routerList.length > 0) {
                    this.$nextTick(() => {
                        let canvas = document.getElementById('router')
                        if (!this.routerCan) {
                            this.routerCan = canvas.getContext('2d')
                        }
                        this.routerCan.clearRect(0, 0, canvas.width, canvas.height)
                        let dataList = [] // 获取当前点位
                        // for (let i = 0; i < routerList.length; i++) {
                        //   let nodeInfo = this.nodeInfoList.get(routerList[i])
                        //   let str = routerList[i].replace(/[(|)]/g,"");
                        //   let strList = str.split(',')
                        //   dataList.push({
                        //     x: strList[0],
                        //     y: strList[1],
                        //     z: strList[2],
                        //     canDown: nodeInfo.canDown,
                        //     canUp: nodeInfo.canUp,
                        //     canRight: nodeInfo.canRight,
                        //     canLeft: nodeInfo.canLeft,
                        //   })
                        //
                        // }
                        let len = routerList.length - 1 // 当前最后的下标
                        for (let i = 0; i < routerList.length; i++) { // 处理数据并画图
                            let nodeInfoCopy = this.nodeInfoList.get(routerList[i])
                            let startX = (2 * this.interval) * nodeInfoCopy['y'] + 1
                            let startY = (5 * this.interval / 2.4) * nodeInfoCopy['x'] + 1

                            if (i === 0) { // ------------------------------------------------------------------------------------------------ 开始
                                if (nodeInfoCopy['canDown'] == 1) { // 先判断该点位是否可以下走  第一个
                                    let xAdd1 = '(' + (nodeInfoCopy.x + 1) + ',' + nodeInfoCopy.y + ',' + nodeInfoCopy.z + ')' // x + 1
                                    if (xAdd1 === routerList[i + 1]) { // 说明右边点位画线
                                        this.drawDown(this.routerCan, startX, startY, this.lineWidth, this.lineColors, false)
                                    }
                                }
                                if (nodeInfoCopy['canUp'] == 1) { // 先判断该点位是否可以上走
                                    let aReduce1 = '(' + (nodeInfoCopy.x - 1) + ',' + nodeInfoCopy.y + ',' + nodeInfoCopy.z + ')' // x -1
                                    if (aReduce1 === routerList[i + 1]) { // 说明左边点位画线
                                        this.drawTop(this.routerCan, startX, startY, this.lineWidth, this.lineColors, false)
                                    }
                                }
                                if (nodeInfoCopy['canRight'] == 1) { // 先判断该点位是否可以右走
                                    let yAdd1 = '(' + nodeInfoCopy.x + ',' + (nodeInfoCopy.y + 1) + ',' + nodeInfoCopy.z + ')' // y + 1
                                    if (yAdd1 === routerList[i + 1]) { // 说明左边点位画线
                                        this.drawRight(this.routerCan, startX, startY, this.lineWidth, this.lineColors, false)
                                    }
                                }
                                if (nodeInfoCopy['canLeft'] == 1) { // 先判断该点位是否可以左走
                                    let yReduce1 = '(' + nodeInfoCopy.x + ',' + (nodeInfoCopy.y - 1) + ',' + nodeInfoCopy.z + ')' // y - 1
                                    if (yReduce1 === routerList[i + 1]) { // 说明左边点位画线
                                        this.drawLeft(this.routerCan, startX, startY, this.lineWidth, this.lineColors, false)
                                    }
                                }
                            } else if (i === len) {  // ---------------------------------------------------------最后一个
                                if (nodeInfoCopy['canDown'] == 1) { // 先判断该点位是否可以下走  第一个
                                    let xAdd1 = '(' + (nodeInfoCopy.x + 1) + ',' + nodeInfoCopy.y + ',' + nodeInfoCopy.z + ')' // x + 1
                                    if (xAdd1 === routerList[i - 1]) { // 说明右边点位画线
                                        this.drawDown(this.routerCan, startX, startY, this.lineWidth, this.lineColors, true)
                                    }
                                }
                                if (nodeInfoCopy['canUp'] == 1) { // 先判断该点位是否可以上走
                                    let aReduce1 = '(' + (nodeInfoCopy.x - 1) + ',' + nodeInfoCopy.y + ',' + nodeInfoCopy.z + ')' // x -1
                                    if (aReduce1 === routerList[i - 1]) { // 说明左边点位画线
                                        this.drawTop(this.routerCan, startX, startY, this.lineWidth, this.lineColors, true)
                                    }
                                }
                                if (nodeInfoCopy['canRight'] == 1) { // 先判断该点位是否可以右走
                                    let yAdd1 = '(' + nodeInfoCopy.x + ',' + (nodeInfoCopy.y + 1) + ',' + nodeInfoCopy.z + ')' // y + 1
                                    if (yAdd1 === routerList[i - 1]) { // 说明左边点位画线
                                        this.drawRight(this.routerCan, startX, startY, this.lineWidth, this.lineColors, true)
                                    }
                                }
                                if (nodeInfoCopy['canLeft'] == 1) { // 先判断该点位是否可以左走
                                    let yReduce1 = '(' + nodeInfoCopy.x + ',' + (nodeInfoCopy.y - 1) + ',' + nodeInfoCopy.z + ')' // y - 1
                                    if (yReduce1 === routerList[i - 1]) { // 说明左边点位画线
                                        this.drawLeft(this.routerCan, startX, startY, this.lineWidth, this.lineColors, true)
                                    }
                                }
                            } else {
                                if (i < len) { // --------------------------------------------------------------中间
                                    let show = false
                                    if (nodeInfoCopy['canDown'] == 1) { // 先判断该点位是否可以下走
                                        let xAdd1 = '(' + (nodeInfoCopy.x + 1) + ',' + nodeInfoCopy.y + ',' + nodeInfoCopy.z + ')' // x + 1
                                        if (xAdd1 === routerList[i + 1] || xAdd1 === routerList[i - 1]) { // 说明右边点位画线
                                            this.drawDown(this.routerCan, startX, startY, this.lineWidth, this.lineColors, show)

                                        }
                                    }

                                    if (nodeInfoCopy['canUp'] == 1) { // 先判断该点位是否可以上走
                                        let aReduce1 = '(' + (nodeInfoCopy.x - 1) + ',' + nodeInfoCopy.y + ',' + nodeInfoCopy.z + ')' // x -1
                                        if (aReduce1 === routerList[i + 1] || aReduce1 === routerList[i - 1]) { // 说明左边点位画线
                                            this.drawTop(this.routerCan, startX, startY, this.lineWidth, this.lineColors, show)
                                        }
                                    }

                                    if (nodeInfoCopy['canRight'] == 1) { // 先判断该点位是否可以右走
                                        let yAdd1 = '(' + nodeInfoCopy.x + ',' + (nodeInfoCopy.y + 1) + ',' + nodeInfoCopy.z + ')' // y + 1
                                        if (yAdd1 === routerList[i + 1] || yAdd1 === routerList[i - 1]) { // 说明左边点位画线
                                            this.drawRight(this.routerCan, startX, startY, this.lineWidth, this.lineColors, show)
                                        }
                                    }

                                    if (nodeInfoCopy['canLeft'] == 1) { // 先判断该点位是否可以左走
                                        let yReduce1 = '(' + nodeInfoCopy.x + ',' + (nodeInfoCopy.y - 1) + ',' + nodeInfoCopy.z + ')' // y - 1
                                        if (yReduce1 === routerList[i + 1] || yReduce1 === routerList[i - 1]) { // 说明左边点位画线
                                            this.drawLeft(this.routerCan, startX, startY, this.lineWidth, this.lineColors, show)
                                        }
                                    }
                                }
                            }
                        }
                        // 画起点圆
                        let firstNode = this.nodeInfoList.get(routerList[0])
                        let x = (2 * this.interval) * firstNode['y'] + 1
                        let y = (5 * this.interval / 2.4) * firstNode['x'] + 1
                        this.routerCan.beginPath();
                        this.routerCan.arc(x + this.interval / 2, y + this.interval / 2, 3, 0, Math.PI * 2, true);
                        this.routerCan.closePath();
                        this.routerCan.fillStyle = '#ff1015';
                        this.routerCan.fill();
                        this.routerCan.closePath()
                    })
                }
            },
            // 测试箭头
            drawCtx() {
                this.$nextTick(() => {
                    let canvas = document.getElementById('router')
                    let ctx = canvas.getContext('2d')
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                    let startX = (2 * this.interval) * 1 + 1
                    let startY = (5 * this.interval / 2.4) * 1 + 1

                    ctx.beginPath()
                    ctx.lineWidth = 1
                    ctx.fillStyle = `#fff`
                    ctx.rect(startX, startY, this.interval, this.interval)
                    ctx.fill()
                    ctx.closePath()
                    this.drawRight(ctx, startX, startY, this.lineWidth, this.lineColors, true)
                })
            },
            /**
             * 画线
             */
            // 上横线v
            drawTop(ctx, startX, startY, width, color, show) {
                ctx.beginPath()
                ctx.lineWidth = width
                ctx.strokeStyle = `${color}`
                ctx.moveTo(startX + (this.interval / 2), startY - this.interval / 2)
                ctx.lineTo(startX + this.interval / 2, startY + this.interval / 2)
                ctx.stroke()
                ctx.closePath()
                if (show) {
                    let x1 = startX + this.interval / 3
                    let y1 = startY + this.interval / 2.1
                    // 中间
                    let x2 = x1 + (this.interval / 6)
                    let y2 = startY + this.interval / 1.5
                    // 左边
                    let x3 = startX + this.interval / 1.5
                    let y3 = y1
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3, '#ff1015')
                }
            },
            // 下横线
            drawDown(ctx, startX, startY, width, color, show) {
                ctx.beginPath()
                ctx.lineWidth = width
                ctx.strokeStyle = `${color}`
                ctx.moveTo(startX + (this.interval / 2), startY + this.interval / 2)
                ctx.lineTo(startX + this.interval / 2, startY + (3 * this.interval / 2))
                ctx.stroke()
                ctx.closePath()
                if (show) {
                    let x1 = startX + this.interval / 3
                    let y1 = startY + this.interval / 2
                    // 中间
                    let x2 = x1 + (this.interval / 6)
                    let y2 = startY + this.interval / 3
                    // 左边
                    let x3 = startX + this.interval / 1.5
                    let y3 = y1
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3, '#ff1015')
                }
            },
            // 左横线
            drawLeft(ctx, startX, startY, width, color, show) {
                ctx.beginPath()
                ctx.lineWidth = width
                ctx.strokeStyle = `${color}`
                ctx.moveTo(startX - (this.interval / 2), startY + this.interval / 2)
                ctx.lineTo(startX + this.interval / 2, startY + this.interval / 2)
                ctx.stroke()
                ctx.closePath()
                if (show) {
                    // 三角形
                    let x1 = startX + this.interval / 2.1
                    let y1 = startY + this.interval / 3
                    // 中间
                    let x2 = startX + this.interval / 1.4
                    let y2 = startY + this.interval / 2
                    // 左边
                    let x3 = x1
                    let y3 = startY + this.interval / 1.5
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3, '#ff1015')
                }
            },
            // 右横线
            drawRight(ctx, startX, startY, width, color, show) {
                ctx.beginPath()
                ctx.lineWidth = width
                ctx.strokeStyle = `${color}`
                ctx.moveTo(startX + this.interval / 2, startY + this.interval / 2)
                ctx.lineTo(startX + (3 * this.interval / 2), startY + this.interval / 2)
                ctx.stroke()
                ctx.closePath()
                if (show) {
                    // 三角形
                    let x1 = startX + this.interval / 2
                    let y1 = startY + this.interval / 3
                    // 中间
                    let x2 = startX + this.interval / 3
                    let y2 = startY + this.interval / 2
                    // 左边
                    let x3 = x1
                    let y3 = startY + this.interval / 1.5
                    this.drawTriangle(ctx, x1, y1, x2, y2, x3, y3, '#ff1015')
                }
            },
            // 所有有锁点位
            getLockNode() {
                let body = {
                    mapCode: this.mapCode,
                    z: this.floorNum
                }
                this.$http.post(this.baseUrlMonitor.getAllLockNode, body).then(response => {
                    if (response.data.returnCode === 200) {
                        this.lockNodeList = response.data.returnData
                        this.drawLockMap(_.cloneDeep(this.lockNodeList))
                    } else {
                        this.$util.error(response.data.returnMsg, 3)
                    }
                }).catch(err => {
                    this.$util.loginOut()
                })
            },
            // webSocket连接
            setWebSocket() {
                var that = this
                if (!that.socket) {
                    if ('WebSocket' in window) {
                        console.log('当前浏览器支持WebSocket');
                        that.socket = new WebSocket(this.webSocketUrl);
                        // 判断连接状态
                        switch (this.socket.readyState) {
                            case WebSocket.CONNECTING:
                                console.log('正在连接');
                                break;
                            case WebSocket.OPEN:
                                console.log('连接成功');
                                break;
                            case WebSocket.CLOSING:
                                console.log('正在关闭');
                                break;
                            case WebSocket.CLOSED:
                                console.log('连接关闭或连接失败');
                                break;
                            default:
                                console.log('无法判断的状态');
                                break;
                        }
                        // 连接成功回调
                        that.socket.onopen = function (e) {
                            that.$success('WebSocket连接成功', 3)
                            that.notConnect = false
                            if (that.intervalTime) {
                                clearInterval(that.intervalTime)
                            }
                            // 连接成功并发送地图楼层信息
                            that.socket.send(that.mapCode, +',' + that.floorNum)
                            console.log('连接成功');
                        };
                        // 接收信息
                        that.socket.onmessage = function (e) {

                            let message = e.data;
                            console.log('socket接收到的数据为' + message);
                            if (message !== '' && message !== null) {
                                console.log('socket接收到的数据为' + message);
                                // 处理方法
                                that.handleCarInfo(message)
                            } else {
                                console.log('socket通信接收到的数据为空');
                            }
                        };
                        // 连接关闭回调
                        that.socket.onclose = function (e) {
                            console.log('连接被关闭');
                            that.notConnect = true
                            console.log(e);
                        };
                        // 连接失败回调
                        that.socket.onerror = function (ev) {
                            that.$warn('WebSocket建立连接失败', 3)
                            that.notConnect = true
                            console.log('建立连接失败');
                        };
                    } else {
                        that.$warn('当前浏览器不支持WebSocket', 3)
                        console.log('当前浏览器不支持WebSocket');
                    }
                }
            },
            // 处理webSocket数据
            handleCarInfo(msg) {
                this.robotTransfrom = true
                if (!this.$isEmpty(msg)) {
                    let dataList = JSON.parse(msg)
                    // 处理小车信息 并过滤掉其他楼层小车
                    if (typeof dataList.carInfo !== 'undefined' && dataList.carInfo.length > 0) {
                        let carInfo = dataList.carInfo.filter(item => { // 根据楼层过滤该楼层的信息
                            return item.z === this.floorNum
                        })
                        // 去除之前在该楼层的数据
                        let copyResList = _.cloneDeep(this.resList)
                        this.resList = {}
                        for (let j = 0; j < carInfo.length; j++) {
                            if (copyResList[carInfo[j]['name']]) {
                                this.resList[carInfo[j]['name']] = copyResList[carInfo[j]['name']]
                            } else {
                                this.resList[carInfo[j]['name']] = []
                            }
                        }
                        let mapCar = new Map()
                        this.carList = []
                        let carListCopy = _.cloneDeep(this.carList)
                        let carCopy = new Map()
                        mapCar = this.handleArrayToMap('array', carListCopy)
                        for (let i = 0; i < carInfo.length; i++) { // 存在替换
                            if (mapCar.get(carInfo[i]['name'])) {
                                carCopy.set(carInfo[i]['name'], carInfo[i])
                            } else { // 不存在新增
                                carCopy.set(carInfo[i]['name'], carInfo[i])
                            }
                        }
                        this.carList = this.handleArrayToMap('map', carCopy)

                        if (carInfo.length > 0) {
                            if (this.carList.length === 0) { // 初始化小车
                                this.carList = carInfo
                            } else {
                                if (carInfo.length > 0) {
                                    // 画路线
                                    if (this.showRouter && this.currentCarNo) { // 是否显示与当前双击小车
                                        let currentCarInfo = carInfo.filter(item => {
                                            return item.name === this.currentCarNo
                                        })
                                        if (currentCarInfo.length > 0) {
                                            this.drawRouter(currentCarInfo[0])
                                        }
                                    }
                                    // 最low版本 资源
                                    for (let r = 0; r < this.carList.length; r++) { // 一次传一个车的信息
                                        let res = this.carList[r].resourceNodeList
                                        let carNo = this.carList[r]['name']
                                        if (typeof res !== 'undefined' && res !== null && res.length > 0) {
                                            // 先判断是否需要更新
                                            let resLists = [] // 资源
                                            let str = res[0].replace(/[(|)]/g, "");
                                            let strList = str.split(',')
                                            // 如果真正list第一个点位 与 传来信息相同跳出这个carNo循环
                                            if (this.resList[carNo].length > 0 && this.resList[carNo][0]['x'] === strList[0] && this.resList[carNo][0]['y'] === strList[0]) {
                                                continue;
                                            }
                                            if (res.length === 1) { // 只有一个
                                                let body = {
                                                    x: Number(strList[0]),
                                                    y: Number(strList[1]),
                                                    width: 1.05,
                                                    height: 1.05
                                                }
                                                resLists.push(body)
                                            } else {  // 多个  循环
                                                let len = res.length - 1
                                                for (let re = 0; re < res.length; re++) {
                                                    let item = {}
                                                    let strItem = res[re].replace(/[(|)]/g, "");
                                                    let strItemList = strItem.split(',')
                                                    if (re === len) { // 最后一个
                                                        item = {
                                                            x: Number(strItemList[0]),
                                                            y: Number(strItemList[1]),
                                                            width: 1.05,
                                                            height: 1.05
                                                        }
                                                    } else {  // 开始和中间
                                                        let right = '(' + Number(strItemList[0]) + ',' + (Number(strItemList[1]) + 1) + ',' + this.floorNum + ')'
                                                        let left = '(' + Number(strItemList[0]) + ',' + (Number(strItemList[1]) - 1) + ',' + this.floorNum + ')'
                                                        let top = '(' + (Number(strItemList[0]) - 1) + ',' + Number(strItemList[1]) + ',' + this.floorNum + ')'
                                                        let bottom = '(' + (Number(strItemList[0]) + 1) + ',' + Number(strItemList[1]) + ',' + this.floorNum + ')'
                                                        let nextStr = res[re + 1].replace(/[(|)]/g, "");
                                                        let nextStrItem = nextStr.split(',')
                                                        if (right === res[re + 1]) { // 下一个在右边
                                                            item = {
                                                                x: Number(strItemList[0]),
                                                                y: Number(strItemList[1]),
                                                                width: 2.05,
                                                                height: 1.05
                                                            }
                                                        } else if (left === res[re + 1]) { // 下一个在左边 y - this.interval
                                                            item = {
                                                                x: Number(strItemList[0]),
                                                                y: Number(nextStrItem[1]) + 0.45,
                                                                width: 2.05,
                                                                height: 1.05
                                                            }
                                                        } else if (top === res[re + 1]) { // 下一个在上面 x - this.interval
                                                            item = {
                                                                x: Number(nextStrItem[0]) + 0.49,
                                                                y: Number(strItemList[1]),
                                                                width: 1.05,
                                                                height: 2.05
                                                            }
                                                        } else if (bottom === res[re + 1]) { // 下一个在下面
                                                            item = {
                                                                x: Number(strItemList[0]),
                                                                y: Number(strItemList[1]),
                                                                width: 1.05,
                                                                height: 2.1
                                                            }
                                                        }
                                                    }
                                                    resLists.push(item)
                                                }
                                            }
                                            // 处理this.resList
                                            this.resList[carNo] = resLists // 替换
                                        } else {
                                            // 如果没有资源删除 返回true与false
                                            delete this.resList[carNo]
                                        }
                                    }
                                    // 处理资源锁定  海康
                                    // for (let r = 0; r < this.carList.length; r++) {
                                    //   let res = this.carList[r].resourceNodeList
                                    //   if (typeof res !== 'undefined' && res !== null && res.length > 0) {
                                    //     let topXY = '(' + (this.carList[r].x - 1) + ',' + (this.carList[r].y) + ',' + (this.carList[r].z) + ')' // (x-1, y, z)
                                    //     let bottomXY = '(' + (this.carList[r].x + 1) + ',' + (this.carList[r].y) + ',' + (this.carList[r].z) + ')' // (x+1, y, z)
                                    //     let leftXY = '(' + (this.carList[r].x) + ',' + (this.carList[r].y - 1) + ',' + (this.carList[r].z) + ')' // (x, y - 1, z)
                                    //     let rightXY = '(' + (this.carList[r].x) + ',' + (this.carList[r].y + 1) + ',' + (this.carList[r].z) + ')' // (x, y + 1, z)
                                    //     // this.carList[r].isTop = 0
                                    //     // this.carList[r].isBottom = 0
                                    //     // this.carList[r].isRight = 1
                                    //     // this.carList[r].isLeft = 0
                                    //     if (res[0] == topXY) { // 向上
                                    //       this.carList[r].isTop = 1
                                    //     }
                                    //     if (res[0] == bottomXY) { //
                                    //       this.carList[r].isBottom = 1
                                    //     }
                                    //     if (res[0] == leftXY) {
                                    //       this.carList[r].isLeft = 1
                                    //     }
                                    //     if (res[0] == rightXY) {
                                    //       this.carList[r].isRight = 1
                                    //     }
                                    //     this.carList[r].size = res.length
                                    //   } else {
                                    //     this.carList[r].size = 0
                                    //     this.carList[r].isTop = 0
                                    //     this.carList[r].isBottom = 0
                                    //     this.carList[r].isRight = 0
                                    //     this.carList[r].isBottom = 0
                                    //   }
                                    // }
                                }
                            }
                            this.$emit('on-websocket', this.carList)
                        } else {
                            console.log('小车信息为空，或webSocket数据中没有当前楼层' + this.floorNum + '小车');
                        }
                    } else {
                        console.log('小车信息为空');
                    }
                    // 处理有货点位
                    if (typeof dataList.goodInfo !== 'undefined' && dataList.goodInfo.length > 0) {
                        let goodsInfo = dataList.goodInfo.filter(item => {
                            return item.z === this.floorNum
                        })
                        if (goodsInfo.length > 0) {
                            for (let g = 0; g < goodsInfo.length; g++) {
                                let key = goodsInfo[g].x + ',' + goodsInfo[g].y + ',' + goodsInfo[g].z
                                if (goodsInfo[g].emptyFlag == 1) { // 空了
                                    if (this.goodMapList.get(key)) {
                                        this.goodMapList.delete(key)
                                    }
                                } else { // 有货
                                    if (this.goodMapList.get(key)) {
                                        this.goodMapList.delete(key)
                                        this.goodMapList.set(key, goodsInfo[g])
                                    } else {
                                        this.goodMapList.set(key, goodsInfo[g])
                                    }
                                }
                            }
                            this.emptyFlagList = []
                            this.goodMapList.forEach(item => {
                                this.emptyFlagList.push(item)
                            })
                            this.drawAllGood(this.emptyFlagList)
                        } else {
                            console.log('货物信息为空，或webSocket数据中没有当前楼层' + this.floorNum + '货物');
                        }
                    } else {
                        console.log('货物信息为空');
                    }
                } else {
                    console.log('webSocket信息为空 ' + msg);
                }
            },
            handleArrayToMap(val, dataList) {
                if (val === 'array') { // array -> map
                    let map = new Map();
                    if (dataList.length > 0) {
                        for (let i = 0; i < dataList.length; i++) {
                            if (!map.get(dataList[i].name)) { // 车号作为属性
                                map.set(dataList[i].name, dataList[i])
                            }
                        }
                    }
                    return map
                } else { // map -> array
                    let arr = []
                    dataList.forEach(item => {
                        arr.push(item)
                    })
                    return arr
                }
            },
            // webSocket连接失败或断开  10次连接不上停止连接
            againWebSocketConnect() {
                let that = this
                console.log('尝试连接失败');
                if (this.connNum < 10) {
                    console.log('尝试连接次数' + this.connNum);
                    that.setWebSocket()
                    this.connNum += 1
                }
            },
            // 切换地图或楼层重置数据
            initGridData() {
                this.carList = [] // 小车数据
                let canvas = document.getElementById('canvasLock') // 清除查询
                if (this.lockCan) {
                    this.lockCan.clearRect(0, 0, canvas.width, canvas.height)
                }
                let router = document.getElementById('router') // 清除路线
                if (this.routerCan) {
                    this.routerCan.clearRect(0, 0, router.width, router.height)
                }
                this.currentCarNo = null
                this.showRouter = false
                let empty = document.getElementById('empty') // 清除有货
                if (this.emptyCan) {
                    this.emptyCan.clearRect(0, 0, empty.width, empty.height)
                }
            }
        },
        mounted() {
            // this.drawCtx()
            this.getAllNodeData()
        },
        beforeDestroy() {
            if (this.socket) {
                this.socket.send('close')
                this.socket.close();
            }
        },
        watch: {
            showLockNode(newVal) {
                if (newVal) {
                    this.getLockNode()
                } else {
                    if (this.lockCan) {
                        let canvas = document.getElementById('canvasLock')
                        this.lockCan.clearRect(0, 0, canvas.width, canvas.height)
                    }
                }
            },
            interval(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    this.robotTransfrom = false
                    this.getAllNodeData()
                    if (this.showLockNode) {
                        this.getLockNode()
                    }
                }
            },
            isSave(newVal) {
                if (newVal) {
                    this.getAllNodeData()
                    this.$emit('update:isSave', false)
                }
            },
            floorNum(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    if (!this.notConnect) {
                        this.socket.send(this.mapCode + ',' + this.floorNum)
                    }
                    this.initGridData()
                    this.getAllNodeData()
                }
            },
            mapCode(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    if (!this.notConnect) {
                        this.socket.send(this.mapCode + ',' + this.floorNum)
                    }
                    this.initGridData()
                    this.getAllNodeData()
                }
            }
        }
    }
</script>

<style scoped>
</style>
