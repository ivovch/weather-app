<template>
  <div class="modal-wrapper">
    <div class="modal-overlay">
      <div class="modal-content">
        <h3><slot>Confirm action ?</slot></h3>
        <div class="modal-content__buttons">
          <button @click="confirmHandler">Yes</button>
          <button @click="closeModal">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
const emits = defineEmits(["closeModal", "confirmation"]);

function confirmHandler() {
  emits("confirmation");
}

function closeModal() {
  emits("closeModal");
}
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачная подложка */
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  background-color: #fff; /* Белый непрозрачный блок */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 2;

  .modal-content__buttons {
    display: flex;
    justify-content: center;
    gap: 20px;

    button {
      padding: 10px 20px;
    }
  }
}

@media (max-width: 576px) {
  .modal-content {
    width: 90%;
  }
}
</style>
