<template>
    <div class="language-view">
        <div class="language-main">
            <el-form class="cnc" :model="props.cnc.settings" label-width="120px">
                <el-form-item label="语言设置">
                    <el-radio-group class="cnc max" v-model="props.cnc.language" @change="onLanguage">
                        <el-radio-button label="zh">简体中文</el-radio-button>
                        <el-radio-button label="en">英语</el-radio-button>
                        <el-radio-button label="ru">俄语</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import {ElMessage} from "element-plus";
export default defineComponent({
    name: "LanguageSettings",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        function onLanguage(value: string){
            if(value !== "zh"){
                props.cnc.language = "zh";
                ElMessage.closeAll();
                ElMessage({
                    message: "目前仅支持简体中文",
                    type: "warning",
                    customClass: "cnc"
                });
            }
        }

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons,
            onLanguage
        }
    }
});
</script>

<style scoped>
.language-view{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 30px;
}
.language-view .language-main{
    width: 100%;
    max-width: 844px;
    margin: 0 auto;
    background-color: rgba(43, 45, 48, .3);
    border-radius: 4px;
    padding: 30px 20px;
}
</style>
