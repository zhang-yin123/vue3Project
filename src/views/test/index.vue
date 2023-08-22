<template>
  <el-form ref="myForm" :model="formData" :rules="formRules">
    <el-form-item v-for="(item, index) in formItems" :key="index" :label="item.label" :prop="item.prop">
      <!-- 使用ref属性绑定表单元素的引用 -->
      <el-input v-if="item.type === 'input'" v-model="formData[item.prop]" :ref="'input' + index"></el-input>
      <el-select v-else-if="item.type === 'select'" v-model="formData[item.prop]" :ref="'select' + index">
        <!-- select的选项渲染 -->
      </el-select>
      <!-- 其他表单元素类似 -->
    </el-form-item>
  </el-form>
  <el-button @click="validateForm">校验表单</el-button>
</template>

<script>
import { ref } from 'vue';

export default {
  data() {
    return {
      formData: {}, // 表单数据
      formItems: [  // 表单元素配置
        { type: 'input', label: '姓名', prop: 'name' },
        { type: 'select', label: '性别', prop: 'gender' },
        // 其他表单元素配置
      ],
      formRules: {  // 表单校验规则
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        // 其他校验规则
      }
    };
  },
  methods: {
    validateForm() {
      // 遍历表单元素，通过ref获取实例并进行校验
      this.formItems.forEach((item, index) => {
        const formElement = this.$refs[item.type + index][0]; // 使用ref获取表单元素实例
        formElement.validate(valid => {
          if (!valid) {
            // 校验不通过的处理
          }
        });
      });
    }
  }
};
</script>
