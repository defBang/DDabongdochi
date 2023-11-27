<template>
  <div id="markdowneditor">
    <div id="mdeditor"></div>
  </div>
</template>
<script>
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
export default {
  props: {
    content: String,
  },
  components: {},
  data() {
    return {
      editor: null,
      mdtext: "",
    };
  },
  mounted() {
    this.mdeditor = new Editor({
      el: document.querySelector("#mdeditor"),
      previewStyle: "vertical",
      initialValue: this.content,
      height: "500px",
      initialEditType: "markdown",
      hideModeSwitch: true,
      plugins: [codeSyntaxHighlight],
    });
  },
  methods: {
    getText() {
      return this.mdeditor.getMarkdown();
    },
  },
};
</script>
<style>
@import "../assets/styles/component.css";
</style>
