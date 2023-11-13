<template>
    <div class="settings-view" :class="props.cnc.navigation.select">
        <div class="item">
            <div class="group">
                <div class="title">基础配置</div>
                <div class="box">
                    <div class="box-item" :class="props.cnc.settings.select === 'language' ? 'select' : ''" @click="onSelect('language')">界面语言</div>
                </div>
            </div>
            <div class="group">
                <div class="title">设备管理</div>
                <div class="box">
                    <div class="box-item" :class="props.cnc.settings.select === 'update' ? 'select' : ''" @click="onSelect('update')">系统升级</div>
                </div>
            </div>
        </div>
        <div class="item">
            <LanguageSettings ref="languageSettings" :cnc="props.cnc" v-if="props.cnc.settings.select === 'language'"/>
            <UpdateSettings ref="updateSettings" :cnc="props.cnc" v-if="props.cnc.settings.select === 'update'"/>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
import LanguageSettings from "./settings/language.vue";
import UpdateSettings from "./settings/update.vue";
export default defineComponent({
    name: "SettingsStart",
    emits: [],
    props: ["cnc"],
    components: {
        LanguageSettings,
        UpdateSettings
    },
    setup(props, context) {

        (window as any).runtime.EventsOn("event_page", (message: any) => {
            if(message.type && message.type === "page_settings"){
                props.cnc.settings.select = "language";
            }
        });

        function onSelect(select: string){
            if(props.cnc.settings.select !== select){
                props.cnc.settings.select = select;
            }
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
.settings-view{
    width: 100%;
    height: 100%;
    background-color: rgba(30, 31, 34, 1);
    display: none;
}
.settings-view.settings{
    display: block;
}
.settings-view .item{
    width: calc(100% - 240px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
}
.settings-view .item:first-child{
    width: 240px;
    background-color: rgba(43, 45, 48, .5);
    border-right: solid 1px rgba(30, 31, 34, 1);
    padding: 10px;
}
.settings-view .item .group{
    width: 100%;
    margin-bottom: 10px;
}
.settings-view .item .group .title{
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #666666;
}
.settings-view .item .group .box{
    width: 100%;
}
.settings-view .item .group .box .box-item{
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #999999;
}
.settings-view .item .group .box .box-item:hover{
    color: #ffffff;
    cursor: pointer;
}
.settings-view .item .group .box .box-item.select{
    color: #ffffff;
}
</style>
