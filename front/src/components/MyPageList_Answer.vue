<template>
  <div class="mypage_answer">
    <div class="mypage_answerinfo">
      <b-row>
        <b-col class="mypage_answerwriter" sm="auto">
          {{ answer.answer_writer_nickname }}
        </b-col>
        <b-col class="mypage_answerdate"> 작성일 {{ answer.date }} </b-col>
        <b-col class="mypage_answerrate" sm="auto">
          추천수 <span class="mypage_rate">{{ answer.rate }}</span>
        </b-col>
        <b-col sm="auto">
          <b-button
            class="mypage_answer_link_button"
            size="sm"
            @click="
              this.$router.push({
                name: 'devQnA_post',
                params: { id: answer.question_post_id },
              })
            "
          >
            질문 보기
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div class="mypage_answercontent">
      <div
        v-if="isRecommended"
        :id="`recommended${answer.answer_post_id}`"
      ></div>
      <div v-else :id="`myanswer${answer.answer_post_id}`"></div>
    </div>
  </div>
</template>

<script>
import "prismjs/themes/prism-dark.css";
import "../assets/styles/toastui-editor.css";
import "../assets/styles/TUI-viewer.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
export default {
  props: {
    answer: {
      type: Object,
      default: () => {
        return {
          no: 0,
          answer_post_id: 0,
          answer_writer: "",
          answer_writer_nickname: "",
          question_post_id: 0,
          answer_content: "",
          rate: 0,
          date: "",
          recent_update_date: null,
        };
      },
    },
    isRecommended: Boolean,
  },
  data() {
    return {
      answerViewer: null,
    };
  },
  mounted() {
    var selectorstring;
    if (this.isRecommended) {
      selectorstring = `#recommended${this.answer.answer_post_id}`;
    } else {
      selectorstring = `#myanswer${this.answer.answer_post_id}`;
    }
    this.answerViewer = new Viewer({
      el: document.querySelector(selectorstring),
      initialValue: this.answer.answer_content,
      plugins: [[codeSyntaxHighlight]],
    });
  },
};
</script>
<style>
@import "../assets/styles/componentmypage.css";
</style>
