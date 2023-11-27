<template>
  <div class="pagebody">
    <div v-if="!isError">
      <div class="postdata">
        <div class="postdata_title">
          <h4>{{ postdata.channel_name }} [{{ postdata.comment_count }}]</h4>
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
        <div class="postdata_content_channel">
          <div class="embedplayer">
            <iframe
              width="560"
              height="315"
              :src="`https://www.youtube.com/embed/${videoId}`"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <div class="postdata_channel_info">
            <div class="postdata_channel_link">
              <a
                class="postdata_channel_link_name"
                :href="postdata.channel_link"
              >
                <div class="postdata_channel_link_img_div">
                  <b-img
                    alt="channel_thumnail"
                    class="postdata_channel_link_img"
                    rounded="circle"
                    :src="postdata.channel_profile_img_link"
                  />
                </div>
                <div class="channel_link_name_row">
                  <div class="channel_link_name_col">
                    {{ postdata.channel_name }}
                  </div>
                  <div class="channel_link_name_url">
                    {{ channel_URL }}
                  </div>
                </div>
                <!--
                <b-row>
                  <b-col sm="auto">
                    <b-img
                      alt="channel_thumnail"
                      class="postdata_channel_link_img"
                      rounded="circle"
                      :src="postdata.channel_profile_img_link"
                    />
                  </b-col>
                  <b-col class="channel_link_name_div">
                    {{ postdata.channel_name }}
                  </b-col>
                </b-row>
              -->
              </a>
            </div>
          </div>
          <b-row class="content_channel_description_row" v-if="!isBlank">
            <div class="content_channel_description_div">
              <div class="content_channel_description_key">채널 설명</div>
              <div class="content_channel_description_value">
                {{ description }}
              </div>
            </div>
          </b-row>
          <b-row class="content_channel_info_row">
            <b-col sm="auto">
              <b-row class="postdata_content_channel_row">
                <b-col class="content_channel_title" sm="auto">
                  채널 세부정보
                </b-col>
              </b-row>
              <b-row class="postdata_content_channel_row">
                <b-col class="content_channel_link_key" sm="auto">
                  <i class="bi bi-link"></i> 채널 주소
                </b-col>
                <b-col class="content_channel_link_value" sm="auto">
                  {{ postdata.channel_link }}
                </b-col>
              </b-row>
              <b-row class="postdata_content_channel_row">
                <b-col class="content_channel_sbsc_key" sm="auto"
                  ><i class="bi bi-person"></i> 구독자
                </b-col>
                <b-col class="content_channel_sbsc_value" sm="auto">
                  {{ postdata.subscriber_count }}
                </b-col>
              </b-row>
              <b-row class="postdata_content_channel_row">
                <b-col class="content_channel_video_key" sm="auto">
                  <i class="bi bi-play-btn"></i> 동영상
                </b-col>
                <b-col class="content_channel_video_value" sm="auto">
                  {{ postdata.video_count }}
                </b-col>
              </b-row>
              <b-row class="postdata_content_channel_row">
                <b-col class="content_channel_view_key" sm="auto">
                  <i class="bi bi-graph-up-arrow"></i> 조회수
                </b-col>
                <b-col class="content_channel_view_value" sm="auto">
                  {{ postdata.view_count }}
                </b-col>
              </b-row>
              <b-row class="postdata_content_channel_row">
                <b-col class="content_channel_pblsh_key" sm="auto">
                  <i class="bi bi-info-circle"></i> 가입일
                </b-col>
                <b-col class="content_channel_pblsh_value" sm="auto">
                  {{ postdata.published_at }}
                </b-col>
              </b-row>
              <b-row class="postdata_content_channel_row">
                <b-col class="content_channel_country_key" sm="auto">
                  <i class="bi bi-globe-americas"></i> 국적
                </b-col>
                <b-col class="content_channel_country_value" sm="auto">
                  {{ postdata.country }}
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
      isBlank: true,
      videoId: "",
      description: ``,
      channel_URL: "",
    };
  },
  mounted() {
    this.axios
      .get(`/channel/${this.$route.params.id}`, { validateStatus: false })
      .then((response) => {
        if (response.status == 200) {
          if (isFinite(response.data[0].isAdmin)) {
            this.isAdmin = !!response.data[0].isAdmin;
          } else {
            this.isAdmin = !!parseInt(response.data[0].isAdmin);
          }
          this.postdata = response.data[1];
          this.videoId = this.generateVideoId(
            this.postdata.channel_main_video_link
          );
          this.postdata.subscriber_count =
            this.postdata.subscriber_count.toLocaleString();
          this.postdata.video_count =
            this.postdata.video_count.toLocaleString();
          this.postdata.view_count = this.postdata.view_count.toLocaleString();
          if (this.postdata.description != "") {
            this.description = `${this.postdata.description}`;
            this.isBlank = false;
          } else {
            this.isBlank = true;
          }
          if (this.postdata.channel_link.indexOf("//") != -1) {
            this.channel_URL = this.postdata.channel_link.split("//")[1];
          } else {
            this.channel_URL = this.postdata.channel_link;
          }
          this.tagvalue.push(response.data[1].channel_main_tag);
          for (var i = 0; i < response.data[2].length; i++) {
            if (
              response.data[1].channel_main_tag != response.data[2][i].tag_name
            ) {
              this.tagvalue.push(response.data[2][i].tag_name);
            }
          }
          this.comments = response.data[3];
        } else {
          this.error.status = response.status;
          this.error.message = response.data.message;
          this.isError = true;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  },
  methods: {
    ...mapActions(["clearUserInfoAction"]),
    generateVideoId(videoURL) {
      videoURL;
      var arrURL = videoURL.split("/");
      var queryURL = arrURL[arrURL.length - 1];
      var id;
      if (queryURL.indexOf("watch?v=") != -1) {
        id = queryURL.split("watch?v=")[1].split("&")[0].split("#")[0];
      } else {
        id = queryURL.split("?")[0].split("&")[0].split("#")[0];
      }
      return id;
    },
    routePush(tag) {
      this.$router.push({
        name: "channel",
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
          .delete(`/channel/${this.$route.params.id}/delete`)
          .then((response) => {
            if (response.status == 200) {
              this.$router.push({ name: "channel" });
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
        name: "channel_edit",
        params: { id: this.$route.params.id },
      });
    },
    rateup() {
      if (this.$store.state.user.isSignIn) {
        this.axios
          .put(`/recommender/rateUp`, {
            postId: this.$route.params.id,
            board: "channel",
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
            board: "channel",
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
          params: { board: "channel" },
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
            params: { board: "channel" },
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
