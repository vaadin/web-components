<script setup lang="ts">
import { ref } from 'vue';
import type { TextFieldValueChangedEvent } from '@vaadin/text-field';

const value = ref('');
const count = ref(0);

function onValueChanged(event: TextFieldValueChangedEvent) {
  value.value = event.detail.value;
}

function onCountChanged(event: CustomEvent<{ value: number }>) {
  count.value = event.detail.value;
}
</script>

<template>
  <vaadin-text-field
    id="name"
    :value="value"
    label="Name"
    error-message="Required"
    :clear-button-visible="true"
    theme="small"
    @value-changed="onValueChanged"
    @change="(e: Event) => console.log(e.type)"
    @click="() => console.log('click')"
  />

  <vaadin-text-field :clearButtonVisible="true" :value="value" />

  <!-- @vue-expect-error number is not assignable to string -->
  <vaadin-text-field :value="count" />

  <!-- @vue-expect-error unknown property -->
  <vaadin-text-field :bogus="count" />

  <!-- @vue-expect-error handler detail type mismatch -->
  <vaadin-text-field @value-changed="onCountChanged" />
</template>
