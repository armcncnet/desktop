<template>
    <div class="settings-view" :class="props.cnc.navigation.select">
        <div class="item">1</div>
        <div class="item">2</div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue";
import * as icons from "@element-plus/icons";
export default defineComponent({
    name: "SettingsStart",
    emits: [],
    props: ["cnc"],
    components: {},
    setup(props, context) {

        onBeforeMount(() => {});

        onMounted(() => {});

        onBeforeUnmount(() => {});

        onUnmounted(() => {});

        return {
            props,
            icons
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
}
</style>
