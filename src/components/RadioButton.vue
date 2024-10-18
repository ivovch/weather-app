<template>
  <div class="radio-button">
    <label
      ><input
        type="radio"
        :value="true"
        class="input-radio off"
        name="radio"
        v-model="innerValue"
      />Show current weather</label
    >
    <label
      ><input
        type="radio"
        :value="false"
        class="input-radio on"
        name="radio"
        v-model="innerValue"
      />
      Show 5 days forecast</label
    >
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, computed } from "vue";

const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue"]);
const innerValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    return emits("update:modelValue", value);
  },
});
</script>

<style scoped>
.radio-button {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}
</style>
