<template>
    <div class="layer-view" @blur="onClose" tabindex="-1">
        <div class="layer-number-header">
            <div class="number-header-item"></div>
            <div class="number-header-item" style="text-align: center;">
                <el-input ref="inputDom" class="cnc none max" v-model="props.cnc.layer.number.set" placeholder="请输入数值数据" autocomplete="off" spellcheck="false" style="width: 300px;" @change="onChange"/>
            </div>
            <div class="number-header-item">
                <div class="close" @click="onClose">
                    <el-icon><ArrowDownBold /></el-icon>
                </div>
            </div>
        </div>
        <div class="layer-number-box">
            <div class="number-box">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('7')">7</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('8')">8</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('9')">9</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content del" @click="onKey('del')">Del</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('4')">4</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('5')">5</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('6')">6</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" style="background-color: rgba(0, 0, 0, 0)"></div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('1')">1</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('2')">2</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('3')">3</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" style="background-color: rgba(0, 0, 0, 0)"></div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('or')">-/+</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('0')">0</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content" @click="onKey('.')">.</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content end" @click="onConfirm">确定</div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, ref} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "NumberLayer",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        const inputDom = ref(null);

        function onChange(){
            if(props.cnc.layer.number.first){
                props.cnc.layer.number.first = false;
            }
        }

        function onKey(key: string){
            if(key === "del" || key === "Backspace"){
                if(props.cnc.layer.number.set.length > 0){
                    props.cnc.layer.number.set = props.cnc.layer.number.set.substring(0, props.cnc.layer.number.set.length - 1);
                }
                return;
            }
            if(key === "or" || key === "-" || key === "+"){
                if(props.cnc.layer.number.set.length > 0){
                    if(props.cnc.layer.number.set.indexOf("-") !== -1){
                        props.cnc.layer.number.set = props.cnc.layer.number.set.replace('-', '');
                    }else{
                        props.cnc.layer.number.set = "-" + props.cnc.layer.number.set;
                    }
                }
                return;
            }
            if(props.cnc.layer.number.first){
                props.cnc.layer.number.first = false;
                props.cnc.layer.number.set = key;
            }else{
                props.cnc.layer.number.set = props.cnc.layer.number.set + key;
            }
        }

        function onConfirm(){
            if (props.cnc.layer.number.set === "") {
                props.cnc.layer.number.set = props.cnc.layer.number.value;
            }
            if(props.cnc.layer.number.min && parseFloat(props.cnc.layer.number.set) < props.cnc.layer.number.min){
                props.cnc.layer.number.set = props.cnc.layer.number.value;
            }
            if(props.cnc.layer.number.max && parseFloat(props.cnc.layer.number.set) > props.cnc.layer.number.max){
                props.cnc.layer.number.set = props.cnc.layer.number.value;
            }
            if(props.cnc.layer.number.callback){
                props.cnc.layer.number.callback(props.cnc.layer.number.set);
            }
            onClose(false);
        }

        function onClose(event: any){
            if(props.cnc.layer.number){
                if (!event.relatedTarget || !(inputDom as any).value.$el.contains(event.relatedTarget)) {
                    props.cnc.layer.number = false;
                }
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {
            if(props.cnc.layer.select){
                props.cnc.layer.select = false;
            }
            if(props.cnc.layer.string){
                props.cnc.layer.string = false;
            }
            if((inputDom as any).value){
                (inputDom as any).value.focus();
            }
        });

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            inputDom,
            onChange,
            onKey,
            onConfirm,
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
.layer-view .layer-number-header{
    width: 100%;
    height: 40px;
    background-color: rgba(30, 31, 34, .5);
    border-bottom: solid 1px rgba(30, 31, 34, .5);
}
.layer-view .layer-number-header .number-header-item{
    width: 33.33%;
    height: 40px;
    display: inline-block;
    vertical-align: top;
}
.layer-view .layer-number-header .number-header-item:last-child{
    text-align: right;
}
.layer-view .layer-number-header .number-header-item .close{
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    color: #666666;
}
.layer-view .layer-number-header .number-header-item .close:hover{
    cursor: pointer;
    color: #999999;
}
.layer-view .layer-number-box{
    width: 100%;
    height: 240px;
    overflow-y: auto;
    background-color: rgba(30, 31, 34, .2);
}
.layer-view .layer-number-box .number-box{
    width: 300px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    background-color: rgba(30, 31, 34, .2);
}
.layer-view .layer-number-box .number-box .el-col{
    margin-bottom: 10px;
}
.layer-view .layer-number-box .number-box .el-col .grid-content{
    width: 100%;
    height: 47px;
    line-height: 47px;
    background-color: rgba(30, 31, 34, .5);
    text-align: center;
    color: #999999;
    border-radius: 4px;
}
.layer-view .layer-number-box .number-box .el-col .grid-content:hover{
    cursor: pointer;
    color: #ffffff;
    background-color: rgba(30, 31, 34, .8);
}
.layer-view .layer-number-box .number-box .el-col .grid-content.end{
    background-color: #5e4eff;
    color: #ffffff;
}
</style>
