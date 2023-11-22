<template>
    <div class="store-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="item-footer">
                <div class="item-footer-box" v-if="!props.cnc.store.loading">
                    <div class="store-item" :class="props.cnc.store.item && props.cnc.store.item.path === item.path ? 'select' : ''" v-for="(item, index) in props.cnc.store.items" :key="index" v-if="props.cnc.store.items.length > 0" @click="onSelect(item)">
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
        <div class="item">1212</div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "StoreStart",
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
            props.cnc.store.items = [];
            props.cnc.store.loading = false;
        }

        function onSelect(item: any){

        }

        function onCloseSelect(){
            props.cnc.store.item = false;
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