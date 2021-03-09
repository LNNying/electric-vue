<template>
    <div class="lnn-stacker-map-outer" ref="scroll">
        <div style="position: fixed;right: 2px;top: 2px;">
            <Button size="small" type="success" @click="exitSys">退出系统</Button>
        </div>
        <div class="lnn-tip-info">
            <div class="lnn-task-info">
                <p>任务总数&nbsp;&nbsp;<span>{{infoObj.taskNum}}</span></p>
                <p>查看详情>>></p>
            </div>
            <div class="lnn-warn-info">
                <p>告警信息</p>
                <p>查看详情>>></p>
            </div>
        </div>
        <!--操作界面-->
        <div  class="lnn-oper">
            <div class="lnn-state">
                <div :style="{backgroundColor: 'green'}"></div>
                <div>在线&nbsp;&nbsp;设备编号&nbsp;{{handleInfoData(clickCarObj.code)}}</div>
            </div>
            <div class="lnn-close" @click="closeInfo"></div>
            <div class="lnn-oper-info">
                <div class="lnn-ele">
                    <img src="../../assets/ele.png" style="width: 76px;height: 137px">
                    <div style="font-size: 24px; color: rgb(84, 213, 149);">&nbsp;70%</div>
                    <div style="font-size: 12px; color: rgb(46,55,213);">&nbsp;&nbsp;剩余电量</div>
                </div>
                <div class="lnn-starker-info" style="text-align: center">
                    <Row :gutter="5" style="margin-top: 10px">
                        <i-col span="6"><span class="botton-border">设备IP</span></i-col>
                        <i-col span="6"><span class="botton-border">执行状态</span></i-col>
                        <i-col span="6"><span class="botton-border">res状态</span></i-col>
                        <i-col span="6"><span class="botton-border">process状态</span></i-col>
                    </Row>
                    <Row :gutter="5" style="margin-top: 10px; text-align: center">
                        <i-col span="6">{{handleInfoData(clickCarObj.ip)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.state)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.resState)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.processState)}}</i-col>
                    </Row>
                    <Row :gutter="5" style="margin-top: 30px; text-align: center">
                        <i-col span="6"><span class="botton-border">设备名称</span></i-col>
                        <i-col span="6"><span class="botton-border">托盘编号</span></i-col>
                        <i-col span="6"><span class="botton-border">起始位置</span></i-col>
                        <i-col span="6"><span class="botton-border">目标位置</span></i-col>
                    </Row>
                    <Row :gutter="5" style="margin-top: 10px; text-align: center">
                        <i-col span="6">{{handleInfoData(clickCarObj.name)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.traceCode)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.startPoint)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.endPoint)}}</i-col>
                    </Row>
                    <Row :gutter="5" style="margin-top: 30px; text-align: center">
                        <i-col span="6"><span class="botton-border">点位条码</span></i-col>
                        <i-col span="6"><span class="botton-border">托盘状态</span></i-col>
                        <i-col span="6"><span class="botton-border">是否可用</span></i-col>
                        <i-col span="6"><span class="botton-border">任务编号</span></i-col>
                    </Row>
                    <Row :gutter="5" style="margin-top: 10px; text-align: center">
                        <i-col span="6">{{handleInfoData(clickCarObj.nodeCode)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.traceState)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.enableFlag)}}</i-col>
                        <i-col span="6">{{handleInfoData(clickCarObj.taskNo)}}</i-col>
                    </Row>
                </div>
            </div>
            <div class="lnn-oper-but">
                <Row :gutter="5" style="margin-top: 10px;text-align: center">
                    <i-col span="6">
                        <Button size="small" type="success">车体恢复</Button>
                    </i-col>
                    <i-col span="6">
                        <Button size="small" type="success">同步设备位置</Button>
                    </i-col>
                    <i-col span="6">
                        <Button size="small" type="success">同步设备位置</Button>
                    </i-col>
                    <i-col span="6">
                        <Button size="small" type="success">同步设备位置</Button>
                    </i-col>
                </Row>
                <Row :gutter="5" style="margin-top: 20px; text-align: center">
                    <i-col span="6">
                        <Button size="small" type="success">车体恢复</Button>
                    </i-col>
                    <i-col span="6">
                        <Button size="small" type="success">同步设备位置</Button>
                    </i-col>
                    <i-col span="6">
                        <Button size="small" type="success">同步设备位置</Button>
                    </i-col>
                    <i-col span="6">
                        <Button size="small" type="success">同步设备位置</Button>
                    </i-col>
                </Row>
            </div>
            <div class="lnn-oper-inp">
                <Row :gutter="5" style="text-align: center">
                    <i-col span="7">
                        <Input size="small" placeholder="输入起点"></Input>
                    </i-col>
                    <i-col span="7">
                        <Input size="small" placeholder="输入终点"></Input>
                    </i-col>
                    <i-col span="7">
                        <Input size="small" placeholder="输入托盘号"></Input>
                    </i-col>
                    <i-col span="3">
                        <Button size="small" type="primary">入库</Button>
                    </i-col>
                </Row>
                <Row :gutter="5" style="text-align: center;margin-top: 20px">
                    <i-col span="7">
                        <Input size="small" placeholder="输入起点"></Input>
                    </i-col>
                    <i-col span="7">
                        <Input size="small" placeholder="输入终点"></Input>
                    </i-col>
                    <i-col span="7">
                        <Input size="small" placeholder="输入托盘号"></Input>
                    </i-col>
                    <i-col span="3">
                        <Button size="small" type="primary">出库</Button>
                    </i-col>
                </Row>
                <Row :gutter="5" style="text-align: center;margin-top: 20px">
                    <i-col span="7">
                        <Input size="small" placeholder="选择坐标"></Input>
                    </i-col>
                    <i-col span="3">
                        <Button size="small" type="primary">移动</Button>
                    </i-col>
                </Row>
            </div>
        </div>
        <div class="lnn-floor">
            <div class="lnn-floor-outer">
                <div ref="floor" class="lnn-floor-num" v-for="(item, index) in floorList" :style="{backgroundColor: item == floorNum ? '#ffbd13' : '#46e0f9'}"
                     :key="index" @click="clickFloor(item)">{{item + 'F'}}</div>
            </div>
        </div>
        <!--地图-->
        <div v-loading="loading" :style="{position: 'absolute', width: width * interval + 'px', height: interval * height + 'px', zIndex: 200, left: mapOffset.x + 'px'}" @mousedown="down">
            <div class="lnn-stacker-car-outer" :style="{transform: `translate(0,${ height * interval})`,width: width * interval + 'px', height: interval * height + 'px'}">
                <div :class="{'lnn-stacker-car': true, 'robot-transform': robotTransfrom}" v-for="(item, index) in carList" :key="index"
                     :style="{top: item['ly'] * interval * offset + 'px', left: item['lx'] * interval * offset + 'px',
            width: interval + 'px', height: interval + 'px'}" @click="clickCar(item)" :ref="item.code"></div>
            </div>
        </div>
        <canvas id="router" :width="width * interval" :height="interval * height" :style="{left: mapOffset.x + 'px'}"></canvas>
        <canvas id="good" :width="width * interval" :height="interval * height" :style="{left: mapOffset.x + 'px'}"></canvas>
        <canvas id="stackerFrame" :width="width * interval" :height="interval * height" :style="{left: mapOffset.x + 'px'}"></canvas>
        <canvas id="stacker" :width="width * interval" :height="interval * height" :style="{left: mapOffset.x + 'px'}"></canvas>
    </div>
</template>

<script>
    import _ from 'lodash'
    import stackerImg  from '../../assets/stacker.png'
    export default {
        name: "stacker-map",
        data() {
            return {
                infoObj: {
                    taskNum: 20,
                },
                showInfo: false,
                trackList: [3, 8, 13, 18, 23, 32, 37, 42, 47, 52],
                floorNum: 1,
                floorList: [],
                clickCarObj: {},
                mapCode: 1,
                width: 64,
                height: 85,
                interval: 15,
                offset: 1.1,
                connNum: 0,
                addYNum: 1,
                reduceYNum: 1,
                loading: false,
                stackerCan: null,
                stackerDom: null,
                stackerFrameDom: null,
                stackerFrameCan: null,
                routerDom: null,
                routerCan: null,
                goodDom: null,
                goodCan: null,
                stackerImg: stackerImg,
                stackerUrl: this.$stacketSocketUrl,
                robotTransfrom: true,
                nodeList: [],
                carList: [],
                carCloneList: {},
                routerObj: {},
                goodObj: {},
                mapOffset: {
                    x: 60
                },
                url: {
                    getNodeUrl: this.$stacker + '/stackerNode/getNodeData',
                    getFloorUrl: this.$stacker + '/stackerNode/getFloorNum'
                }
            }
        },
        methods: {
            handleInfoData(info) {
                return typeof info === 'undefined' || info === null || info === '' ? '--' : info;
            },
            closeInfo() {
                this.showInfo = true;
            },
            exitSys() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否退出系统？',
                    onOk: () => {
                        this.$router.push({
                            name: 'login'
                        });
                        this.$Notice.success({
                            title: '提示',
                            desc: '退出成功',
                            duration: 5
                        });
                    },
                    onCancel: () => {
                        return false
                    }
                })
            },
            // 点击楼层
            clickFloor(floorNum) {
                if (floorNum == this.floorNum) {
                    return
                }
                this.floorNum = floorNum;
                this.getNodeData();
                this.structureGood(this.goodObj);
                this.structureRouter(this.routerObj);
                this.stackerFrameCan.clearRect(0, 0, this.stackerFrameDom.width, this.stackerFrameDom.height);
            },
            // 点击小车
            clickCar(car) {
                this.clickCarObj = car;
                this.clearCarBck();
                this.$refs[car.code][0].style.boxShadow = '-1px -1px 10px 4px #d80304';
            },
            // 点击
            down(event) {
                let loc = this.windowToCanvas(this.stackerDom, event.offsetX + this.mapOffset.x, event.offsetY);
                let x = parseInt(loc.x);
                let y = parseInt(loc.y);
                this.stackerFrameCan.clearRect(0, 0, this.stackerFrameDom.width, this.stackerFrameDom.height);
                this.drawFrame(this.stackerFrameCan, x, y, this.interval, this.interval, this.interval);
            },
            // 计算坐标
            windowToCanvas(canvas, x, y) {
                let bbox = canvas.getBoundingClientRect();
                let clickX = x - bbox.left * (canvas.width / bbox.width);
                let clickY = y - bbox.top * (canvas.height / bbox.height);
                return {
                    x: clickX / (this.offset * this.interval),
                    y: y / (this.offset * this.interval)
                };
            },
            // 清除小车
            clearCarBck () {
                if (this.carList.length > 0) {
                    for (let i = 0; i < this.carList.length; i++) {
                        this.$refs[this.carList[i].code][0].style.boxShadow = ''
                    }
                }
            },
            // 整合数据
            structureMap(list) {
                this.stackerCan.clearRect(0, 0, this.stackerDom.width, this.stackerDom.height);
                for (let i = 0, len = list.length; i < len; i++) {
                    let body = {
                        x: list[i].lx,
                        y: list[i].ly,
                        z: list[i].lz,
                        type: list[i].nodeType,
                        fullFlag: list[i].fullFlag,
                        nodeSpan: list[i].nodeSpan,
                        nodeDirection: list[i].nodeDirection
                    };
                    this.drawMap(body, this.stackerCan);
                }
                // 画轨道
                this.structureTrack(this.trackList);
            },
            // 绘制点击
            drawFrame(ctx, x, y, w, h, interval) {
                this.$nextTick(() => {
                    for (let i = 0, len = this.nodeList.length; i < len; i++) {
                        if (x == this.nodeList[i]['lx'] && y == this.nodeList[i]['ly']) {
                            let startX = x * interval * this.offset;
                            let startY = y * interval * this.offset;
                            let nodeSpan = this.nodeList[i].nodeSpan;
                            let nodeDirection = this.nodeList[i].nodeDirection;
                            if (!!nodeSpan && !!nodeDirection) {
                                if (nodeDirection == 1) { // top
                                    y = y - h * (Number(nodeSpan) - 1);
                                    h = Number(nodeSpan) * h;
                                } else if (nodeDirection == 2) { // right
                                    w = Number(nodeSpan) * w
                                } else if (nodeDirection == 3) { // bottom
                                    h = Number(nodeSpan) * h;
                                } else if (nodeDirection == 4) { // left
                                    w = Number(nodeSpan) * w;
                                    x = x + w * (Number(nodeSpan) - 1);
                                }
                            }
                            ctx.save();
                            ctx.strokeStyle = 'red';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(startX, startY, w, h);
                            ctx.restore();
                        }
                    }
                })
            },
            // 画路线
            structureRouter(data) {
                this.routerCan.clearRect(0, 0, this.routerDom.width, this.routerDom.height);
                for (let item in data) {
                    let info = data[item];
                    let obj = {};
                    if (info.taskType !== '' && !!info.taskType && info.z == this.floorNum) {
                        obj.carX = info['x'] * this.interval * this.offset;
                        obj.startX = info['startX'] * this.interval * this.offset;
                        obj.startY = info['startY'] * this.interval * this.offset;
                        obj.endX = info['endX'] * this.interval * this.offset;
                        obj.endY = info['endY'] * this.interval * this.offset;
                        obj.ctx = this.routerCan;
                        obj.interval = this.interval;
                        this.drawRouter(obj);
                    }
                }
            },
            structureGood(obj) {
                this.goodCan.clearRect(0, 0, this.goodDom.width, this.goodDom.height);
                for (let item in obj) {
                    if (obj[item].z == this.floorNum) {
                        this.drawMap(obj[item], this.goodCan, 'good')
                    }
                }
            },
            // 画轨道
            structureTrack(trackList) {
                for (let i = 0; i < trackList.length; i++) {
                    let body = {
                        x: trackList[i],
                        y: 0
                    };
                    this.drawMap(body, this.stackerCan, 'track')
                }
            },
            // 绘制地图入口
            drawMap(data, ctx, type) {
                let startX = data['x'] * this.interval * this.offset;
                let startY = data['y'] * this.interval * this.offset;
                if (type === 'good') {
                    this.drawGood(startX, startY, this.interval, this.interval, ctx, '#ff9007', '##c0ffe3a')
                } else if (type === 'track') {
                    this.drawTacke(startX, startY, ctx, this.stackerDom, this.interval);
                } else {
                    switch (data.type) {
                        case '0': //储位
                            this.drawStorage(startX, startY, this.interval, this.interval, ctx, '#50babe', 'rgb(134, 221, 255)',);
                            break;
                        case '1': //通用站台
                            this.drawRect(startX, startY, this.interval, this.interval, ctx, 'skyblue', 'rgb(59, 223, 255)');
                            break;
                        case '11': //入站台
                            this.drawRect(startX, startY,  this.interval,  this.interval, ctx, '#ffcb8b', 'rgb(59, 223, 255)');
                            break;
                        case '12': //出站台
                            this.drawRect(startX, startY, this.interval, this.interval, ctx, '#8aff8f', 'rgb(59, 223, 255)');
                            break;
                        case '2': // 输送线
                            this.drawWorkLine(startX, startY, this.interval, this.interval, ctx, '#0a9cff', 'rgb(59, 223, 255)', data.nodeSpan, data.nodeDirection);
                            break;
                        case '3': // 通用库口
                            this.drawRect(startX, startY, this.interval,this.interval, ctx, '#bcff09', 'rgb(59, 223, 255)');
                            break;
                        case '31': // 入库口
                            this.drawRect(startX, startY, this.interval, this.interval, ctx, '#26ffce', 'rgb(59, 223, 255)');
                            break;
                        case '32': // 出库口
                            this.drawRect(startX, startY, this.interval, this.interval, ctx, '#74ffcb', 'rgb(59, 223, 255)');
                            break;
                        case '9': // 禁用
                            this.drawRect( startX, startY, this.interval, this.interval, ctx, '#d1c1cd', 'rgb(59, 223, 255)', '9');
                            break;
                        default:
                            console.log('错误类型' + type);
                            break
                    }
                }
            },
            jsonToArray(obj) {
                let arr = [];
                for (let item in obj) {
                    arr.push(obj[item]);
                }
                return arr;
            },
            handleGood(goodList) {
                for (let i = 0, len = goodList.length; i < len; i++) {
                    let key = goodList[i].lx + ',' + goodList[i].ly + ',' + goodList[i].lz;
                    if (goodList[i].fullFlag != 0) {
                        this.goodObj[key] = {
                            x: goodList[i].lx,
                            y: goodList[i].ly,
                            z: goodList[i].lz,
                            fullFlag: goodList[i].fullFlag
                        };
                    } else {
                        delete this.goodObj[key];
                    }
                }
                this.structureGood(this.goodObj);
            },
            /**
             * 所有数据将根据 层级获取数据
             * 货物推送
             *
             * @param data
             */
            handleCarInfo(data) {
                let msg = JSON.parse(data);
                console.log(data);
                if (typeof msg.stackInfo !== 'undefined') {
                    if (!!Object.keys(msg.stackInfo).length) {
                        let stackerInfo = msg.stackInfo;
                        // 处理堆垛机
                        this.carCloneList[stackerInfo.code] = stackerInfo;
                        this.carList = this.jsonToArray(this.carCloneList);
                        this.routerObj[stackerInfo.code] = {
                            code: stackerInfo.code,
                            x: stackerInfo.lx,
                            z: stackerInfo.lz,
                            startX: stackerInfo.loadLx,
                            startY: stackerInfo.loadLy,
                            endX: stackerInfo.dischargeLx,
                            endY: stackerInfo.dischargeLy,
                            taskType: stackerInfo.taskType
                        };
                        this.structureRouter(this.routerObj);
                    } else {
                        console.log('堆垛机推送信息为空');
                    }
                } else if (typeof msg.goodInfo !== 'undefined') {
                    if (!!msg.goodInfo.length) {
                        this.handleGood(msg.goodInfo);

                    } else {
                        console.log('货物推送信息为空');
                    }
                } else if (typeof msg.lineInfo !== 'undefined') {
                    if (!!Object.keys(msg.lineInfo).length) {

                    } else {
                        console.log('输送线推送信息为空');
                    }
                } else {
                    console.log("推送信息不属于任何设备信息-->" + msg);
                }
            },
            // 连接socket
            setWebSocket() {
                let that = this;
                if (!that.socket) {
                    if ('WebSocket' in window) {
                        console.log('当前浏览器支持WebSocket');
                        that.socket = new WebSocket(this.stackerUrl);
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
                        };
                        // 接收信息
                        that.socket.onmessage = function (e) {
                            let message = e.data;
                            // console.log('socket接收到的数据为' + message);
                            if (message !== '' && message !== null) {
                                // console.log('socket接收到的数据为' + message);
                                // 处理方法
                                that.handleCarInfo(message)
                            } else {
                                console.log('socket通信接收到的数据为空');
                            }
                        };
                        // 连接关闭回调
                        that.socket.onclose = function (e) {
                            console.log('连接被关闭');
                            console.log(e);
                        };
                        // 连接失败回调
                        that.socket.onerror = function (ev) {
                            that.$warn('WebSocket建立连接失败', 3);
                            that.notConnect = true;
                            console.log('建立连接失败');
                        };
                    } else {
                        that.$warn('当前浏览器不支持WebSocket', 3);
                        console.log('当前浏览器不支持WebSocket');
                    }
                }
            },
            againWebSocketConnect () {
                let that = this;
                console.log('尝试连接失败');
                if (this.connNum < 10) {
                    this.connNum += 1;
                    console.log('尝试连接次数' + this.connNum);
                    that.setWebSocket();
                    that.$warn('WebSocket建立连接失败，次数' + this.connNum, 3);
                } else {
                    that.$warn('WebSocket建立连接失败，次数已超过10次，请检查服务器是否正常！！！', 3);
                }
            },
            // 获取总数据
            getNodeData() {
                let data = {
                    mapId: this.mapCode,
                    lz: this.floorNum,
                };
                this.$http.post(this.url.getNodeUrl, data).then(response => {
                    if (response.data.returnCode === 200) {
                        this.loading = true;
                        this.nodeList = response.data.returnData;
                        this.structureMap(_.cloneDeep(this.nodeList));
                        this.simulationClick();
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000)
                    } else {
                        this.$error(response.data.returnMsg, 3);
                    }
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                    this.$loginOut();
                })
            },
            // 获取楼层
            getFloorNumList() {
                this.$http.post(this.url.getFloorUrl, this.mapCode).then(response => {
                    if (response.data.returnCode === 200) {
                        this.floorList = response.data.returnData;
                    } else {
                        this.$error(response.data.returnMsg, 3);
                    }
                }).catch(err => {
                    console.log(err);
                    this.$loginOut();
                })
            },
            // 绘制货物
            drawGood(x, y, w, h, ctx, fillColor, strokeColor) {
                ctx.save();
                let gradient = ctx.createLinearGradient(x, y, x, y + h);
                gradient.addColorStop(1, '#8bbbff');
                gradient.addColorStop(0.5, '#5592ff');
                gradient.addColorStop(0.25, '#498dff');
                gradient.addColorStop(0, '#094dff');
                ctx.fillStyle = gradient;
                ctx.strokeStyle = strokeColor;
                ctx.fillRect(x, y, w, h);
                ctx.stroke();
                ctx.restore();
            },
            // 存储区
            drawStorage(x, y, w, h, ctx, fillColor, strokeColor) {
                ctx.save();
                // ctx.moveTo(x, y);
                // ctx.lineTo(x + w, y + h);
                // ctx.moveTo(x + w, y);
                // ctx.lineTo(x, y + h);
                ctx.fillStyle = fillColor;
                ctx.strokeStyle = strokeColor;
                ctx.fillRect(x, y, w, h);
                ctx.stroke();
                ctx.restore();
            },
            // 绘制方格
            drawRect(x, y, w, h, ctx, fillColor, strokeColor, type) {
                ctx.save();
                if (type !== '9') {
                    ctx.fillStyle = fillColor;
                }
                ctx.strokeStyle = strokeColor;
                ctx.fillRect(x, y, w, h);
                ctx.stroke();
                ctx.restore();
            },
            // 轨道
            drawTacke(x, y, ctx, dom, interval) {
                ctx.save();
                ctx.strokeStyle = '#9df0ff';
                ctx.strokeRect(x + 3, y, interval - 6, dom.height);
                ctx.restore();
            },
            // 输送线
            drawWorkLine(x, y, w, h, ctx, fillColor, strokeColor, nodeSpan, nodeDirection) {
                ctx.save();
                ctx.fillStyle = fillColor;
                ctx.strokeStyle = strokeColor;
                if (nodeDirection == 'Y+') { // top
                    y = y - h * (Number(nodeSpan) - 1);
                    h = Number(nodeSpan) * h;
                } else if (nodeDirection == 'X+') { // right
                    w = Number(nodeSpan) * w
                } else if (nodeDirection == 'Y-') { // bottom
                    h = Number(nodeSpan) * h;
                } else if (nodeDirection == 'X-') { // left
                    w = Number(nodeSpan) * w;
                    x = x + w * (Number(nodeSpan) - 1);
                }
                ctx.fillRect(x, y, w, h);
                ctx.stroke();
                ctx.restore();
            },
            // 绘制路线
            drawRouter(obj) {
                let {carX, startX, startY, endX, endY, ctx, interval} = obj;
                let x = startX + interval / 2;
                let y = startY + interval / 2;
                let cX = carX + interval / 2;
                let dx = endX + interval / 2;
                let dy = endY + interval / 2;
                let width = 4;
                ctx.beginPath();
                ctx.fillStyle = 'red';
                ctx.arc(x, y, interval / 5, 0, 2*Math.PI);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.strokeStyle = '#20fe52';
                ctx.lineWidth = 3;
                ctx.moveTo(x, y);
                ctx.lineTo(cX, y);
                ctx.lineTo(cX, dy);
                ctx.lineTo(dx, dy);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(dx, dy);
                ctx.fillStyle = '#ff212b';
                if (carX > endX) { // 左边
                    ctx.lineTo(dx + width, dy + width);
                    ctx.moveTo(dx, dy);
                    ctx.lineTo(dx + width, dy - width);
                    ctx.lineTo(dx + width, dy + width);
                } else if (carX < endX) { // 右边
                    ctx.lineTo(dx - width, dy + width);
                    ctx.moveTo(dx, dy);
                    ctx.lineTo(dx - width, dy - width);
                    ctx.lineTo(dx - width, dy + width);
                }
                ctx.fill();
                ctx.closePath();
            },
            // 调整canvas坐标
            getCanvas(id, dom, can) {
                this[dom] = document.getElementById(id);
                this[can] = this[dom].getContext('2d');
                this[can].translate(0, this[dom].height);
                this[can].scale(1, -1);
            },
            simulationClick() {
                let a = document.createElement('a');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.getCanvas('stacker', 'stackerDom', 'stackerCan');
                this.getCanvas('stackerFrame', 'stackerFrameDom', 'stackerFrameCan');
                this.getCanvas('router', 'routerDom', 'routerCan');
                this.getCanvas('good', 'goodDom', 'goodCan');
                this.$refs.scroll.scrollTo(0, this.stackerDom.height);
                this.getNodeData();
                this.getFloorNumList();
                this.setWebSocket();
            });
            setInterval(() => {
                this.simulationClick();
            }, 10 * 1000)
        }
    }
</script>

<style scoped>
@import "./index.less";
</style>
