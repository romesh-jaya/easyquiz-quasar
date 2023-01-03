<template>
  <q-dialog v-model="showDialogInternal" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="help_outline" color="primary" text-color="white" />
        <slot></slot>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="negativeLabel"
          :disabled="savingInProgress"
          color="accent"
          @click="emit('negativeButtonClicked')"
        />
        <q-btn
          flat
          :label="positiveLabel"
          :loading="savingInProgress"
          color="accent"
          @click="emit('positiveButtonClicked')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { toRefs, ref, watch } from 'vue';

const emit = defineEmits(['positiveButtonClicked', 'negativeButtonClicked']);

const props = defineProps({
  showDialog: { type: Boolean, required: true },
  negativeLabel: { type: String, required: true },
  positiveLabel: { type: String, required: true },
  savingInProgress: { type: Boolean, required: false, default: false },
});

const { showDialog } = toRefs(props);

const showDialogInternal = ref(false);

watch(showDialog, () => {
  showDialogInternal.value = showDialog.value;
});
</script>

<style lang="scss"></style>
