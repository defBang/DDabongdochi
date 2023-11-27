<template>
  <div class="pagebody">
    <div v-if="!isError">
      <b-row class="write_title_form">
        <b-col sm="auto" class="write_title_text"> 제목 </b-col>
        <b-col>
          <b-form-input
            v-model="postdata.title"
            placeholder=""
            required
          ></b-form-input>
        </b-col>
      </b-row>
      <div id="markdowneditor">
        <div id="mdeditor"></div>
      </div>
      <div class="write_tag_l_h">
        <b-row class="write_tag_form">
          <b-col sm="auto" class="write_tag_label">
            <label for="tags">태그</label>
          </b-col>
          <b-col sm="auto" class="write_help_btn_col">
            <i
              class="bi bi-question-circle-fill"
              id="write_help_btn"
              @mouseover="showHelp(true)"
              @mouseout="showHelp(false)"
            ></i>
          </b-col>
          <b-col class="write_help_text">
            <b-alert v-model="isHelpShow" class="help_alert">
              제일 왼쪽 태그가 메인태그가 됩니다. 엔터로 태그를 추가할 수
              있습니다.
            </b-alert>
          </b-col>
        </b-row>
        <div class="write_tags">
          <b-form-tags
            input-id="write_tagsId"
            placeholder=""
            v-model="tagvalue"
            no-outer-focus
            class="mb-2"
          >
            <template v-slot="{ tags, removeTag }">
              <b-form-input
                v-model="tagText"
                @keyup.enter="addTag"
              ></b-form-input>
              <ul
                v-if="tags.length > 0"
                class="list-inline d-inline-block mb-2"
              >
                <li
                  v-for="tag in tags"
                  :key="tag"
                  class="list-inline-item"
                  id="write_tag"
                >
                  <b-form-tag
                    :title="tag"
                    @remove="removeTag(tag)"
                    variant="secondary"
                    >{{ tag }}</b-form-tag
                  >
                </li>
              </ul>
              <div class="write_help"></div>
            </template>
          </b-form-tags>
        </div>
      </div>
      <b-button @click="posting"> 등록 </b-button>
    </div>
    <div v-else>
      <ErrorComponent
        :error="error"
        @routerpush="
          () => {
            this.isError = false;
          }
        "
      />
    </div>
  </div>
</template>
<script>
import Editor from "@toast-ui/editor";
import "../../assets/styles/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "prismjs/themes/prism-dark.css";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
      isPosted: false,
      isAuthorized: false,
      postdata: {
        title: "",
        content: "",
        mainTag: "",
        tags: [],
      },
      axiosdata: {},
      tagvalue: [],
      tagText: "",
      editor: null,
      isHelpShow: false,
    };
  },
  methods: {
    ...mapActions(["clearUserInfoAction"]),
    showHelp(isHovered) {
      if (!isHovered) {
        this.isHelpShow = false;
      } else {
        this.isHelpShow = true;
      }
    },
    checkBlank() {
      for (const key in this.postdata) {
        if (
          this.postdata[key] == "" ||
          (Array.isArray(this.postdata[key]) && this.postdata[key].length === 0)
        ) {
          return true;
        }
      }
      return false;
    },
    addTag() {
      if (this.tagText != "") {
        this.tagvalue.push(this.tagText);
        this.tagText = "";
      }
    },
    getTags() {
      this.postdata.mainTag = this.tagvalue[0];
      this.postdata.tags = this.tagvalue;
    },
    posting() {
      this.getTags();
      this.postdata.content = this.mdeditor.getMarkdown();
      if (this.checkBlank()) {
        window.alert("모든 칸을 입력해주세요.");
      } else {
        this.isPosted = true;
        if (this.$route.name === "free_write") {
          this.axios
            .post("/freeboard/write", this.postdata)
            .then((response) => {
              if (response.status == 200) {
                this.$router.push({
                  name: "free_post",
                  params: { id: response.data.freeBoardPostId },
                });
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
        } else if (this.$route.name === "free_edit") {
          delete this.postdata.writer;
          this.axios
            .put(`/freeboard/${this.$route.params.id}/edit`, this.postdata)
            .then((response) => {
              if (response.status == 200) {
                this.$router.push({
                  name: "free_post",
                  params: { id: this.$route.params.id },
                });
              } else {
                this.$router.push({ name: "home" });
              }
            })
            .catch((error) => {
              if (error.response) {
                this.error.status = error.response.status;
                this.error.message = error.response.data.message;
                this.isError = true;
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
            })
            .finally(() => {});
        }
      }
    },
    unLoadEvent(event) {
      event.preventDefault();
      event.returnValue = "";
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isAuthorized) {
      window.confirm("비정상적인 접근입니다.");
      next(true);
      return;
    }
    if (!this.isPosted) {
      const answer = window.confirm("변경한 내용이 저장되지 않을 수 있습니다.");
      if (answer) {
        next(true);
      } else {
        next(false);
      }
    } else {
      next(true);
    }
  },
  mounted() {
    if (this.$route.name === "free_edit") {
      this.axios
        .get(`/freeboard/${this.$route.params.id}/edit`)
        .then((response) => {
          if (response.status == 200) {
            this.isAuthorized = true;

            this.axiosdata = response.data[0];
            this.postdata.title = this.axiosdata.free_title;
            this.postdata.content = this.axiosdata.free_content;
            this.tagvalue.push(response.data[0].free_main_tag);
            for (var i = 0; i < response.data[1].length; i++) {
              if (
                response.data[0].free_main_tag != response.data[1][i].tag_name
              ) {
                this.tagvalue.push(response.data[1][i].tag_name);
              }
            }
          } else {
            //수정하기?
            this.isAuthorized = false;
            this.$router.push({ name: "home" });
          }
        })
        .catch((error) => {
          if (error.response) {
            this.error.status = error.response.status;
            this.error.message = error.response.data.message;
            this.isError = true;
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        })
        .finally(() => {
          this.mdeditor = new Editor({
            el: document.querySelector("#mdeditor"),
            previewStyle: "tab",
            initialValue: this.postdata.content,
            height: "500px",
            initialEditType: "markdown",
            hideModeSwitch: true,
            plugins: [[codeSyntaxHighlight]],
          });
        });
    } else if (this.$route.name === "free_write") {
      this.isAuthorized = true;
      this.mdeditor = new Editor({
        el: document.querySelector("#mdeditor"),
        previewStyle: "tab",
        initialValue: this.postdata.content,
        height: "500px",
        initialEditType: "markdown",
        hideModeSwitch: true,
        plugins: [[codeSyntaxHighlight]],
      });
    }
    window.addEventListener("beforeunload", this.unLoadEvent);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.unLoadEvent);
  },
};
</script>
<style>
@import "../../assets/styles/bodywrite.css";
</style>
