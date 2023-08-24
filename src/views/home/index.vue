<template>
  <div class="action">
    <SearchForm :ItemList="ItemList">
      <template #extraBtn>
        <el-button type="primary" @click="checkTable">校验表格</el-button>
        <el-button type="primary" @click="clearTableValidate">清除校验</el-button>
      </template>
    </SearchForm>
  </div>
  <div class="mainTable">
    <el-table :data="tableData" :height="height">
      <el-table-column property="name" label="姓名">
        <template #default="scope">
          <el-form :model="tableData[scope.$index]" label-width="0px" :rules="rules" :ref="refList[scope.$index].name">
            <el-form-item prop="name">
              <el-input v-model="scope.row.name" placeholder="姓名" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column property="age" label="年龄">
        <template #default="scope">
          <el-form :model="tableData[scope.$index]" label-width="0px" :rules="rules" :ref="refList[scope.$index].age">
            <el-form-item prop="age">
              <el-input v-model="scope.row.age" placeholder="年龄"
                @input="receiveNumChange($event, scope.row, scope.$index)" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column property="date" label="出生日期">
        <template #default="scope">
          <el-form :model="tableData[scope.$index]" label-width="0px" :rules="rules" :ref="refList[scope.$index].date">
            <el-form-item prop="date">
              <el-date-picker v-model="scope.row.date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column property="number" label="数量">
        <template #default="scope">
          <el-form :model="tableData[scope.$index]" label-width="0px" :rules="rules" :ref="refList[scope.$index].number">
            <el-form-item prop="number">
              <el-input v-model="scope.row.number" placeholder="数量"
                @input="receiveNumChange($event, scope.row, scope.$index)" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="footer">
    <el-pagination background :total="35" :current-page="currentPage" @current-change="currentChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue';
import type { TableDataType } from "@/type/home";
import SearchForm from '@/components/SearchForm/index.vue';
import type { ItemListType } from '@/components/SearchForm/index.vue';
import { dayjs, ElNotification } from 'element-plus';

const currentEditIndex = ref(0);
const tableData = ref<TableDataType[]>([]);
const height = window.innerHeight - 200;
const currentPage = ref(1);
const refList = computed(() => {
  return tableData.value.map(() => ({
    name: ref(),
    age: ref(),
    number: ref(),
    date: ref(),
  }))
});


const receiveNumChange = (val: any, row: TableDataType, index: number) => {
  currentEditIndex.value = index;
}

const currentChange = (cur: number) => {
  currentPage.value = cur;
}

const checkNumber = (_rule: any, value: string, callback: any, key: keyof TableDataType) => {
  if (!value) {
    return callback(new Error('请输入一个大于0的数'))
  }
  value = String(value)
  if (value === '0') {
    return callback(new Error('请输入一个大于0的数'))
  }
  if (/^[0-9]+(.[0-9]{1,4})?$/.test(value)) {
    if (value?.startsWith('0') && !value?.startsWith("0.")) {
      tableData.value[currentEditIndex.value][key] = value.slice(1, value.length);
    }
    return callback();
  }
  if (!value?.endsWith(".")) {
    tableData.value[currentEditIndex.value][key] = value.slice(0, value.length - 1);
  }
  return callback();
}

const checkDate = (_rule: any, value: Date, callback: any) => {
  if (!value) {
    return callback(new Error('请选中一个小于今天的日期'))
  }
  if (dayjs(value).valueOf() > Date.now()) {
    return callback(new Error('请选中一个小于今天的日期'))
  }
  return callback();
}

const rules = {
  name: [
    {
      required: true, type: 'string', trigger: 'change', message: '姓名必填'
    }
  ],
  age: [
    {
      validator: (_rule: any, value: string, callback: any) => checkNumber(_rule, value, callback, 'age'), trigger: 'change', message: '年龄必填且大于0'
    }
  ],
  date: [
    {
      validator: checkDate, trigger: 'change', message: '出生日期必填且不能超过当前日期'
    }
  ],
  number: [
    {
      validator: (_rule: any, value: string, callback: any) => checkNumber(_rule, value, callback, 'number'), trigger: 'change', message: '数量必填且大于0'
    }
  ],
};

const getData = () => {
  setTimeout(() => {
    const arr: TableDataType[] = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        id: String(Date.now() + i),
        name: 'scew',
        age: i + '',
        date: dayjs(Math.floor((Date.now() - 2 * 365 * 24 * 60 * 60 * 1000) * Math.random())).format('YYYY-MM-DD'),
        number: 10
      })
    }
    tableData.value = arr;
  }, 100)
}

watch([currentPage], () => getData(), { immediate: true })

const checkTable = async () => {
  try {
    for (let i = 0; i < refList.value.length; i++) {
      const item = refList.value[i];
      const [p1, p2, p3, p4] = await Promise.all([item.name.value?.validate(), item.age.value?.validate(), item.date.value?.validate(), item.number.value?.validate()]);
      // console.log(p1, p2, p3);
      if (!p1 || !p2 || !p3 || !p4) {
        //校验不通过
        return
      }
    }
    ElNotification({
      message: "校验通过",
      type: 'success',
    })
  } catch (error: any) {
    //校验不通过会被捕获
    console.log(error);
    ElNotification({
      message: "请将表格填写完整",
      type: 'warning',
    })
  }
}

const clearTableValidate = () => {
  for (let i = 0; i < refList.value.length; i++) {
    const item = refList.value[i];
    item.name.value?.clearValidate();
    item.age.value?.clearValidate();
    item.date.value?.clearValidate();
    item.number.value?.clearValidate();
  }
}

const getSearch = (value: {name?: string, date: dayjs.Dayjs[]}) => {
  tableData.value = tableData.value.filter((item) => {
    let flag = true;
    if(value.name) {
      flag = (item.name.indexOf(value.name) != -1 && flag);
    }
    if(value.date) {
      const itemDate = dayjs(item.date).valueOf();
      flag = (value.date[0].valueOf() < itemDate && flag);
      flag = (value.date[1].valueOf() > itemDate && flag);
    }
    return flag;
  })
}

provide("handleSearch", getSearch);

const ItemList: ItemListType[] = [
  {
    type: 'input',
    name: 'name',
    label: '姓名'
  },
  {
    type: 'datePicker',
    name: 'date',
    label: '日期',
    dateType: 'daterange'
  }
]
</script>

<style scoped lang="scss">
.action {
  width: 90%;
  margin: 10px auto;
  text-align: right;
}

.mainTable {
  width: 90%;
  margin: 0 auto;
}

.footer {
  width: 90%;
  margin: 10px auto;
  display: flex;
  justify-content: flex-end;
}
</style>
