<template>
    <div class="layer-view" @blur="onClose" tabindex="-1">
        <div class="layer-string-header">
            <div class="string-header-item"></div>
            <div class="string-header-item">
                <div class="number-header-item" style="text-align: center;">
                    <el-input ref="inputDom" class="cnc none max" v-model="props.cnc.layer.string.set" placeholder="请输入数据" autocomplete="off" spellcheck="false" />
                </div>
            </div>
            <div class="string-header-item">
                <div class="close" @click="onClose">
                    <el-icon><ArrowDownBold /></el-icon>
                </div>
            </div>
        </div>
        <div class="layer-string-box">
            <div class="string-view">
                <div class="keyboard" @click="onKeyboard">
                    <el-row :gutter="6">
                        <el-col :span="1">
                            <div class="grid-content">1</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">2</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">3</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">4</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">5</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">6</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">7</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">8</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">9</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">0</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">+</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">-</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">#</div>
                        </el-col>
                        <el-col :span="1" class="backspace">
                            <div class="grid-content">Backspace</div>
                        </el-col>
                        <el-col :span="1" class="tab">
                            <div class="grid-content">Tab</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Q</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">W</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">E</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">R</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">T</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Y</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">U</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">I</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">O</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">P</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">{{"[ ]"}}</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">{{"{ }"}}</div>
                        </el-col>
                        <el-col :span="1" class="jh">
                            <div class="grid-content">{{"( )"}}</div>
                        </el-col>
                        <el-col :span="1" class="capslock">
                            <div class="grid-content" :class="props.cnc.layer.string.capslock ? 'select' : ''">CapsLock</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">A</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">S</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">D</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">F</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">G</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">H</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">J</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">K</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">L</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">_</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">.</div>
                        </el-col>
                        <el-col :span="1" class="enter">
                            <div class="grid-content">Enter</div>
                        </el-col>
                        <el-col :span="1" class="shift">
                            <div class="grid-content">Shift</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Z</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">X</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">C</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">V</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">B</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">N</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">M</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">,</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">;</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">{{"< >"}}</div>
                        </el-col>
                        <el-col :span="1" class="shift">
                            <div class="grid-content">Shift</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Ctrl</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">@</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Alt</div>
                        </el-col>
                        <el-col :span="1" class="space">
                            <div class="grid-content">Space</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Alt</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Fn</div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content"></div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content"></div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content"></div>
                        </el-col>
                        <el-col :span="1">
                            <div class="grid-content">Ctrl</div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, ref} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "StringLayer",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        const inputDom = ref(null);

        function onKeyboard(event: any){
            if (event.target.classList.contains("grid-content")) {
                let key = event.target.textContent;
                if(key === ""){
                    return;
                }
                if(key === "Backspace"){
                    if(props.cnc.layer.string.set.length > 0){
                        props.cnc.layer.string.set = props.cnc.layer.string.set.substring(0, props.cnc.layer.string.set.length - 1);
                    }
                    return;
                }
                if(key === "CapsLock"){
                    props.cnc.layer.string.capslock = !props.cnc.layer.string.capslock;
                    return;
                }
                if(key === "Ctrl" || key === "Alt" || key === "Fn" || key === "Shift"){
                    return;
                }
                if(key === "Space"){
                    key = " ";
                }
                if(key === "( )" || key === "[ ]" || key === "{ }" || key === "< >"){
                    key = key.replace(/\s+/g, '');
                }
                if(key === "Enter"){
                    if(props.cnc.layer.string.set === ""){
                        props.cnc.layer.string.set = props.cnc.layer.string.value;
                    }
                    if(props.cnc.layer.string.callback){
                        props.cnc.layer.string.callback(props.cnc.layer.string.set);
                    }
                    onClose(false);
                    return;
                }
                props.cnc.layer.string.set = props.cnc.layer.string.set + (props.cnc.layer.string.capslock ? key.toUpperCase() : key.toLowerCase());
            }
        }

        function onClose(event: any){
            if(props.cnc.layer.string){
                if (!event.relatedTarget || !(inputDom as any).value.$el.contains(event.relatedTarget)) {
                    props.cnc.layer.string = false;
                }
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
            onKeyboard,
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
    width: calc((100% - 750px) / 2);
    height: 40px;
    display: inline-block;
    vertical-align: top;
}
.layer-view .layer-string-header .string-header-item:nth-child(2){
    width: 750px;
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
.layer-view .layer-string-box .string-view{
    width: 750px;
    height: 100%;
    margin: 0 auto;
    padding: 10px 0;
}
.layer-view .layer-string-box .string-view .keyboard{
    width: 100%;
}
.layer-view .layer-string-box .string-view .keyboard .el-col{
    width: 50px;
    max-width: 50px;
    flex: auto;
    margin-bottom: 6px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.backspace{
    width: 105px;
    max-width: 105px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.tab{
    width: 80px;
    max-width: 80px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.jh{
    width: 75px;
    max-width: 75px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.capslock{
    width: 100px;
    max-width: 100px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.enter{
    width: 105px;
    max-width: 105px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.shift{
    width: 125px;
    max-width: 125px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.space{
    width: 300px;
    max-width: 300px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.shift:last-child{
    width: 130px;
    max-width: 130px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col .grid-content{
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #999999;
    background-color: rgba(30, 31, 34, 5);
    border-radius: 4px;
}
.layer-view .layer-string-box .string-view .keyboard .el-col .grid-content:hover{
    cursor: pointer;
    color: #ffffff;
    background-color: rgba(30, 31, 34, .8);
}
.layer-view .layer-string-box .string-view .keyboard .el-col.enter .grid-content{
    background-color: #5e4eff;
    color: #ffffff;
}
.layer-view .layer-string-box .string-view .keyboard .el-col.capslock .grid-content.select{
    color: #5e4eff;
}
</style>
