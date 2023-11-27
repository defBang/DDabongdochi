<template>
  <div class="pagebody">
    <div v-if="!isError">
      <div class="postdata">
        <div class="postdata_title">
          <h4>{{ postdata.free_title }} [{{ postdata.comment_count }}]</h4>
        </div>
        <div class="postdata_info">
          <b-row>
            <b-col class="postdata_writer" sm="auto">
              작성자
              <span class="postdata_info_text">{{
                postdata.free_writer_nickname
              }}</span>
            </b-col>
            <b-col class="postdata_date" sm="auto">
              작성일
              <span class="postdata_info_text">{{ postdata.date }}</span>
            </b-col>
            <b-col
              class="postdata_recentdate"
              v-if="postdata.recent_update_date !== null"
              sm="auto"
            >
              수정일
              <span class="postdata_info_text">{{
                postdata.recent_update_date
              }}</span>
            </b-col>
            <b-col class="postdata_edtdlt">
              <b-button
                v-if="isWriter"
                size="sm"
                class="editbutton"
                @click="editPost"
              >
                <i class="bi bi-wrench-adjustable"></i>
                수정
              </b-button>
              <b-button
                v-if="isWriter || isAdmin"
                size="sm"
                class="deletebutton"
                @click="deletePost"
              >
                <i class="bi bi-trash3"></i>
                삭제
              </b-button>
            </b-col>
          </b-row>
        </div>
        <div class="postdata_content">
          <div id="viewer"></div>
        </div>
        <div class="postdata_tags">
          <b-form-tags
            id="postdata_tagsId"
            v-model="tagvalue"
            placeholder=""
            no-outer-focus
          >
            <template v-slot="{ tags }">
              <ul
                v-if="tags.length > 0"
                id="postdata_tag"
                class="list-inline d-inline-block"
              >
                <li v-for="tag in tags" :key="tag" class="list-inline-item">
                  <b-form-tag
                    :title="tag"
                    no-remove
                    variant="secondary"
                    class="post_tag"
                    @click="routePush(tag)"
                    >{{ tag }}</b-form-tag
                  >
                </li>
              </ul>
            </template>
          </b-form-tags>
        </div>
        <div>
          <b-button
            class="ratebutton_up"
            variant="outline-danger"
            @click="rateup()"
          >
            추천 <br />
            {{ postdata.rate_up }}
          </b-button>
          <b-button
            class="ratebutton_down"
            variant="outline-primary"
            @click="ratedown()"
          >
            비추천 <br />
            {{ -postdata.rate_down }}
          </b-button>
        </div>
      </div>
      <div class="postdata_comments">
        <WriteCOMMENT @post="uploadComment" />
        <div
          class="postdata_comment"
          v-for="comment in comments"
          :key="comment.comment_id"
        >
          <COMMENT @receiveSignal="sendSignal" :comment="comment" />
        </div>
      </div>
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
import COMMENT from "../../components/ListComment.vue";
import WriteCOMMENT from "../../components/WriteComment.vue";
import "../../assets/styles/TUI-viewer.css";
import "prismjs/themes/prism-dark.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
import { mapActions } from "vuex";
export default {
  components: {
    COMMENT,
    WriteCOMMENT,
  },
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
      viewer: null,
      postdata: {
        rate_up: 0,
        rate_down: 0,
      },
      tagvalue: [],
      comments: [],
      isWriter: false,
      isAdmin: false,
    };
  },
  mounted() {
    this.axios
      .get(`/freeboard/${this.$route.params.id}`)
      .then((response) => {
        if (response.status == 200) {
          if (isFinite(response.data[0].isAdmin)) {
            this.isAdmin = !!response.data[0].isAdmin;
          } else {
            this.isAdmin = !!parseInt(response.data[0].isAdmin);
          }
          this.postdata = response.data[1];
          this.tagvalue.push(response.data[1].free_main_tag);
          for (var i = 0; i < response.data[2].length; i++) {
            if (
              response.data[1].free_main_tag != response.data[2][i].tag_name
            ) {
              this.tagvalue.push(response.data[1][i].tag_name);
            }
          }
          this.viewer = new Viewer({
            el: document.querySelector("#viewer"),
            initialValue: this.postdata.free_content,
            plugins: [[codeSyntaxHighlight]],
          });
          this.comments = response.data[3];
          if (this.postdata.free_writer == this.$store.state.user.userId) {
            this.isWriter = true;
          } else {
            this.isWriter = false;
          }
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
  },
  methods: {
    ...mapActions(["clearUserInfoAction"]),
    routePush(tag) {
      this.$router.push({
        name: "free",
        query: {
          searchoption: "tag",
          word: tag,
        },
      });
    },
    deletePost() {
      const comment = window.confirm("진짜 삭제할까요?");
      if (comment) {
        this.axios
          .delete(`/freeboard/${this.$route.params.id}/delete`)
          .then((response) => {
            if (response.status == 200) {
              this.$router.push({ name: "free" });
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
      }
    },
    editPost() {
      this.$router.push({
        name: "free_edit",
        params: { id: this.$route.params.id },
      });
    },
    rateup() {
      if (this.$store.state.user.isSignIn) {
        this.axios
          .put(`/recommender/rateUp`, {
            postId: this.$route.params.id,
            board: "freeboard",
          })
          .then((response) => {
            if (response.status == 200) {
              this.postdata.rate_up = response.data.rateUp;
              this.postdata.rate_down = response.data.rateDown;
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
        window.alert("로그인이 필요합니다.");
        this.$emit("signInRequired");
      }
    },
    ratedown() {
      if (this.$store.state.user.isSignIn) {
        this.axios
          .put(`/recommender/rateDown`, {
            postId: this.$route.params.id,
            board: "freeboard",
          })
          .then((response) => {
            if (response.status == 200) {
              this.postdata.rate_up = response.data.rateUp;
              this.postdata.rate_down = response.data.rateDown;
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
        window.alert("로그인이 필요합니다.");
        this.$emit("signInRequired");
      }
    },
    uploadComment(data) {
      //수정하기
      const postCommentData = {
        content: data,
      };
      this.axios
        .post(`/comment/${this.$route.params.id}`, postCommentData, {
          params: { board: "freeboard" },
        })
        .then((response) => {
          if (response.status == 200) {
            this.$router.go(0);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 403) {
              this.clearUserInfoAction();
              window.alert("로그인이 필요합니다.");
              this.$emit("signInRequired");
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
    },
    sendSignal(data) {
      var url = `/comment/${this.$route.params.id}/${data.comment_id}`;
      if (data.signal === "edit") {
        this.axios
          .put(url, { content: data.content })
          .then((response) => {
            if (response.status == 200) {
              this.$router.go(0);
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
      } else if (data.signal === "delete") {
        this.axios
          .delete(url, {
            params: { board: "freeboard" },
          })
          .then((response) => {
            if (response.status == 200) {
              this.$router.go(0);
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
    },
  },
};
</script>
<style>
@import "../../assets/styles/bodypost.css";
</style>
