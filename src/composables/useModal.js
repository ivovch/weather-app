import { ref } from "vue";

const show = ref(false);
const component = ref();
export function useModal() {
  return {
    show,
    component,

    openModal: () => {
      show.value = true;
    },
    closeModal: () => {
      show.value = false;
    },
  };
}
