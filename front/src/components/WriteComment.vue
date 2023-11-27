<template>
  <div class="comment_write">
    <b-row>
      <b-col>
        <b-form-textarea
          placeholder="댓글을 입력해주세요."
          v-model="text"
          rows="3"
        />
      </b-col>
      <b-col sm="auto" class="comment_buttonarea">
        <b-button @click="writeComment" class="comment_writebutton">
          작성
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  methods: {
    writeComment() {
      if (this.text == "") {
        window.alert("내용을 작성해 주세요");
      } else {
        this.$emit("post", this.text);
      }
    },
  },
};
</script>
