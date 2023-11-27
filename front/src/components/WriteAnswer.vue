<template>
  <div class="answer_write">
    <b-row>
      <b-col>
        <div id="markdowneditor">
          <div id="mdeditor"></div>
        </div>
      </b-col>
    </b-row>
    <div class="answer_buttonarea">
      <b-button class="answer_writebutton" @click="writeAnswer">
        답변 작성
      </b-button>
    </div>
  </div>
</template>
<script>
import Editor from "@toast-ui/editor";
import "../assets/styles/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "prismjs/themes/prism-dark.css";
export default {
  data() {
    return {
      text: "",
      editor: null,
    };
  },
  mounted() {
    this.editor = new Editor({
      el: document.querySelector("#mdeditor"),
      previewStyle: "tab",
      initialValue: "",
      height: "300px",
      initialEditType: "markdown",
      hideModeSwitch: true,
      plugins: [[codeSyntaxHighlight]],
    });
  },
  methods: {
    writeAnswer() {
      this.text = this.editor.getMarkdown();
      if (this.text == "") {
        window.alert("내용을 작성해 주세요.");
      } else {
        this.$emit("post", this.text);
      }
    },
  },
};
</script>
<style>
@import "../assets/styles/component.css";
</style>
