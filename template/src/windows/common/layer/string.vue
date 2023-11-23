<template>
    <div class="layer-view" @blur="onClose" tabindex="-1">
        <div class="layer-string-header">
            <div class="string-header-item"></div>
            <div class="string-header-item"></div>
            <div class="string-header-item">
                <div class="close" @click="onClose">
                    <el-icon><ArrowDownBold /></el-icon>
                </div>
            </div>
        </div>
        <div class="layer-string-box">

        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "StringLayer",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onOption(item: any){
            if(props.cnc.layer.string.callback){
                props.cnc.layer.string.callback(item.value);
            }
            onClose();
        }

        function onClose(){
            if(props.cnc.layer.string){
                props.cnc.layer.string = false;
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {
            if(props.cnc.layer.number){
                props.cnc.layer.number = false;
            }
            if(props.cnc.layer.select){
                props.cnc.layer.select = false;
            }
        });

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onOption,
            onClose
        }
    }
});
</script>

<style scoped>
.layer-view{
    width: 100%;
    height: 280px;
    background-color: rgba(43, 45, 48, .95);
    border-top: solid 1px rgba(30, 31, 34, 1);
    position: fixed;
    left: 0;
    right: 0;
    bottom: 25px;
    z-index: 80000;
}
.layer-view .layer-string-header{
    width: 100%;
    height: 40px;
    background-color: rgba(30, 31, 34, .5);
    border-bottom: solid 1px rgba(30, 31, 34, .5);
}
.layer-view .layer-string-header .string-header-item{
    width: 33.33%;
    height: 40px;
    display: inline-block;
    vertical-align: top;
}
.layer-view .layer-string-header .string-header-item:last-child{
    text-align: right;
}
.layer-view .layer-string-header .string-header-item .close{
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    color: #666666;
}
.layer-view .layer-string-header .string-header-item .close:hover{
    cursor: pointer;
    color: #999999;
}
.layer-view .layer-string-box{
    width: 100%;
    height: 240px;
    overflow-y: auto;
    background-color: rgba(30, 31, 34, .2);
}
</style>
