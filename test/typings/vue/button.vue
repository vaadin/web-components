<script setup lang="ts">
import { ref } from 'vue';

const disabled = ref(false);
</script>

<template>
  <vaadin-button theme="primary" :disabled="disabled" @click="disabled = true">Save</vaadin-button>

  <!-- @vue-expect-error number is not assignable to boolean -->
  <vaadin-button :disabled="1">Cancel</vaadin-button>
</template>
