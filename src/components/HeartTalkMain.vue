<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { Constants } from "@/utils/Constant";
import {
  getWebsocketUrl,
  APIKey,
  APPID,
  APISecret,
  domain,
} from "@/utils/getAuthorization";
import type { AIType, UserType, messageType } from "@/types";
import { emitter } from "@/utils/emitter";


const chatContent = ref();
const isLoading = ref(false);
const user = ref({} as UserType);

const inputValue = ref("");
const historyList = ref([] as messageType[]);

const AI = ref({} as AIType);

const requestObj = ref({
  APPID: APPID,
  APISecret: APISecret,
  APIKey: APIKey,
  Uid: user.value.userID,
  sparkResult: "",
});
const replyContent = ref("");
//发送消息
const sendMsg = async () => {
  //获取请求地址
  let auUrl = await getWebsocketUrl();
  let socket = new WebSocket(auUrl as string);
  //监听websocket各阶段时间
  socket.addEventListener("open", (event) => {
    console.log("开启链接", event);
    //发送消息
    const params = {
      header: {
        app_id: requestObj.value.APPID,
        uid: requestObj.value.Uid,
      },
      parameter: {
        chat: {
          domain: domain,
          temperature: 0.5,
          max_tokens: 1024,
        },
      },
      payload: {
        message: {
          //结合上下文回答，将历史问答信息传给服务端
          text: [
            {
              role: "system",
              content: AI.value.roleDefinitionStatement,
            },
            ...historyList.value,
          ],
        },
      },
    };
    console.log("发送信息");
    inputValue.value = "";
    isLoading.value = true;
    socket.send(JSON.stringify(params));
    // requestObj.sparkResult
  });
  socket.addEventListener("message", (event) => {
    console.log("接受信息", event);
    let data = JSON.parse(event.data);
    console.log(data);
    // 检查 data.payload 和 data.payload.choices 是否存在
  if (data && data.payload && data.payload.choices && data.payload.choices.text) {
    const str = data.payload.choices.text[0].content;
    replyContent.value += str.replace(/\n/g, "<br>");
    scrollBottom();
  } else {
    console.error("数据格式错误或缺少必要的字段", data);
    ElMessage.error("数据格式错误或缺少必要的字段");
    socket.close(); // 如果数据格式错误，关闭连接
    return;
  }

  if (data.header.code !== 0) {
    console.log("出错了", data.header.code, ":", data.header.message);
    ElMessage.error(`错误代码：${data.header.code}, 错误信息：${data.header.message}`);
    socket.close();
  }
  if (data.header.code === 0) {
    if (data.payload.choices.text && data.header.status === 2) {
      setTimeout(() => {
        reply(replyContent.value);
        socket.close();
      }, 1000);
    }
  }
    const str = data.payload.choices.text[0].content;
    replyContent.value += str.replace(/\n/g, "<br>");
    // replyContent.value.replace(/\n/g, "<br>");
    scrollBottom();
    if (data.header.code !== 0) {
      console.log("出错了", data.header.code, ":", data.header.message);
      // 出错了"手动关闭连接"
      socket.close();
    }
    if (data.header.code === 0) {
      // 对话已经完成
      if (data.payload.choices.text && data.header.status === 2) {
        //requestObj.sparkResult += data.payload.choices.text[0].content;
        setTimeout(() => {
          // "对话完成，手动关闭连接"
          reply(replyContent.value);
          // scrollBottom();
          socket.close();
        }, 1000);
      }
    }
  });
  socket.addEventListener("close", (event) => {
    console.log("关闭链接", event);
    //对话完成后socket会关闭
  });
  socket.addEventListener("error", (event) => {
    console.log("错误链接", event);
  });
};

//判断历史纪录的长度，如果太长删去前面的一些
function canAddHistory() {
  let history_length = 0;
  historyList.value.forEach((item) => {
    history_length += item.content.length;
  });
  console.log("当前长度：" + history_length);
  if (history_length > 10000) {
    //移除五个元素
    historyList.value.splice(0, 5);
    return false;
  }
  return true;
}
onMounted(() => {
  emitter.on("selectAI", (res) => {
    AI.value = res as AIType;
    historyList.value = [];
    // console.log(res);
    // ElMessage.error("AI已切换为" + res);
  });
  user.value = Constants().User;
  scrollBottom();
});
onUnmounted(() => {
  emitter.off("selectAI");
  emitter.off("adminUse");
});
function scrollBottom() {
  nextTick(() => {
    chatContent.value.scrollTop = chatContent.value.scrollHeight;
  });
}
function send() {
  if (!inputValue.value) {
    ElMessage.warning({
      message: "请输入内容",
      type: "warning",
      offset: 150,
    });

    return;
  }
  if (isLoading.value) {
    ElMessage.warning({
      message: "请稍等，AI正在回复",
      type: "warning",
      offset: 150,
    });
    return;
  }
  emitter.emit("ing");

  if (!canAddHistory) historyList.value.splice(0, 1);
  historyList.value.push({
    role: "user",
    content: inputValue.value,
    time: formatDate(new Date()),
  });
  scrollBottom();
  sendMsg();
}
function formatDate(date: Date) {
  const hours = date.getHours();
  const isPm = hours >= 12;
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = isPm ? "PM" : "AM";

  return `${formattedHours}:${minutes} ${ampm}`;
}

function reply(replycontent: string) {
  historyList.value.push({
    role: "assistant",
    content: replycontent,
    time: formatDate(new Date()),
  });
  replyContent.value = "";
  isLoading.value = false;
  emitter.emit("ing");
  scrollBottom();
}

function resetHistory() {
  historyList.value = [];
  ElMessage.success("历史记录已清空");
}
</script>
<template>
  <div class="content">
    <div ref="chatContent" class="chat-window">
      <div class="chat-content">
        <div v-for="item in historyList">
          <div class="chat-ai" v-if="item.role === 'assistant'">
            <div class="chat-text" v-html="item.content"></div>
            <div class="info-time">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-robot"></use>
              </svg>
              <span>{{ AI.roleNickName }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>
          <div class="chat-user" v-if="item.role === 'user'">
            <div class="chat-text">
              {{ item.content }}
            </div>
            <div class="info-time">
              <el-avatar
                icon="el-icon-user-solid"
                shape="circle"
                size="small"
                :src="user.avatarURL"
                fit="fill"
              ></el-avatar>
              <span>{{ user.nickname }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>
        </div>

        <div class="chat-ai" v-if="isLoading">
          <div class="chat-text" v-html="replyContent"></div>
          <div class="info-time">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-robot"></use>
            </svg>
            <span>{{ AI.roleNickName }}</span>
            <span>{{ formatDate(new Date()) }}</span>
            <span v-loading="isLoading"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-bottom">
      <el-button
        :disabled="isLoading"
        class="clear-button"
        @click="resetHistory"
      >
        <span>清空</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-ai-clear"></use>
        </svg>
      </el-button>
      <el-input
        class="chat-input"
        v-model="inputValue"
        placeholder="请输入内容(输入'结束'关闭对话)"
        @keyup.enter="send"
      ></el-input>
      <el-button
        :disabled="isLoading"
        class="chat-button"
        type="primary"
        size="default"
        @click="send"
        >发送</el-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.circular) {
  // display: inline;
  margin-top: 5px;
  height: 30px;
  width: 30px;
  line-height: 30px;
  -webkit-animation: loading-rotate 2s linear infinite;
  animation: loading-rotate 2s linear infinite;
}
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .chat-window {
    // width: 100%;
    height: 90%;
    overflow-y: scroll;
    padding: 20px;
    // background-color: red;
    &::-webkit-scrollbar {
      width: 0; /* Safari,Chrome 隐藏滚动条 */
      height: 0; /* Safari,Chrome 隐藏滚动条 */
      display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
    }
    .chat-content {
      position: relative;
      word-break: break-all;

      .chat-ai {
        width: 100%;
        float: left;
        // margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .chat-text {
          max-width: 75%;
          padding: 10px 15px;
          border-radius: 10px 10px 10px 1px;
          background-color: rgb(88, 132, 252);
          color: #fff;
          &:hover {
            background-color: rgb(47, 102, 253);
            transition: all 0.5s;
          }
        }
        .info-time {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
          //   line-height: 20px;
          display: flex;
          align-items: center;
          //   background-color: red;
          line-height: 30px;
          .icon {
            font-size: 24px;
            margin-right: 10px;
          }
          span {
            margin-right: 10px;
          }
          span:last-child {
            color: rgb(101, 104, 115);
            vertical-align: middle;
            // line-height: 20px;
          }
        }
      }
      .chat-user {
        width: 100%;
        float: right;
        // margin-bottom: 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        .chat-text {
          float: right;
          max-width: 75%;
          height: auto;
          padding: 10px 15px;
          border-radius: 10px 10px 1px 10px;
          background-color: rgb(29, 144, 245);
          color: #fff;

          &:hover {
            background-color: rgb(26, 129, 219);
          }
        }
        .info-time {
          margin: 5px 0;
          color: #666;
          //   line-height: 30px;
          font-size: 14px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          //   background-color: red;
          span {
            line-height: 30px;
            margin-right: 10px;
          }
          span:first-child {
            color: rgb(101, 104, 115);
            // margin-right: 10px;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .chat-bottom {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    .clear-button {
      height: 40px;
      width: 90px;
      background-color: rgba($color: #ffffff, $alpha: 1);
      margin-right: 10px;
      display: flex;
      justify-content: space-around;
      span {
        // font-size: 14px;
        font-weight: bold;
      }
      .icon {
        margin-left: 10px;
        font-size: 25px;
      }
    }
    .chat-input {
      min-height: 40px;
      max-height: 40px;
      //   width: 85%;
      max-width: 75%;
      //   border-radius: 100px !important;
      background-color: transparent !important;
    }
    .chat-button {
      height: 40px;
      padding: 10px 30px;
      margin-left: 10px;
      font-size: 16px;
      background-color: #4251fd;
      transition: all 0.5s;
      border: none;
      &:hover {
        background-color: #071dff;
      }
      &:active {
        background-color: #0011c9;
      }
    }
  }
}
</style>
