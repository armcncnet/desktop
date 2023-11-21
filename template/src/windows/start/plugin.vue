<template>
    <div class="plugin-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="item-footer">
                <div class="item-footer-box" v-if="!props.cnc.plugin.loading">
                    <div class="plugin-item" :class="props.cnc.plugin.item && props.cnc.plugin.item.path === item.path ? 'select' : ''" v-for="(item, index) in props.cnc.plugin.items" :key="index" v-if="props.cnc.plugin.items.length > 0" @click="onSelect(item)">
                        <div class="title">{{item.name}}</div>
                        <div class="describe">{{item.describe}}</div>
                    </div>
                    <el-empty class="cnc none" :image-size="30" v-else/>
                </div>
                <div class="loading-view" v-else>
                    <el-icon class="is-loading"><Loading /></el-icon>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="loading-view" v-if="props.cnc.plugin.tab.loading">
                <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <el-empty class="cnc none" :image-size="30" v-if="!props.cnc.plugin.item && !props.cnc.plugin.tab.loading"/>
            <div class="plugin-box" v-if="!props.cnc.plugin.tab.loading && props.cnc.plugin.item">
                <el-tabs v-model="props.cnc.plugin.tab.value" type="card" class="cnc">
                    <el-tab-pane class="cnc" :closable="item.close" v-for="(item, index) in props.cnc.plugin.tab.items" :key="index" :label="item.name" :name="item.id">
                        {{item}}
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "PluginStart",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_plugin"){
                onCloseSelect();
                onData();
            }
        });

        function onData(){
            props.cnc.plugin.items = [];
            props.cnc.plugin.loading = true;
            (window as any).go.StartWindows.Api.DeviceRequest(props.cnc.device.ip + ":" + props.cnc.device.message.port, "/plugin/select", "GET", {}).then((response: any)=>{
                if(response.code === 0){
                    if(response.data){
                        props.cnc.plugin.items = response.data.plugin;
                        props.cnc.plugin.loading = false;
                    }else{
                        props.cnc.plugin.loading = false;
                    }
                }else{
                    props.cnc.plugin.loading = false;
                }
            });
        }

        function onSelect(item: any){

        }

        function onCloseSelect(){
            props.cnc.plugin.tab.items = [];
            props.cnc.plugin.tab.value = "";
            props.cnc.plugin.tab.loading = false;
            props.cnc.plugin.item = false;
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
.plugin-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    display: none;
}
.plugin-view.plugin{
    display: block;
}
.plugin-view .item{
    width: calc(100% - 240px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.plugin-view .item:first-child{
    width: 240px;
    background-color: rgba(43, 45, 48, .5);
    border-right: solid 1px rgba(30, 31, 34, 1);
}
.plugin-view .item .item-footer{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 5px;
}
.plugin-view .item .item-footer .item-footer-box{
    width: 100%;
    min-height: 100%;
}
.plugin-view .item .item-footer .item-footer-box .plugin-item{
    width: 100%;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
}
.plugin-view .item .item-footer .item-footer-box .plugin-item:hover{
    cursor: pointer;
}
.plugin-view .item .item-footer .item-footer-box .plugin-item.select{
    background-color: rgba(43, 45, 48, 1);
}
.plugin-view .item .item-footer .item-footer-box .plugin-item .title{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #999999;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.plugin-view .item .item-footer .item-footer-box .plugin-item:hover .title{
    color: #ffffff;
}
.plugin-view .item .item-footer .item-footer-box .plugin-item.select .title{
    color: #ffffff;
}
.plugin-view .item .item-footer .item-footer-box .plugin-item .describe{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.plugin-view .plugin-box{
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
