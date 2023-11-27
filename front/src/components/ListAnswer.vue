<template>
  <div>
    <div v-if="!isEditing" class="answer">
      <div class="answerinfo">
        <b-row class="answerinfo_row">
          <b-col class="answerwriter" sm="auto">
            {{ answer.answer_writer_nickname }}
            <i
              class="bi bi-robot"
              v-if="answer.answer_writer_nickname == `따봉도치봇`"
            ></i>
          </b-col>
          <b-col class="answerdate">
            <span
              v-if="
                answer.recent_update_date === null ||
                answer.recent_update_date === undefined
              "
            >
              작성일 {{ answer.date }}</span
            >
            <span v-else-if="answer.recent_update_date !== null">
              수정일 {{ answer.recent_update_date }}</span
            >
          </b-col>
          <b-col class="answerrate" sm="auto">
            <b-button-group>
              <b-button
                size="sm"
                variant="outline-dark"
                class="answerratebutton"
                @click="rateup"
              >
                추천 <span class="rateup">{{ answer.rate_up }}</span>
              </b-button>
              <b-button
                size="sm"
                variant="outline-dark"
                class="answerratebutton"
                @click="ratedown"
              >
                비추천
                <span class="ratedown">{{ -answer.rate_down }}</span>
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
      </div>
      <div class="answercontent">
        <div :id="`answer${answer.answer_post_id}`"></div>
      </div>
      <div class="ansbtngrp_e_d">
        <b-button-group v-if="isAnsWriter">
          <b-button @click="editAnswer" variant="outline-dark">
            <i class="bi bi-wrench-adjustable"></i>
            수정
          </b-button>
          <b-button @click="sendSignal('delete')" variant="outline-dark">
            <i class="bi bi-trash3"></i>
            삭제
          </b-button>
        </b-button-group>
      </div>
    </div>
    <div v-else-if="isEditing" class="answer_edit">
      <div id="markdowneditor">
        <div id="mdeditor_edit"></div>
      </div>
      <div class="answer_buttonarea">
        <b-button class="answer_writebutton" @click="sendSignal('edit')">
          답변 수정
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@toast-ui/editor";
import "prismjs/themes/prism-dark.css";
import "../assets/styles/toastui-editor.css";
import "../assets/styles/TUI-viewer.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
import { mapActions } from "vuex";
export default {
  props: {
    answer: {
      type: Object,
      default: () => {
        return {
          answer_post_id: "",
          answer_writer: "",
          answer_writer_nickname: "",
          question_post_id: "",
          answer_content: "",
          rate_up: 0,
          rate_down: 0,
          date: "",
          recent_update_date: null,
        };
      },
    },
  },
  data() {
    return {
      isEditing: false,
      edittext: "",
      isAnsWriter: false,
      answerViewer: null,
      editor: null,
    };
  },
  mounted() {
    if (this.answer.answer_writer == this.$store.state.user.userId) {
      this.isAnsWriter = true;
    } else {
      this.isAnsWriter = false;
    }
    this.answerViewer = new Viewer({
      el: this.$el.querySelector(`#answer${this.answer.answer_post_id}`),
      initialValue: this.answer.answer_content,
      plugins: [[codeSyntaxHighlight]],
    });
  },
  methods: {
    ...mapActions(["clearUserInfoAction"]),
    editAnswer() {
      this.editing()
        .then(() => {
          this.editor = new Editor({
            el: document.querySelector("#mdeditor_edit"),
            previewStyle: "tab",
            initialValue: this.edittext,
            height: "300px",
            initialEditType: "markdown",
            hideModeSwitch: true,
            plugins: [[codeSyntaxHighlight]],
          });
        })
        .catch(() => {
          console.log("Rejected!");
        })
        .finally(() => {});
    },
    editing() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isEditing = true;
          this.edittext = this.answer.answer_content;
          resolve();
        }, 1);
      });
    },
    rateup() {
      if (this.$store.state.user.isSignIn) {
        this.axios
          .put(`/recommender/rateUp`, {
            postId: this.answer.answer_post_id,
            board: "answer",
          })
          .then((response) => {
            if (response.status == 200) {
              this.$emit("rate", response.data);
            }
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status == 403) {
                this.clearUserInfoAction();
              } else {
                this.error.status = error.response.status;
                this.error.message = error.response.data.message;
                this.isError = true;
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
          })
          .finally(() => {});
      } else {
        this.$emit("signIn");
      }
    },
    ratedown() {
      if (this.$store.state.user.isSignIn) {
        this.axios
          .put(`/recommender/rateDown`, {
            postId: this.answer.answer_post_id,
            board: "answer",
          })
          .then((response) => {
            if (response.status == 200) {
              this.$emit("rate", response.data);
            }
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status == 403) {
                this.clearUserInfoAction();
              } else {
                this.error.status = error.response.status;
                this.error.message = error.response.data.message;
                this.isError = true;
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
          })
          .finally(() => {});
      } else {
        this.$emit("signIn");
      }
    },
    sendSignal(signal) {
      this.edittext = this.editor.getMarkdown();
      var data;
      if (signal === "edit") {
        data = {
          answer_post_id: this.answer.answer_post_id,
          signal: signal,
          content: this.edittext,
        };
      } else if (signal === "delete") {
        data = { answer_post_id: this.answer.answer_post_id, signal: signal };
      }
      this.$emit("receiveSignal", data);
    },
  },
};
</script>
<style>
@import "../assets/styles/component.css";
</style>
