<template>
  <div>
    <div v-if="!isEditing" class="comment">
      <div class="comment_info">
        <b-row>
          <b-col class="comment_writer" sm="auto">
            {{ comment.comment_writer_nickname }}
          </b-col>
          <b-col class="comment_date">
            <span
              v-if="
                comment.recent_update_date === null ||
                comment.recent_update_date === undefined
              "
            >
              작성일 {{ comment.date }}</span
            >
            <span v-else-if="comment.recent_update_date !== null">
              수정일 {{ comment.recent_update_date }}</span
            >
          </b-col>
          <b-col sm="auto">
            <b-button-group v-if="isCommentWriter">
              <b-button @click="editing" variant="outline-dark">
                <i class="bi bi-wrench-adjustable"></i>
                수정
              </b-button>
              <b-button @click="sendSignal('delete')" variant="outline-dark">
                <i class="bi bi-trash3"></i>
                삭제
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
      </div>
      <div class="comment_content">
        {{ comment.comment_content }}
      </div>
    </div>
    <div v-else-if="isEditing">
      <b-row>
        <b-col>
          <b-form-textarea v-model="edittext" rows="3" />
        </b-col>
        <b-col sm="auto">
          <b-button @click="sendSignal('edit')">수정</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: () => {
        return {
          comment_id: "",
          lecture_post_id: null,
          channel_post_id: null,
          free_post_id: null,
          comment_writer: "",
          comment_writer_nickname: "",
          comment_content: "",
          date: "",
          recent_update_date: null,
        };
      },
    },
  },
  data() {
    return {
      isEditing: false,
      edittext: "",
      isCommentWriter: false,
    };
  },
  mounted() {
    if (this.comment.comment_writer == this.$store.state.user.userId) {
      this.isCommentWriter = true;
    } else {
      this.isCommentWriter = false;
    }
  },
  methods: {
    editing() {
      this.isEditing = true;
      this.edittext = this.comment.comment_content;
    },
    sendSignal(signal) {
      var data;
      if (signal === "edit") {
        data = {
          comment_id: this.comment.comment_id,
          signal: signal,
          content: this.edittext,
        };
      } else if (signal === "delete") {
        data = { comment_id: this.comment.comment_id, signal: signal };
      }
      this.$emit("receiveSignal", data);
    },
  },
};
</script>
<style>
@import "../assets/styles/component.css";
</style>
