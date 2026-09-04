<script setup lang="ts">
import { ref } from 'vue';
import type { ComboBoxSelectedItemChangedEvent } from '@vaadin/combo-box';

const items = ref(['Apple', 'Banana']);
const selected = ref<string | null | undefined>(null);

function onSelectedItemChanged(event: ComboBoxSelectedItemChangedEvent<string>) {
  selected.value = event.detail.value;
}
</script>

<template>
  <vaadin-combo-box
    label="Fruit"
    :items="items"
    :selected-item="selected"
    :allow-custom-value="true"
    @selected-item-changed="onSelectedItemChanged"
  />

  <!-- @vue-expect-error string is not assignable to items array -->
  <vaadin-combo-box :items="'Apple'" />
</template>
