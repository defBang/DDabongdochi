<template>
  <div class="postDetail">
    <div class="postInfo">
      <b-row>
        <b-col class="postNoInfo" sm="auto"> 번호 </b-col>
        <b-col class="postTitleInfo"> 제목 </b-col>
        <b-col class="postTagInfo" sm="auto"> 태그 </b-col>
        <b-col class="postDateInfo" sm="auto"> 작성일 </b-col>
        <b-col class="postRateInfo" sm="auto"> 추천수 </b-col>
      </b-row>
    </div>
    <div
      v-for="post in postsInfo.posts"
      :key="post.channel_post_id"
      class="Postlist"
    >
      <Postlist :post="post" :id="`postlist${post.no % 2}`"> </Postlist>
    </div>
    <div class="pagebar">
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
import Postlist from "../../components/MyPageList_Channel.vue";
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
      var data = { board: "channel", p };
      this.$emit("movepage", data);
      this.page = p;
    },
  },
};
</script>
<style>
@import "../../assets/styles/bodymypage.css";
</style>
