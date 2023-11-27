<template>
  <div>
    <b-row class="err_component">
      <b-col class="err_window" sm="auto">
        <b-row class="err_info">
          <b-col class="err_status"> {{ error_data.status }} Error!</b-col>
        </b-row>
        <b-row class="err_info">
          <b-col class="err_msg"> {{ error_data.message }} </b-col>
        </b-row>
        <b-row class="back_btn">
          <div>
            <b-button @click="backTo(this.$route.name)">
              목록으로 돌아가기
            </b-button>
          </div>
        </b-row>
      </b-col>
      <b-col class="errorimg" sm="auto">
        <img src="../assets/error.png" alt="error" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {
        return {
          status: 0,
          message: "",
        };
      },
    },
  },
  data() {
    return {
      error_data: {
        status: 0,
        message: "",
      },
    };
  },
  beforeRouteLeave() {},
  mounted() {
    this.error_data = this.error;
    if (this.error.status == 500) {
      this.error_data.message = "서버 오류!";
    }
    if (this.error.message == "" || this.error.message === undefined) {
      this.error_data.message = "error!";
    }
  },
  methods: {
    backTo(routename) {
      if (routename == "mypage") {
        this.$router.push({ name: "home" });
      } else {
        this.$router.push({ name: routename.split("_")[0] });
      }
      this.$emit("routerpush");
    },
  },
};
</script>
<style>
@import "../assets/styles/body.css";
</style>
