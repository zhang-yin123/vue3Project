<template>
  <el-form :inline="true" ref="formRef" :model="FormData" class="SearchForm" :rules="rules || []">
    <el-form-item v-for="item in ItemList" :key="item.name" :label="item.label" :style="`width:${100 / (Num || 4)}%;`"
      :prop="item.name" v-bind="item.otherProp">
      <el-input v-if="item.type === 'input'" :placeholder="item.placeholder || ('请输入' + item.label)"
        v-model="FormData[item.name]" :disabled="item.disabled || false" v-bind="item.otherProp" />
      <el-select v-else-if="item.type === 'select'" :placeholder="item.placeholder || ('请选择' + item.label)"
        v-model="FormData[item.name]" :disabled="item.disabled || false" v-bind="item.otherProp">
        <el-option v-for="each in item.option" :key="each.value" :label="each.label" :value="each.value" />
      </el-select>
      <el-date-picker v-else-if="item.type === 'datePicker'" :type="item.dateType" v-model="FormData[item.name]" clearable
        :disabled="item.disabled || false" :range-separator="item.rangeSeparator || '-'"
        :placeholder="item.placeholder || '选择日期'" :start-placeholder="item.startPlaceholder || '开始时间'"
        :end-placeholder="item.endPlaceholder || '结束时间'" v-bind="item.otherProp" />
    </el-form-item>
    <div class="Action">
      <el-button class="submit" @click="submitForm" :icon="Search" v-if="!hideSubmit">查询</el-button>
      <el-button @click="resetForm()" :icon="RefreshLeft" v-if="!hideReset">重置</el-button>
      <slot name="extraBtn"></slot>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { RefreshLeft } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus'
import { ref, inject } from 'vue';
// const emit = defineEmits(['getSearch']);

type FormType = {
  type: 'input';
  name: string;
  label: string;
  disabled?: boolean;
  placeholder?: string;
  otherProp?: any
}

type ItemListType = FormType | (Omit<FormType, 'type'> & { type: 'select', option: Array<{ label: string, value: any }> }) | (Omit<FormType, 'type'> & { type: 'datePicker', dateType: 'year' | 'month' | 'date' | 'dates' | 'datetime' | ' week' | 'datetimerange' | 'daterange' | ' monthrange', rangeSeparator?: string, startPlaceholder?: string, endPlaceholder?: string })

const formRef = ref<FormInstance>();

const props = defineProps<{
  Num?: number;
  ItemList: ItemListType[];
  rules?: any;
  hideSubmit?: boolean;
  hideReset?: boolean;
}>()

const FormData = ref<any>({});

props.ItemList.forEach((item) => {
  FormData[item.name] = undefined;
});

const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      // emit('getSearch', { ...FormData.value })
      handleSubmit({ ...FormData.value })
    }
  });
}
const handleSubmit = inject<(args: any) => void>("handleSearch", () => { });

const resetForm = (fg?: boolean) => {
  if (formRef.value?.resetFields) {
    formRef.value?.resetFields();
  } else {
    Object.keys(FormData.value).forEach((key) => {
      FormData["value"][key] = undefined
    })
  }
  if (!fg) {
    handleSubmit({});
  }
}

const clearValidate = () => {
  formRef.value?.clearValidate();
}

//设置一组字段到指定值或重置
const resetField = (name: string, value?: any): void => {
  if (value) {
    FormData.value[name] = value;
  } else {
    FormData.value[name] = undefined;
  }
}

defineExpose({
  resetField,
  clearValidate,
  resetForm,
  submitForm,
  formRef
})

export type { ItemListType };

</script>

<style lang="scss" scoped>
.SearchForm {
  display: flex;
  flex-wrap: wrap;

  :deep(.el-form-item) {
    margin-right: 0;
    padding-right: 12px;
  }

  .Action {
    // display: flex;
    flex: 1;
    // text-align: right;
    margin-bottom: 18px;

    :deep(.el-form-item__content) {
      justify-content: flex-end;
      flex-wrap: nowrap;
    }

    :deep(.el-form.el-form--inline .el-form-item) {
      margin-bottom: 15px;

    }

    .submit {
      background-color: #3091FF;
      color: #fff;
    }

    .submit:hover {
      opacity: 0.8;
    }

    button {
      // display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
    }

  }
}
</style>

