<template>
  <div class="mypage_comment">
    <div class="mypage_comment_info">
      <b-row>
        <b-col class="mypage_comment_writer" sm="auto">
          {{ comment.comment_writer_nickname }}
        </b-col>
        <b-col class="mypage_comment_board">
          <span v-if="comment.lecture_post_id !== null">강의</span>
          <span v-else-if="comment.channel_post_id !== null">채널</span>
          <span v-else-if="comment.free_post_id !== null">자유</span>
          게시판
        </b-col>
        <b-col class="mypage_comment_date">
          <span
            v-if="
              comment.recent_update_date === null ||
              comment.recent_update_date === undefined
            "
          >
            작성일 {{ comment.date }}
          </span>
        </b-col>
        <b-col sm="auto">
          <b-button size="sm" @click="LinkToPost"> 게시글 보기 </b-button>
        </b-col>
      </b-row>
    </div>
    <div class="mypage_comment_content">
      {{ comment.comment_content }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: () => {
        return {
          no: 0,
          comment_id: "",
          lecture_post_id: null,
          channel_post_id: null,
          free_post_id: null,
          comment_writer: "",
          comment_writer_nickname: "",
          comment_content: "",
          date: "",
          recent_update_date: null,
        };
      },
    },
  },
  methods: {
    LinkToPost() {
      var router_name;
      var post_id;
      if (this.comment.lecture_post_id !== null) {
        router_name = "lecture_post";
        post_id = this.comment.lecture_post_id;
      } else if (this.comment.channel_post_id !== null) {
        router_name = "channel_post";
        post_id = this.comment.channel_post_id;
      } else if (this.comment.free_post_id !== null) {
        router_name = "free_post";
        post_id = this.comment.free_post_id;
      }
      this.$router.push({
        name: router_name,
        params: { id: post_id },
      });
    },
  },
};
</script>
<style>
@import "../assets/styles/componentmypage.css";
</style>
