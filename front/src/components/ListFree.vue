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
            name: 'free_post',
            params: { id: post.free_post_id },
          }"
        >
          {{ post.free_title }} [{{ post.comment_count }}]
        </router-link>
      </b-col>
      <b-col class="postWriter" sm="auto">
        <router-link
          :to="{
            name: 'free',
            query: {
              searchoption: 'writer',
              word: post.free_writer_nickname,
            },
          }"
        >
          {{ post.free_writer_nickname }}
        </router-link>
      </b-col>
      <b-col class="postTag" sm="auto">
        <router-link
          class="link"
          :to="{
            name: 'free',
            query: { searchoption: 'tag', word: post.free_main_tag },
          }"
        >
          {{ post.free_main_tag }}
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
  <!--
    <b-card style="padding: 0" id="postcard">
    <b-card-body class="posttitle">
      <span class="postid">{{ post.no }}</span>
      <span v-if="post.rate > 20">★</span> {{ post.question_title }} [{{
        post.answer_count
      }}] | {{ post.question_writer }}
      
      <router-link
        :to="{
          path: 'lecture',
          query: { searchoption: 'title', word: question_writer },
        }"
        >{{ post.question_writer }}</router-link
      >
      | {{ post.date }} | {{ post.rate }}
    </b-card-body>
  </b-card>
  -->
</template>
<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {
        return {
          no: "",
          free_post_id: 0,
          free_main_tag: "",
          free_title: "",
          comment_count: 0,
          free_writer: 0,
          free_writer_nickname: "",
          date: "",
          rate: 0,
        };
      },
    },
  },
  methods: {
    linkTo(link) {
      this.$emit("route", link);
    },
  },
};
</script>
<style>
@import "../assets/styles/component.css";
</style>
