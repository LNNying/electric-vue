let util = {};

/**
 * 处理小车状态
 */
util.handleCarState = (type) => {
    let name = ''
    switch (type) {
        case 'RUNING':
            name = '行驶中';
            break;
        case 'MOVING':
            name = '动作中';
            break;
        case 'READY':
            name = '就绪';
            break;
        case 'PAUSE':
            name = '暂停';
            break;
        case 'CHARGING':
            name = '充电中';
            break;
        case 'ERROR':
            name = '故障';
            break;
        case 'ERROR_DRIVER':
            name = '驱动器故障';
            break;
        case 'OFF_LINE':
            name = '离线';
            break;
        case 'DISABLE':
            name = '禁用';
            break;
        case 'NODE_STANDBY':
            name = '待命中';
            break;
        case 'UNKNOWN':
            name = '未知';
            break;
        default:
            name = '未知';
            break;
    }
    return name;
}
util.warn = (msg, millisecond = 1) => {
    millisecond = millisecond <= 3 ? 4 : 5
    return this.$Notice.warning({
        title: '提示',
        desc: msg,
        duration: millisecond
    })
}
util.error = (error, millisecond = 1) => {
    millisecond = millisecond <= 3 ? 4 : 5
    return this.$Notice.error({
        title: '提示',
        desc: error,
        duration: millisecond
    })
}
util.success = (msg, millisecond = 1) => {
    millisecond = millisecond <= 3 ? 4 : 5
    return this.$Notice.success({
        title: '提示',
        desc: msg,
        duration: millisecond
    })
}
util.loginOut = () => {
    // this.$Modal.confirm({
    //     title: '提示',
    //     content: '网络错误或服务器崩溃！！！',
    //     okText: '退出系统',
    //     cancelText: '取消',
    //     onOk: () => {
    //
    //     },
    //     onCancel: () => {
    //         return false
    //     }
    // })
}
util.isEmpty = (val) => {
    if (val === '' || val === null) {
        return true
    } else {
        return false
    }
}


export default util;
