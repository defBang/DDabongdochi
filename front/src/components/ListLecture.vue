<template>
  <div class="postRow">
    <b-row>
      <b-col class="postNo" sm="auto">
        {{ post.no }}
      </b-col>
      <b-col class="postTitle">
        <span v-if="post.rate > 20" class="best">★</span>
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
      <b-col class="postLecturer" sm="auto">
        <router-link
          class="link"
          :to="{
            name: 'lecture',
            query: { searchoption: 'lecturer', word: post.lecturer },
          }"
        >
          {{ post.lecturer }}
        </router-link>
      </b-col>
      <b-col class="postPlatform" sm="auto">
        {{ post.lecture_platform }}
      </b-col>
      <b-col class="postTag" sm="auto">
        <router-link
          class="link"
          :to="{
            name: 'lecture',
            query: { searchoption: 'tag', word: post.lecture_main_tag },
          }"
        >
          {{ post.lecture_main_tag }}
        </router-link>
      </b-col>
      <b-col class="postDate" sm="auto">
        {{ post.date }}
      </b-col>
      <b-col class="postRate" sm="auto">
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
          lecture_profil_img_link: "",
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
@import "../assets/styles/component.css";
</style>
