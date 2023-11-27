<template>
  <div class="pagebody">
    <div v-if="!isError">
      <div class="postdata">
        <div class="postdata_title">
          <h4>{{ postdata.lecture_name }} [{{ postdata.comment_count }}]</h4>
        </div>
        <div class="postdata_info">
          <b-row>
            <b-col class="postdata_cmtnum" sm="auto">
              댓글
              <span class="postdata_info_text">{{
                postdata.comment_count
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

            <b-col
              v-if="this.$store.state.user.isSignIn"
              class="postdata_edtdlt"
            >
              <b-button size="sm" class="editbutton" @click="editPost">
                <i class="bi bi-wrench-adjustable"></i>
                수정
              </b-button>
              <b-button
                v-if="isAdmin"
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
        <div class="postdata_content_lecture">
          <b-row>
            <b-col sm="auto">
              <img
                class="content_lecture_img"
                alt="lecture_thumnail"
                :src="postdata.lecture_profil_img_link"
              />
            </b-col>
            <b-col class="content_lecture_info">
              <b-row>
                <b-col class="content_lecture_name" sm="auto">
                  {{ postdata.lecture_name }}
                </b-col>
              </b-row>
              <b-row class="content_lecture_lecturer">
                <b-col class="content_lecture_lecturerkey" sm="auto">
                  강의자
                </b-col>
                <b-col class="content_lecture_lecturervalue">
                  {{ postdata.lecturer }}
                </b-col>
              </b-row>
              <b-row class="content_lecture_platform">
                <b-col class="content_lecture_platformkey" sm="auto">
                  플랫폼
                </b-col>
                <b-col class="content_lecture_platformvalue">
                  <a :href="postdata.lecture_platform_url">{{
                    postdata.lecture_platform
                  }}</a>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="content_lecture_link" sm="auto">
                  <a :href="postdata.lecture_link">
                    <b-button variant="outline-dark"> 강의 링크 </b-button>
                  </a>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
        <div class="postdata_tags">
          <b-form-tags
            v-model="tagvalue"
            placeholder=""
            no-outer-focus
            id="postdata_tagsId"
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
      postdata: {
        rate_up: 0,
        rate_down: 0,
      },
      tagvalue: [],
      comments: [],
      isAdmin: false,
    };
  },
  mounted() {
    this.axios
      .get(`/lecture/${this.$route.params.id}`)
      .then((response) => {
        if (response.status == 200) {
          if (isFinite(response.data[0].isAdmin)) {
            this.isAdmin = !!response.data[0].isAdmin;
          } else {
            this.isAdmin = !!parseInt(response.data[0].isAdmin);
          }
          this.postdata = response.data[1];
          this.tagvalue.push(response.data[1].lecture_main_tag);
          for (var i = 0; i < response.data[2].length; i++) {
            if (
              response.data[1].lecture_main_tag != response.data[2][i].tag_name
            ) {
              this.tagvalue.push(response.data[2][i].tag_name);
            }
          }

          this.comments = response.data[3];
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
        name: "lecture",
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
          .delete(`/lecture/${this.$route.params.id}/delete`)
          .then((response) => {
            if (response.status == 200) {
              this.$router.push({ name: "lecture" });
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
    editPost() {
      this.$router.push({
        name: "lecture_edit",
        params: { id: this.$route.params.id },
      });
    },
    rateup() {
      if (this.$store.state.user.isSignIn) {
        this.axios
          .put(`/recommender/rateUp`, {
            postId: this.$route.params.id,
            board: "lecture",
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
            board: "lecture",
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
          params: { board: "lecture" },
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
            params: { board: "lecture" },
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
