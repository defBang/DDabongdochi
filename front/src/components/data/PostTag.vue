<!--안쓰는 거-->
<template>
  <div>
    <b-form-tags v-model="value" no-outer-focus class="mb-2">
      <template v-slot="{ tags, disabled, addTag, removeTag }">
        <b-row>
          <b-col>
            <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
              <li v-for="tag in tags" :key="tag" class="list-inline-item">
                <b-form-tag
                  @remove="removeTag(tag)"
                  :title="tag"
                  :disabled="disabled"
                  variant="secondary"
                  >{{ tag }}</b-form-tag
                >
              </li>
            </ul>
          </b-col>
          <b-col sm="auto">
            <b-dropdown
              size="sm"
              variant="outline-secondary"
              block
              menu-class="w-100"
            >
              <template #button-content> Choose tags </template>
              <b-dropdown-form @submit.stop.prevent="() => {}">
                <b-form-group
                  label="Search tags"
                  label-for="tag-search-input"
                  label-cols-md="auto"
                  class="mb-0"
                  label-size="sm"
                  :disabled="disabled"
                >
                  <b-form-input
                    v-model="search"
                    id="tag-search-input"
                    type="search"
                    size="sm"
                    autocomplete="off"
                  ></b-form-input>
                </b-form-group>
              </b-dropdown-form>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item-button
                v-for="option in availableOptions"
                :key="option"
                @click="onOptionClick({ option, addTag })"
              >
                {{ option }}
              </b-dropdown-item-button>
            </b-dropdown>
          </b-col>
        </b-row>
      </template>
    </b-form-tags>
  </div>
</template>

<script>
export default {
  props: {
    tagvalue: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      options: [
        "Apple",
        "Orange",
        "Banana",
        "Lime",
        "Peach",
        "Chocolate",
        "Strawberry",
        "Node.js",
      ],
      search: "",
      value: [],
    };
  },
  computed: {
    criteria() {
      return this.search.trim().toLowerCase();
    },
    availableOptions() {
      const criteria = this.criteria;
      const options = this.options.filter(
        (opt) => this.value.indexOf(opt) === -1
      );
      if (criteria) {
        return options.filter(
          (opt) => opt.toLowerCase().indexOf(criteria) > -1
        );
      }
      return options;
    },
  },
  mounted() {
    this.value = this.tagvalue;
  },
  methods: {
    getSelectedTag() {
      return this.value;
    },
    onOptionClick({ option, addTag }) {
      addTag(option);
      this.search = "";
    },
  },
};
</script>
