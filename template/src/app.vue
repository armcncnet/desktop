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
                message: {
                    port: 10081,
                    socket: false,
                    status: false,
                    data: {
                        basicInfo: false
                    }
                },
                camera: {
                    port: 8080,
                    socket: false,
                    status: false
                },
                machine: {
                    status: false,
                    config: false
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
                select: "device"
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
</style>
