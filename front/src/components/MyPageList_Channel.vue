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
            name: 'channel_post',
            params: { id: post.channel_post_id },
          }"
        >
          {{ post.channel_name }} [{{ post.comment_count }}]
        </router-link>
      </b-col>
      <b-col class="mypage_postTag" sm="auto">
        {{ post.channel_main_tag }}
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
          channel_post_id: "",
          channel_main_tag: "",
          channel_name: "",
          comment_count: 0,
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
