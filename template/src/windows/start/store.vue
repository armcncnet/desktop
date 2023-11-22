<template>
    <div class="store-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="item-footer">
                <div class="item-footer-box" v-if="!props.cnc.store.loading">
                    <div class="store-item" :class="props.cnc.store.class_item && props.cnc.store.class_item.token === item.token ? 'select' : ''" v-for="(item, index) in props.cnc.store.class" :key="index" v-if="props.cnc.store.class.length > 0" @click="onSelectClass(item)">
                        <div class="title">{{item.class_name}}</div>
                        <div class="describe">{{item.class_describe}}</div>
                    </div>
                    <el-empty class="cnc none" :image-size="30" v-else/>
                </div>
                <div class="loading-view" v-else>
                    <el-icon class="is-loading"><Loading /></el-icon>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="loading-view" v-if="props.cnc.store.list_loading">
                <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <el-empty class="cnc none" :image-size="30" v-if="props.cnc.store.list.length === 0 && !props.cnc.store.list_loading"/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import Network from "../../package/network/network";
import {ElMessage} from "element-plus";
export default defineComponent({
    name: "StoreStart",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_store"){
                onCloseSelect();
                onData();
            }
        });

        function onData(){
            Network.status(()=>{
                props.cnc.store.loading = true;
                (window as any).go.StartWindows.Api.ServiceRequest("/armcnc/store", "GET", {}, "").then((service: any)=>{
                    if(service.code === 0){
                        props.cnc.store.class = service.data.class;
                        props.cnc.store.loading = false;
                    }else{
                        props.cnc.store.loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "云服务请求失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                });
            },()=>{});
        }

        function onSelectClass(item: any){
            if(props.cnc.store.class_item && props.cnc.store.class_item.token === item.token){
                return;
            }
            Network.status(()=>{
                props.cnc.store.list_loading = true;
                (window as any).go.StartWindows.Api.ServiceRequest("/armcnc/store/list", "GET", {token: item.token}, "").then((service: any)=>{
                    if(service.code === 0){
                        props.cnc.store.class_item = item;
                        props.cnc.store.list = service.data.list;
                        props.cnc.store.list_loading = false;
                    }else{
                        props.cnc.store.list_loading = false;
                        ElMessage.closeAll();
                        ElMessage({
                            message: "云服务请求失败，请重新尝试",
                            type: "warning",
                            customClass: "cnc"
                        });
                    }
                });
            },()=>{});
        }

        function onCloseSelect(){
            props.cnc.store.class = [];
            props.cnc.store.class_item = false;
            props.cnc.store.list = [];
            props.cnc.store.list_loading = false;
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onSelectClass
        }
    }
});
</script>

<style scoped>
.store-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    display: none;
}
.store-view.store{
    display: block;
}
.store-view .item{
    width: calc(100% - 240px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.store-view .item:first-child{
    width: 240px;
    background-color: rgba(43, 45, 48, .5);
    border-right: solid 1px rgba(30, 31, 34, 1);
}
.store-view .item .item-footer{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 5px;
}
.store-view .item .item-footer .item-footer-box{
    width: 100%;
    min-height: 100%;
}
.store-view .item .item-footer .item-footer-box .store-item{
    width: 100%;
    background-color: rgba(43, 45, 48, .3);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
}
.store-view .item .item-footer .item-footer-box .store-item:hover{
    cursor: pointer;
}
.store-view .item .item-footer .item-footer-box .store-item.select{
    background-color: rgba(43, 45, 48, 1);
}
.store-view .item .item-footer .item-footer-box .store-item .title{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #999999;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.store-view .item .item-footer .item-footer-box .store-item:hover .title{
    color: #ffffff;
}
.store-view .item .item-footer .item-footer-box .store-item.select .title{
    color: #ffffff;
}
.store-view .item .item-footer .item-footer-box .store-item .describe{
    width: 100%;
    height: 24px;
    line-height: 24px;
    color: #666666;
    overflow:hidden;
    width-space:nowrap;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.store-view .store-box{
    width: 100%;
    height: 100%;
    position: relative;
}
</style>