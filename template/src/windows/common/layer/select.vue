<template>
    <div class="layer-view" @blur="onClose" tabindex="-1">
        <div class="layer-select-header">
            <div class="select-header-item"></div>
            <div class="select-header-item"></div>
            <div class="select-header-item">
                <div class="close" @click="onClose">
                    <el-icon><ArrowDownBold /></el-icon>
                </div>
            </div>
        </div>
        <div class="layer-select-box">
            <div class="layer-select-options">
                <div class="options-box" :class="props.cnc.layer.select.value === item.value ? 'select' : ''" v-for="(item, index) in props.cnc.layer.select.options" :key="index">
                    <div class="option" @click="onOption(item)">{{item.label}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "SelectLayer",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onOption(item: any){
            if(props.cnc.layer.select.callback){
                props.cnc.layer.select.callback(item.value);
            }
            onClose();
        }

        function onClose(){
            if(props.cnc.layer.select){
                props.cnc.layer.select = false;
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {});

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
.layer-view .layer-select-header{
    width: 100%;
    height: 40px;
    background-color: rgba(30, 31, 34, .5);
    border-bottom: solid 1px rgba(30, 31, 34, .5);
}
.layer-view .layer-select-header .select-header-item{
    width: 33.33%;
    height: 40px;
    display: inline-block;
    vertical-align: top;
}
.layer-view .layer-select-header .select-header-item:last-child{
    text-align: right;
}
.layer-view .layer-select-header .select-header-item .close{
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    color: #666666;
}
.layer-view .layer-select-header .select-header-item .close:hover{
    cursor: pointer;
    color: #999999;
}
.layer-view .layer-select-box{
    width: 100%;
    height: 240px;
    overflow-y: auto;
    background-color: rgba(30, 31, 34, .2);
}
.layer-view .layer-select-box .layer-select-options{
    width: 100%;
}
.layer-view .layer-select-box .layer-select-options .options-box{
    width: 100%;
    height: 35px;
}
.layer-view .layer-select-box .layer-select-options .options-box:hover{
    cursor: pointer;
    background-color: rgba(30, 31, 34, .2);
}
.layer-view .layer-select-box .layer-select-options .options-box .option{
    width: 200px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    margin: 0 auto;
    color: #999999;
}
.layer-view .layer-select-box .layer-select-options .options-box:hover .option{
    color: #ffffff;
}
.layer-view .layer-select-box .layer-select-options .options-box.select .option{
    color: #ffffff;
}
</style>
