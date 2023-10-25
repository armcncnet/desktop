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
                    status: false
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
                }
            },
            navigation: {
                select: "console"
            },
            console: {
                right: {
                    axes: [
                        {
                            name: "X",
                            value: 0.00
                        },
                        {
                            name: "Y",
                            value: 0.00
                        },
                        {
                            name: "Z",
                            value: 0.00
                        },
                        {
                            name: "B",
                            value: 0.00
                        },
                        {
                            name: "C",
                            value: 0.00
                        }
                    ],
                    coordinate: {
                        value: "P0 G53",
                        options: [
                            {
                                label: "P0 G53",
                                value: "P0 G53"
                            },
                            {
                                label: "P1 G54",
                                value: "P1 G54"
                            }
                        ]
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
