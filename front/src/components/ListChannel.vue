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
            name: 'channel_post',
            params: { id: post.channel_post_id },
          }"
        >
          {{ post.channel_name }} [{{ post.comment_count }}]
        </router-link>
      </b-col>
      <b-col class="postTag" sm="auto">
        <router-link
          class="link"
          :to="{
            name: 'channel',
            query: { searchoption: 'tag', word: post.channel_main_tag },
          }"
        >
          {{ post.channel_main_tag }}
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
@import "../assets/styles/component.css";
</style>
