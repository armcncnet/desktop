<template>
    <router-view ref="routerView" v-slot="{Component}">
        <component :is="Component" :cnc="cncData" />
    </router-view>
</template>

<script lang="ts">
import {ref, defineComponent} from "vue";
import {ElLoading} from "element-plus";
export default defineComponent({
    name: "App",
    emits: [],
    props: [],
    components: {},
    setup(props, context) {

        const cncData: any = ref({
            loading: ElLoading.service({
                lock: true,
                background: "rgba(0, 0, 0, .01)",
            }),
            sleep: false, // 控制休眠状态
            fullscreen: false, // 全屏状态切换
            platform: "-",
            screen: {
                width: "-",
                height: "-"
            },
            device: {
                ip: "",
                ips: [],
                loading: false,
                status: false,
                message: {
                    port: 10081,
                    socket: false,
                    status: false,
                    data: {
                        basicInfo: false
                    }
                },
                camera: {
                    port: 10091,
                    socket: false,
                    status: false
                },
                machine: {
                    path: "",
                    info: false
                }
            },
            header: {
                dialog: {
                    type: "",
                    status: false,
                    config: {
                        title: "",
                        width: "",
                        close: true
                    },
                    form: {
                        loading: false
                    }
                },
                centre: {
                    start: "",
                    next: "",
                    pause: "",
                    stop: "",
                },
                right: {
                    estop: "",
                    enabled: "",
                    limit: ""
                }
            },
            navigation: {
                select: "console"
            },
            console: {
                right: {
                    is_first: true,
                    axis: [
                        {
                            name: "X",
                            value: 0.000,
                            home: 0
                        },
                        {
                            name: "Y",
                            value: 0.000,
                            home: 0
                        },
                        {
                            name: "Z",
                            value: 0.000,
                            home: 0
                        },
                        {
                            name: "B",
                            value: 0.000,
                            home: 0
                        },
                        {
                            name: "C",
                            value: 0.000,
                            home: 0
                        }
                    ],
                    coordinate: {
                        value: 0,
                        options: [
                            {
                                label: "P0 G53",
                                value: 0
                            },
                            {
                                label: "P1 G54",
                                value: 1
                            },
                            {
                                label: "P2 G55",
                                value: 2
                            },
                            {
                                label: "P3 G56",
                                value: 3
                            },
                            {
                                label: "P4 G57",
                                value: 4
                            },
                            {
                                label: "P5 G58",
                                value: 5
                            },
                            {
                                label: "P6 G59",
                                value: 6
                            },
                            {
                                label: "P7 G59.1",
                                value: 7
                            },
                            {
                                label: "P8 G59.2",
                                value: 8
                            },
                            {
                                label: "P9 G59.3",
                                value: 9
                            }
                        ]
                    },
                    step: {
                        value: -1,
                        items: [
                            {
                                label: "10",
                                value: 10
                            },
                            {
                                label: "5",
                                value: 5
                            },
                            {
                                label: "1",
                                value: 1
                            },
                            {
                                label: "0.5",
                                value: 0.5
                            },
                            {
                                label: "0.1",
                                value: 0.1
                            },
                            {
                                label: "0.05",
                                value: 0.05
                            },
                            {
                                label: "0.01",
                                value: 0.01
                            }
                        ]
                    },
                    rocker: [
                        {
                            name: "",
                            value: "",
                            arrow: "",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "up",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "up",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "left",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "down",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "right",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "down",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "left",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "right",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "left",
                            hide: true,
                        },
                        {
                            name: "",
                            value: "",
                            arrow: "right",
                            hide: true,
                        }
                    ],
                    home: "",
                    zero: "",
                    spindle: {
                        enabled: 0,
                        direction: 0,
                        min_speed: 0,
                        max_speed: 0,
                        speed_tmp: 0,
                        speed: 0,
                        min_override: 0,
                        max_override: 0,
                        override: 100
                    },
                    feed: {
                        override: 100,
                        max_override: 0
                    },
                    ext_info: {
                        max_override: 0,
                        default_override: 0,
                        max_linear_velocity: 0,
                        default_linear_velocity: 0,
                        max_angular_velocity: 0,
                        default_angular_velocity: 0
                    }
                }
            },
            machine: {
                loading: false,
                search_keyword: "",
                items: [],
                item: false,
                item_loading: false,
            },
            layer: {
                select: false
            }
        });

        return {
            props,
            cncData
        }
    }
});
</script>

<style>
@import "./assets/css/base.scss";
@import "./assets/css/element.scss";
@import "./assets/css/editor.scss";
</style>
