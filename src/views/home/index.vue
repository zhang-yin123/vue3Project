<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column property="name" label="姓名">
      <template #default="scope">
        <el-form :model="tableData[scope.$index]" label-width="0px" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="scope.row.name" placeholder="自动累计" disabled />
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column property="name" label="姓名">
      <template #default="scope">
        <el-form :model="tableData[scope.$index]" label-width="0px" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="scope.row.name" placeholder="自动累计" disabled />
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column property="name" label="姓名">
      <template #default="scope">
        <el-form :model="tableData[scope.$index]" label-width="0px" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="scope.row.name" placeholder="自动累计" disabled />
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TableDataType } from "@/type/home";

const currentEditIndex = ref(0);
const tableData = ref<TableDataType[]>([]);

const refList = computed(() => {
  return tableData.value.map(() => ({
    name: ref(),
    age: ref(),
    number: ref()
  }))
});


const receiveNumChange = (val: any, row: OutWarehouseoutLibraryType, index: number) => {
  currentEditIndex.value = index;
}

const checkNumber = (_rule: any, value: string, callback: any) => {
  value = String(value)
  if (value === '0') {
    return callback(new Error('请输入一个大于0的数'))
  }
  if (/^[0-9]+(.[0-9]{1,4})?$/.test(value)) {
    if (value?.startsWith('0') && !value?.startsWith("0.")) {
      tableData.value[currentEditIndex.value].receiveNum = value.slice(1, value.length);
      // return callback(new Error('请输入一个大于0的数'))
    }
    return callback();
  }
  if (!value?.endsWith(".")) {
    tableData.value[currentEditIndex.value].receiveNum = value.slice(0, value.length - 1);
  }
  return callback();
  // return callback(new Error('请输入一个大于0的数'))
}

const rules = {
  name: [
    {
      required: true, type: 'string', trigger: 'change'
    }
  ],
  age: [
    {
      validator: checkNumber, trigger: 'change'
    }
  ],
  number: [
    {
      validator: checkNumber, trigger: 'change'
    }
  ],

};



</script>
