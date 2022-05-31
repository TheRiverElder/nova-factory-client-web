
const translations = {
    CoolingBlockCell: "冷却块",
    GeneratorCell: "发电机",
    NeutronMirrorCell: "中子反射镜",
    NuclearRodCell: "核燃料棒",
    RadiationSourceCell: "中子源",
    SlowingRowCell: "减速棒",
    SLEEPING: "睡眠",
    WORKING: "工作中",
    BREAKING: "损毁中",
    BROKEN: "已损毁",
    running: "运行中",
    sleeping: "休眠中",
    cancel: "取消",
    set: "设置",
    turn_on: "启动",
    turn_off: "关闭",
};

export function translate(src: string): string {
    return translations[src] || src;
}