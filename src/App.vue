<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AIType } from "./types";
import HeartTalkAside from "@/components/HeartTalkAside.vue";
import HeartTalkMain from "@/components/HeartTalkMain.vue";
import { emitter } from "./utils/emitter";

const AI = ref({} as AIType);
onMounted(() => {
  emitter.on("selectAI", (res) => {
    AI.value = res as AIType;
  });
});
</script>

<template>
  <div class="body">
    <div class="heartTalk">
      <div class="heartTalk_aside">
        <div class="heartTalk_title">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-talkAI2"></use>
            </svg>
            智能AI模型
          </span>
        </div>
        <div class="heartTalk_aside_card">
          <HeartTalkAside />
        </div>
      </div>
      <div class="heartTalk_main">
        <div class="heartTalk_main_title">
          <span class="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-talkAI1"></use>
            </svg>
            {{ AI.roleNickName }}
          </span>
          <span class="declare">—— {{ AI.roleInfos }}</span>
        </div>
        <div class="heartTalk_main_card">
          <HeartTalkMain />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body {
  width: 1200px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
}
.heartTalk {
  //   background-color: red;
  box-shadow: var(--el-box-shadow-light);
  background: url("@/assets/img/talkAI_bg.png") no-repeat,
    url("@/assets/img/talkAI_bg_left_bottom.png") no-repeat;
  background-size: 45% auto, 35% auto;
  background-position: 100% 0, 0 100%;
  background-color: #fff;
  width: 100%;
  height: 700px;
  border-radius: 20px;
  padding: 15px;
  display: flex;

  .heartTalk_aside {
    display: flex;
    width: 25%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;

    .heartTalk_title {
      // background-color: red;
      height: 70px;
      display: flex;
      // justify-content: center;
      margin-left: 15px;
      align-items: center;

      span {
        // margin: 20px;

        line-height: 40px;
        font-size: 30px;
        font-weight: 600;
        color: #303030;
      }

      .icon {
        font-size: 35px;
        line-height: 40px;
      }
    }

    .heartTalk_aside_card {
      height: 100%;
      margin-top: 20px;
      background-color: rgba($color: #ecf5ff, $alpha: 0.5);
      border-radius: 10px;
    }
  }

  .heartTalk_main {
    margin-left: 20px;
    width: 100%;
    // background-color: blue;
    display: flex;
    flex-direction: column;

    .heartTalk_main_title {
      height: 70px;
      // margin-top: 10px;
      margin-left: 10px;
      // background-color: aqua;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .title {
        font-size: 20px;
        line-height: 35px;
        font-weight: 600;

        svg {
          font-size: 25px;
          line-height: 35px;
        }
      }

      .declare {
        font-size: 14px;
        margin-left: 80px;
      }
    }

    .heartTalk_main_card {
      margin-top: 10px;
      height: 100%;
      // background: url("@/assets/img/other/talkAI_bg_bottom.png") no-repeat;
      // background-size: 100% auto;
      // background-position-y: 100%;
      // background: radial-gradient(#deefff 5%, #93cafd 30%, #6f9dff 20%);
      background-color: rgba($color: #e5f0fc, $alpha: 0.6);
      border-radius: 10px;
      overflow: hidden;
    }
  }
}
</style>
