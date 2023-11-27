<template>
  <div class="mypage_postRow">
    <b-row>
      <b-col class="mypage_postNo" sm="auto">
        {{ post.no }}
      </b-col>
      <b-col class="mypage_postTitle">
        <span v-if="post.rate > 20" class="mypage_best">★</span>
        <router-link
          class="link"
          :to="{
            name: 'lecture_post',
            params: { id: post.lecture_post_id },
          }"
        >
          {{ post.lecture_name }} [{{ post.comment_count }}]
        </router-link>
      </b-col>
      <b-col class="mypage_postLecturer" sm="auto">
        {{ post.lecturer }}
      </b-col>
      <b-col class="mypage_postPlatform" sm="auto">
        {{ post.lecture_platform }}
      </b-col>
      <b-col class="mypage_postTag" sm="auto">
        {{ post.lecture_main_tag }}
      </b-col>
      <b-col class="mypage_postDate" sm="auto">
        {{ post.date }}
      </b-col>
      <b-col class="mypage_postRate" sm="auto">
        {{ post.rate }}
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {
        return {
          no: 0,
          lecture_post_id: "",
          lecture_main_tag: "",
          lecture_platform: "",
          lecture_name: "",
          comment_count: 0,
          lecturer: "",
          date: "",
          rate: 0,
        };
      },
    },
  },
  mounted() {},
};
</script>
<style>
@import "../assets/styles/componentmypage.css";
</style>
