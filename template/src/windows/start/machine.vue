<template>
    <div class="machine-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="item-header">
                <div class="item-header-item">
                    <el-input class="cnc none" v-model="props.cnc.machine.search_keyword" placeholder="请输入关键词" maxlength="140" autocomplete="off" spellcheck="false" clearable />
                </div>
                <div class="item-header-item">
                    <el-tooltip popper-class="cnc" effect="dark" content="新增机床配置" placement="bottom">
                        <el-button class="cnc" :icon="icons.Plus"></el-button>
                    </el-tooltip>
                </div>
            </div>
            <div class="item-footer">
                <div class="item-footer-box" v-if="!props.cnc.machine.loading">
                    <div class="machine-item" :class="props.cnc.machine.item && props.cnc.machine.item.path === item.path ? 'select' : ''" v-for="(item, index) in props.cnc.machine.items" :key="index" v-if="props.cnc.machine.items.length > 0" @click="onSelect(item)">
                        <div class="title">{{item.name}}</div>
                        <div class="describe">{{item.describe}}</div>
                        <div class="tag">
                            <el-tag class="cnc" size="small" style="color: #ffffff; background-color: #5e4eff" v-if="props.cnc.device.machine.path === item.path">
                                <el-icon><Check /></el-icon>
                            </el-tag>
                            <el-tag class="cnc" size="small" v-if="item.control === 0">仿真模拟</el-tag>
                            <el-tag class="cnc" size="small" v-else-if="item.control === 1">GPIO</el-tag>
                            <el-tag class="cnc" size="small" v-else-if="item.control === 2">Arduino</el-tag>
                            <el-tag class="cnc" size="small" v-else-if="item.control === 3">MACH3</el-tag>
                            <el-tag class="cnc" size="small" v-else-if="item.control === 4">EtherCAT</el-tag>
                            <el-tag class="cnc" size="small" v-else>-</el-tag>
                            <el-tag class="cnc" size="small">{{item.coordinate}}</el-tag>
                        </div>
                    </div>
                    <el-empty class="cnc none" :image-size="30" v-else/>
                </div>
                <div class="loading-view" v-else>
                    <el-icon class="is-loading"><Loading /></el-icon>
                </div>
            </div>
        </div>
        <div class="item">
            <el-empty class="cnc none" :image-size="30" v-if="!props.cnc.machine.item && !props.cnc.machine.item_loading"/>
            <EditorMachine ref="editorMachine" :cnc="props.cnc" v-else/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import EditorMachine from "./machine/editor.vue";
export default defineComponent({
    name: "MachineStart",
    emits: [],
    props: ["cnc"],
    components: {
        EditorMachine
    },
    setup(props, context) {

        // 消息事件
        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_machine"){
                onData();
            }
        });

        function onData(){
            props.cnc.machine.items = [];
            props.cnc.machine.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/machine/select", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.machine.items = response.data.machine;
                        props.cnc.machine.loading = false;
                    }else{
                        props.cnc.machine.loading = false;
                    }
                }else{
                    props.cnc.machine.loading = false;
                }
            });
        }

        function onSelect(item: any){
            if(props.cnc.machine.item && props.cnc.machine.item.path === item.path){
                return;
            }
            props.cnc.machine.item = false;
            setTimeout(()=>{
                props.cnc.machine.item = item;
            }, 50);
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onSelect
        }
    }
});
</script>

<style scoped>
.machine-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    display: none;
}
.machine-view.machine{
    display: block;
}
.machine-view .item{
    width: calc(100% - 240px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.machine-view .item:first-child{
    width: 240px;
    background-color: rgba(43, 45, 48, .5);
    border-right: solid 1px rgba(30, 31, 34, 1);
}
.machine-view .item .item-header{
    width: 100%;
    height: 40px;
    background-color: rgba(43, 45, 48, .5);
    border-bottom: solid 1px rgba(30, 31, 34, 1);
    padding: 5px;
}
.machine-view .item .item-header .item-header-item{
    width: calc(100% - 40px);
    height: 30px;
    display: inline-block;
    vertical-align: top;
}
.machine-view .item .item-header .item-header-item:first-child{
    padding-right: 5px;
}
.machine-view .item .item-header .item-header-item:last-child{
    width: 40px;
}
.machine-view .item .item-footer{
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 5px;
}
.machine-view .item .item-footer .item-footer-box{
    width: 100%;
}
.machine-view .item .item-footer .item-footer-box .machine-item{
    width: 100%;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
}
.machine-view .item .item-footer .item-footer-box .machine-item:hover{
    cursor: pointer;
}
.machine-view .item .item-footer .item-footer-box .machine-item.select{
    background-color: rgba(43, 45, 48, 1);
}
.machine-view .item .item-footer .item-footer-box .machine-item .title{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #999999;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.machine-view .item .item-footer .item-footer-box .machine-item:hover .title{
    color: #ffffff;
}
.machine-view .item .item-footer .item-footer-box .machine-item.select .title{
    color: #ffffff;
}
.machine-view .item .item-footer .item-footer-box .machine-item .describe{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.machine-view .item .item-footer .item-footer-box .machine-item .tag{
    width: 100%;
    padding: 2px 0;
}
</style>
