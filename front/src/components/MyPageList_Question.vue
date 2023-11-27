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
            name: 'devQnA_post',
            params: { id: post.question_post_id },
          }"
        >
          {{ post.question_title }} [{{ post.answer_count }}]
        </router-link>
      </b-col>
      <b-col class="mypage_postWriter" sm="auto">
        {{ post.question_writer_nickname }}
      </b-col>
      <b-col class="mypage_postTag" sm="auto">
        {{ post.question_main_tag }}
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
          no: "",
          question_post_id: 0,
          question_main_tag: "",
          question_title: "",
          answer_count: 0,
          question_writer: 0,
          answer_writer_nickname: "",
          date: "",
          rate: 0,
        };
      },
    },
  },
  methods: {},
};
</script>
<style>
@import "../assets/styles/componentmypage.css";
</style>
