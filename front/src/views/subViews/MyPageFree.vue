<template>
  <div class="mypage_postDetail">
    <div class="mypage_postInfo">
      <b-row>
        <b-col class="mypage_postNoInfo" sm="auto"> 번호 </b-col>
        <b-col class="mypage_postTitleInfo"> 제목 </b-col>
        <b-col class="mypage_postWriterInfo" sm="auto"> 작성자 </b-col>
        <b-col class="mypage_postTagInfo" sm="auto"> 태그 </b-col>
        <b-col class="mypage_postDateInfo" sm="auto"> 작성일 </b-col>
        <b-col class="mypage_postRateInfo" sm="auto"> 추천수 </b-col>
      </b-row>
    </div>
    <div
      v-for="post in postsInfo.posts"
      :key="post.free_post_id"
      class="mypage_Postlist"
    >
      <Postlist :post="post" :id="`postlist${post.no % 2}`"> </Postlist>
    </div>
    <div class="mypage_pagebar">
      <b-button-group>
        <b-button variant="outline-dark" v-if="page > 1" @click="pageTo(1)">
          &lt;&lt;
        </b-button>
        <b-button
          variant="outline-dark"
          v-if="pageinfo.isPrev"
          @click="pageTo(pages[0] - 1)"
        >
          &lt;
        </b-button>
        <b-button
          variant="outline-dark"
          v-for="n in pages"
          :key="n"
          @click="pageTo(n)"
        >
          {{ n }}
        </b-button>
        <b-button
          variant="outline-dark"
          v-if="pageinfo.isNext"
          @click="pageTo(pages[pages.length - 1] + 1)"
        >
          &gt;
        </b-button>
        <b-button
          variant="outline-dark"
          v-if="page < pageinfo.totalPages"
          @click="pageTo(pageinfo.totalPages)"
        >
          &gt;&gt;
        </b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
import Postlist from "../../components/MyPageList_Free.vue";
export default {
  props: {
    postsInfo: {
      type: Object,
      default: () => {
        return {
          pageInfo: {},
          posts: [],
        };
      },
    },
    isRecommended: Boolean,
  },
  data() {
    return {
      pages: [],
      pageinfo: {},
      posts: [],
      page: 1,
    };
  },
  components: {
    Postlist,
  },
  updated() {
    this.pages = [];
    if (this.postsInfo.pageInfo !== undefined) {
      this.load();
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.pageinfo = this.postsInfo.pageInfo;
      this.posts = this.postsInfo.posts;
      for (var i = this.pageinfo.startPage; i <= this.pageinfo.endPage; i++) {
        this.pages.push(i);
      }
    },
    pageTo(p) {
      var data;
      if (this.isRecommended) {
        data = { board: "freeboard", p };
      } else {
        data = { category: "freeboard", p };
      }
      this.$emit("movepage", data);
      this.page = p;
    },
  },
};
</script>
<style>
@import "../../assets/styles/bodymypage.css";
</style>
