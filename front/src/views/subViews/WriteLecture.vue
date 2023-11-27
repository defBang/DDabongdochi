<template>
  <div class="pagebody">
    <div v-if="!isError">
      <b-row class="write_lecture_form">
        <b-col sm="auto" class="write_lecture_label"> 강의 이름 </b-col>
        <b-col>
          <b-form-input
            v-model="postdata.title"
            placeholder="강의 이름을 입력해주세요."
            required
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="write_lecture_form">
        <b-col sm="auto" class="write_lecture_label"> 강의자 </b-col>
        <b-col>
          <b-form-input
            v-model="postdata.lecturer"
            placeholder="강의자 이름을 입력해주세요."
            required
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="write_lecture_form">
        <b-col sm="auto" class="write_lecture_label"> 강의 링크 </b-col>
        <b-col>
          <b-form-input
            v-model="postdata.link"
            placeholder="강의의 URL을 입력해주세요."
            required
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="write_lecture_form">
        <b-col sm="auto" class="write_lecture_label">
          강의 섬네일 이미지
        </b-col>
        <b-col>
          <b-form-input
            v-model="postdata.profilImgLink"
            placeholder="강의 섬네일 이미지의 URL을 입력해주세요."
            required
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="write_lecture_form">
        <b-col sm="auto" class="write_lecture_label"> 플랫폼 </b-col>
        <b-col sm="auto">
          <b-form-select
            id="platformSelect"
            v-model="platform.id"
            :options="options"
            @change="platformSelect"
          ></b-form-select>
        </b-col>
        <b-col v-if="platform.id == 9">
          <b-form-input
            v-model="postdata.platform"
            placeholder="강의 플랫폼을 입력해주세요."
            required
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="write_lecture_form" v-if="platform.id == 9">
        <b-col sm="auto" class="write_lecture_label"> 플랫폼 주소 </b-col>
        <b-col>
          <b-form-input
            v-model="postdata.platformUrl"
            placeholder="강의 플랫폼 URL을 입력해주세요."
            required
          ></b-form-input>
        </b-col>
      </b-row>
      <div class="write_tag_l_h">
        <b-row class="write_tag_form">
          <b-col sm="auto" class="write_tag_label">
            <label for="tags">태그</label>
          </b-col>
          <b-col sm="auto" class="write_help_btn_col">
            <i
              class="bi bi-question-circle-fill"
              id="write_help_btn"
              @mouseover="showHelp(true)"
              @mouseout="showHelp(false)"
            ></i>
          </b-col>
          <b-col class="write_help_text">
            <b-alert v-model="isHelpShow" class="help_alert">
              제일 왼쪽 태그가 메인태그가 됩니다. 엔터로 태그를 추가할 수
              있습니다.
            </b-alert>
          </b-col>
        </b-row>
        <div class="write_tags">
          <b-form-tags
            input-id="write_tagsId"
            placeholder=""
            v-model="tagvalue"
            no-outer-focus
            class="mb-2"
          >
            <template v-slot="{ tags, removeTag }">
              <b-form-input
                v-model="tagText"
                @keyup.enter="addTag"
              ></b-form-input>
              <ul
                v-if="tags.length > 0"
                class="list-inline d-inline-block mb-2"
              >
                <li
                  v-for="tag in tags"
                  :key="tag"
                  class="list-inline-item"
                  id="write_tag"
                >
                  <b-form-tag
                    :title="tag"
                    @remove="removeTag(tag)"
                    variant="secondary"
                    >{{ tag }}</b-form-tag
                  >
                </li>
              </ul>
              <div class="write_help"></div>
            </template>
          </b-form-tags>
        </div>
      </div>
      <b-button @click="posting"> 등록 </b-button>
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      error: {
        status: 0,
        message: "",
      },
      isError: false,
      isPosted: false,
      tag: "",
      postdata: {
        title: "",
        platform: "인프런",
        platformUrl: 0,
        lecturer: "",
        link: "",
        profilImgLink: "",
        mainTag: "",
        tags: [],
      },
      platform: {
        id: 0,
        name: "",
      },
      options: [
        { value: 0, text: "인프런" },
        { value: 1, text: "패스트캠퍼스" },
        { value: 2, text: "프로그래머스" },
        { value: 3, text: "edwith" },
        { value: 4, text: "부스트코스" },
        { value: 5, text: "K-MOOC" },
        { value: 6, text: "Udemy" },
        { value: 7, text: "구름EDU" },
        { value: 8, text: "KOCW" },
        { value: 9, text: "직접입력" },
      ],
      axiosdata: {},
      tagvalue: [],
      tagText: "",
      isHelpShow: false,
    };
  },
  components: {},
  methods: {
    ...mapActions(["clearUserInfoAction"]),
    platformSelect(value) {
      if (value != 9) {
        this.postdata.platform = this.options[value].text;
        this.postdata.platformUrl = this.options[value].value;
      } else {
        this.postdata.platform = "";
        this.postdata.platformUrl = "";
      }
    },
    showHelp(isHovered) {
      if (!isHovered) {
        this.isHelpShow = false;
      } else {
        this.isHelpShow = true;
      }
    },
    checkBlank() {
      if (this.postdata.title == "") {
        return true;
      } else if (this.postdata.platform == "") {
        return true;
      } else if (
        !isFinite(this.postdata.platformUrl) &&
        this.postdata.platformUrl == ""
      ) {
        return true;
      } else if (this.postdata.lecturer == "") {
        return true;
      } else if (this.postdata.link == "") {
        return true;
      } else if (this.postdata.profilImgLink == "") {
        return true;
      } else if (this.postdata.mainTag == "") {
        return true;
      } else if (this.postdata.tags.length === 0) {
        return true;
      }
      return false;
    },
    addTag() {
      if (this.tagText != "") {
        this.tagvalue.push(this.tagText);
        this.tagText = "";
      }
    },
    getTags() {
      this.postdata.mainTag = this.tagvalue[0];
      this.postdata.tags = this.tagvalue;
    },
    posting() {
      this.getTags();
      if (this.checkBlank()) {
        window.alert("모든 칸을 입력해주세요.");
      } else {
        this.isPosted = true;
        if (this.$route.name === "lecture_write") {
          this.axios
            .post("/lecture/write", this.postdata)
            .then((response) => {
              if (response.status == 200) {
                this.$router.push({
                  name: "lecture_post",
                  params: { id: response.data.lecture_post_id },
                });
              }
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status == 403) {
                  this.clearUserInfoAction();
                } else {
                  this.error.status = error.response.status;
                  this.error.message = error.response.data.message;
                  this.isError = true;
                }
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
            })
            .finally(() => {});
        } else if (this.$route.name === "lecture_edit") {
          this.axios
            .put(`/lecture/${this.$route.params.id}/edit`, this.postdata)
            .then((response) => {
              if (response.status == 200) {
                this.$router.push({
                  name: "lecture_post",
                  params: { id: this.$route.params.id },
                });
              } else {
                this.$router.push({ name: "home" });
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
        }
      }
    },
    unLoadEvent(event) {
      event.preventDefault();
      event.returnValue = "";
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isAuthorized) {
      window.confirm("비정상적인 접근입니다.");
      next(true);
      return;
    }
    if (!this.isPosted) {
      const answer = window.confirm("변경한 내용이 저장되지 않을 수 있습니다.");
      if (answer) {
        next(true);
      } else {
        next(false);
      }
    } else {
      next(true);
    }
  },
  beforeRouteEnter() {},
  mounted() {
    if (this.$route.name === "lecture_edit") {
      this.axios
        .get(`/lecture/${this.$route.params.id}/edit`)
        .then((response) => {
          if (response.status == 200) {
            this.isAuthorized = true;

            this.axiosdata = response.data[0];
            this.postdata.title = this.axiosdata.lecture_name;
            if (this.axiosdata.lecture_platform_url === null) {
              this.platform.id = this.axiosdata.lecture_platform;
              this.postdata.platform =
                this.options[this.axiosdata.lecture_platform].text;
              this.postdata.platformUrl = this.axiosdata.lecture_platform;
            } else {
              this.platform.id = 9;
              this.postdata.platform = this.axiosdata.lecture_platform;
              this.postdata.platformUrl = this.axiosdata.lecture_platform_url;
            }
            this.postdata.lecturer = this.axiosdata.lecturer;
            this.postdata.link = this.axiosdata.lecture_link;
            this.postdata.profilImgLink =
              this.axiosdata.lecture_profil_img_link;
            this.tagvalue.push(response.data[0].lecture_main_tag);
            for (var i = 0; i < response.data[1].length; i++) {
              if (
                response.data[0].lecture_main_tag !=
                response.data[1][i].tag_name
              ) {
                this.tagvalue.push(response.data[1][i].tag_name);
              }
            }
          } else {
            //수정하기?
            this.isAuthorized = false;
            this.$router.push({ name: "home" });
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
    } else if (this.$route.name === "lecture_write") {
      this.isAuthorized = true;
    }
    window.addEventListener("beforeunload", this.unLoadEvent);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.unLoadEvent);
  },
};
</script>
<style>
@import "../../assets/styles/bodywrite.css";
</style>
