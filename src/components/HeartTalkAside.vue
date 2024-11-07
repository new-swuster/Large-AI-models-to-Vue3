<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import { emitter } from "@/utils/emitter";
import { Constants } from "@/utils/Constant";
import type { AIType } from "@/types";

const AITypes = ref([] as AIType[]);
const nowType = ref({} as AIType);
const canSelect = ref(false);

const defaultAI = ref({
  airoleID: 0,
  roleNickName: "通用AI",
  roleDefinitionStatement: "你目前是一个通用的智能化助手，可以回答各种问题",
  roleInfos: "这是一个默认的智能化助手，具备最基本的功能，并没有设定身份",
  runStatus: 0,
} as AIType);

function changeType(AiType: AIType) {
  nowType.value = AiType;
  emitter.emit("selectAI", AiType);
}

onMounted(() => {
  nowType.value = defaultAI.value;
  AITypes.value = Constants().AIs;
  nextTick(() => {
    emitter.emit("selectAI", defaultAI.value);
    changeType(defaultAI.value);
  });
  emitter.on("ing", () => {
    canSelect.value = !canSelect.value;
  });
});
onUnmounted(() => {
  emitter.off("selectAI");
  emitter.off("ing");
});
</script>
<template>
  <div class="aside">
    
    <div class="aside_title">AI模型列表</div>
    <el-scrollbar height="550px">
      <el-menu
        class="aside_menu"
        mode="vertical"
        :default-active="`${defaultAI.airoleID}`"
      >
        <el-menu-item
          class="aside_menu_item"
          :index="`${defaultAI.airoleID}`"
          :disabled="canSelect"
          @click="changeType(defaultAI)"
          >通用AI</el-menu-item
        >
        <el-menu-item
          class="aside_menu_item"
          v-for="item in AITypes"
          :index="`${item.airoleID}`"
          @click="changeType(item)"
          :disabled="canSelect"
          >{{ item.roleNickName }}</el-menu-item
        >
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<style lang="scss" scoped>
.aside {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .aside_title {
    font-size: 18px;
    font-weight: 600;
    color: #666;
    margin: 20px 0 5px 20px;
  }
  .aside_menu {
    // background-color: red;
    border-right: none;
    background-color: rgba($color: #ecf5ff, $alpha: 0.5);
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    // background-color: red;
    .el-menu-item {
      border: 1px solid #d9ecff;
      background-color: rgba($color: #d9ecff, $alpha: 0.8);
      border: 1px solid rgba($color: #d9ecff, $alpha: 0.8);
      border-left: 8px solid rgba($color: #79bbff, $alpha: 0.3);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 10px;
      height: 50px;
      font-size: 15px;
      //   line-height: 50px;
      font-weight: bold;
      &:hover {
        transition: all 0.3s;
        background: #fff !important;
        border: 1px solid rgba($color: #0c81f5, $alpha: 0.8);
        border-left: 8px solid rgba($color: #337ecc, $alpha: 0.5);
        box-shadow: var(--el-box-shadow-lighter);
      }
    }

    .el-menu-item.is-active {
      background: #fff !important;
      border: 1px solid rgba($color: #0c81f5, $alpha: 0.8);
      border-left: 8px solid rgba($color: #337ecc, $alpha: 0.8);
      box-shadow: var(--el-box-shadow-lighter);
    }
  }
}
</style>
