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
                background: "rgba(0, 0, 0, .5)",
                customClass: "cnc",
            }),
            sleep: false, // 控制休眠状态
            fullscreen: false, // 全屏状态切换
            platform: "-",
            screen: {
                width: "-",
                height: "-"
            },
            language: "zh",
            device: {
                ip: "",
                ips: [],
                loading: false,
                status: false,
                restart: false,
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
                    file: "",
                    info: false,
                    linear_units: "-",
                    angular_units: "-"
                }
            },
            header: {
                centre: {
                    start: "disabled",
                    start_disabled: true,
                    pause: "disabled",
                    pause_disabled: true,
                    stop: "disabled",
                    stop_disabled: true,
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
                left: {
                    simulation: {
                        mask: false,
                        current_velocity: 0,
                        velocity: [],
                        g92_offset: [],
                        g5x_offset: [],
                        g_offset: [],
                        dtg_offset: [],
                        box: {
                            x: 0,
                            y: 0,
                            z_min: 0,
                            z_max: 0
                        },
                        tool: {
                            id: 0,
                            offset: 0.000,
                            diameter: 0
                        }
                    }
                },
                right: {
                    is_first: true,
                    axes: [],
                    offset: {
                        index: 0,
                        options: [
                            {
                                label: "坐标系",
                                value: 0,
                                name: "",
                                p_name: ""
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
                    homed: false,
                    relative_offset: "",
                    spindle: {
                        enabled: 0,
                        direction: 0,
                        min_velocity: 0,
                        max_velocity: 0,
                        velocity_tmp: 0,
                        velocity: 0,
                        min_override: 0,
                        max_override: 0,
                        override: 100
                    },
                    feed: {
                        override: 100,
                        max_override: 0
                    },
                    max_linear_velocity: 0,
                    max_velocity: 0,
                    default_linear_velocity: 0,
                    max_angular_velocity: 0,
                    default_angular_velocity: 0
                },
                bottom: {
                    view: "p",
                    line: {
                        loading: false,
                        content: "",
                        tmp_index: 0,
                        tmp: [],
                        items: [],
                        motion_line: 0
                    }
                }
            },
            machine: {
                loading: false,
                search_keyword: "",
                items: [],
                item: false,
                tab: {
                    value: "",
                    items: [],
                    loading: false
                },
                update_loading: false,
                download_loading: false,
            },
            program: {
                loading: false,
                search_keyword: "",
                items: [],
                item: false,
                tab: {
                    value: "",
                    items: [],
                    loading: false
                },
                update_loading: false,
                download_loading: false,
            },
            plugin: {
                loading: false,
                search_keyword: "",
                items: [],
                item: false,
                tab: {
                    value: "",
                    items: [],
                    loading: false
                },
            },
            store: {
                loading: false,
                search_keyword: "",
                items: [],
                item: false
            },
            settings: {
                select: "language",
                backup: {
                    type: "all",
                    items: [],
                    loading: false
                },
                update: {
                    loading: false,
                    armcnc: "",
                    linuxcnc: "",
                    sdk: "",
                    armcnc_version: "",
                    linuxcnc_version: "",
                    sdk_version: ""
                }
            },
            layer: {
                select: false
            },
            dialog: {
                type: "",
                status: false,
                config: {
                    title: "",
                    width: "",
                    close: true
                },
                form: false,
                form_loading: false,
            },
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
