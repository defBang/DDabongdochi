<template>
  <div>
    <div class="pagebody" v-if="!isError">
      <div class="postboard">질문 게시판</div>
      <div class="modeButton">
        <b-button-group>
          <b-button
            variant="outline-dark"
            @click="this.$router.push({ name: 'devQnA' })"
          >
            전체글
          </b-button>
          <b-button
            variant="danger"
            @click="
              this.$router.push({ name: 'devQnA', query: { mode: 'best' } })
            "
          >
            추천글
          </b-button>
          <b-button variant="outline-dark" @click="posting"> 글쓰기 </b-button>
        </b-button-group>
      </div>
      <div
        v-if="$route.name == 'devQnA' || $route.name == 'home'"
        class="postDetail"
      >
        <div class="postInfo">
          <b-row>
            <b-col class="postNoInfo" sm="auto"> 번호 </b-col>
            <b-col class="postTitleInfo"> 제목 </b-col>
            <b-col class="postWriterInfo" sm="auto"> 작성자 </b-col>
            <b-col class="postTagInfo" sm="auto"> 태그 </b-col>
            <b-col class="postDateInfo" sm="auto"> 작성일 </b-col>
            <b-col class="postRateInfo" sm="auto"> 추천수 </b-col>
          </b-row>
        </div>
        <div
          v-for="post in posts"
          :key="post.question_post_id"
          class="Postlist"
        >
          <Postlist :post="post" :id="`postlist${post.no % 2}`"> </Postlist>
        </div>
        <div class="pagebar">
          <b-button-group>
            <b-button
              variant="outline-dark"
              v-if="this.$route.query.p > 1"
              @click="pageTo(1)"
            >
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
        <div class="searchbar">
          <b-row>
            <b-col sm="auto">
              <b-form-select
                id="searchOption"
                v-model="word.option"
                :options="options"
              ></b-form-select>
            </b-col>
            <b-col sm="auto">
              <b-form-input
                content-cols="3"
                id="searchWord"
                v-model="word.search"
                type="search"
                show
                v-on:keyup.enter="doSearch"
              ></b-form-input>
            </b-col>
            <b-col sm="auto">
              <b-button variant="outline-dark" @click="doSearch">
                검색
              </b-button>
            </b-col>
          </b-row>
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
import Postlist from "../components/ListQnA.vue";
export default {
  components: {
    Postlist,
  },
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
      word: {
        option: "title",
        search: "",
      },
      options: [
        { value: "title", text: "제목" },
        { value: "writer", text: "글쓴이" },
        { value: "tag", text: "태그" },
      ],
      posts: [],
      pages: [],
      pageinfo: {},
      mode: "",
      page: 0,
    };
  },
  mounted() {
    var url;
    var axiosQuery = {};
    if (this.$route.query.searchoption !== undefined) {
      url = "/devQnA/search";
      switch (this.$route.query.searchoption) {
        case "title":
          axiosQuery = {
            title: this.$route.query.word,
            p: this.$route.query.p,
          };
          break;
        case "writer":
          axiosQuery = {
            writer: this.$route.query.word,
            p: this.$route.query.p,
          };
          break;
        case "tag":
          axiosQuery = { tag: this.$route.query.word, p: this.$route.query.p };
          break;
      }
    } else {
      url = "/devQnA";
      if (this.$route.query.mode == "best") {
        axiosQuery = { mode: this.$route.query.mode, p: this.$route.query.p };
        this.mode = this.$route.query.mode;
      } else {
        axiosQuery = { p: this.$route.query.p };
      }
    }
    this.axios
      .get(url, { params: axiosQuery })
      .then((response) => {
        if (response.status == 200) {
          if (this.$route.query.p === undefined) {
            this.page = 1;
          } else {
            this.page = this.$route.query.p;
          }
          var data = response.data;
          this.pageinfo = data[0];
          this.posts = data[1];
          for (
            var i = this.pageinfo.startPage;
            i <= this.pageinfo.endPage;
            i++
          ) {
            this.pages.push(i);
          }
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
  },
  methods: {
    pageTo(index) {
      var qString = {};
      if (this.mode == "best") {
        qString = { mode: this.mode, p: index };
      } else if (this.$route.query.searchoption != undefined) {
        qString = {
          searchoption: this.$route.query.searchoption,
          word: this.$route.query.word,
          p: index,
        };
      } else {
        qString = { p: index };
      }
      this.$router.push({ name: "devQnA", query: qString });
    },
    doSearch() {
      var qString = {};
      if (this.word.search != "") {
        qString = {
          searchoption: this.word.option,
          word: this.word.search,
        };
      }
      this.$router.push({ name: "devQnA", query: qString });
    },
    posting() {
      if (this.$store.state.user.isSignIn) {
        this.$router.push({ name: "devQnA_write" });
      } else {
        window.alert("로그인이 필요합니다.");
        this.$emit("signInRequired");
      }
    },
  },
};
</script>
<style>
@import "../assets/styles/body.css";
</style>
