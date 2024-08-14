<template>
  <div class="w-6/12">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormRef"
      label-width="100px"
      label-position="left"
      class="demo-ruleForm"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="图标" prop="icons">
        <el-uploads
          :limit="1"
          @upImagekey="coverIcon"
          :isEstablish="!id"
          :fileList="ruleForm.icons"
          tip="只支持.jpg格式 图片比例1:1"
        />
      </el-form-item>
      <el-form-item label="权重" prop="sortWeight">
        <el-input
          v-model="ruleForm.sortWeight"
          type="number"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="等级" prop="level">
        <el-select v-model="ruleForm.level" placeholder="请选择">
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="上级ID"
        prop="parentId"
        required
        v-if="ruleForm.level == 2"
      >
        <el-input
          v-model="ruleForm.parentId"
          readonly
          type="number"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="ruleForm.state" placeholder="请选择">
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="submitForm(ruleFormRef)">
          保存
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from "vue";
import ElUploads from "@/components/ElUploads/index.vue";
import type { FormInstance, FormRules } from "element-plus";
import { upCategory, createCategory, getCategory } from "@/api/category";
import { message } from "@/utils/message";
import { useRouter, useRoute } from "vue-router";
import { categoryStoreState } from "@/store/modules/category";
const route = useRoute();
const router = useRouter();
const id = Number(String(route.query.id));
const level = Number(String(route.query.level||0));
const levelList = categoryStoreState().levelList;
const stateList = categoryStoreState().stateList;
// 表单信息
const ruleForm = ref({
  name: "",
  icons: [],
  icon: "",
  level: level + 1,
  state: 0,
  sortWeight: 1,
  parentId: id
});
const ruleFormRef = ref<FormInstance>();

// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  sortWeight: [{ required: true, message: "输入权重" }],
  state: [{ required: true, message: "选择状态" }],
  level: [{ required: true, message: "选择等级" }],
  icon: [{ required: true, message: "请上传图片" }]
});

// 图片上传成功后的key
const coverIcon = key => {
  ruleForm.value.icon = key[0];
};

if (id && !level) {
  getCategory(id).then(({ data }: any) => {
    data.icons = [{ uuid: "", url: data.icon }];
    console.log(data);
    ruleForm.value = data;
  });
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (id && !level) {
        await upCategory(id, ruleForm.value);
      } else {
        await createCategory(ruleForm.value);
      }
      message("操作成功", { type: "success" });
      router.back();
    } else {
      message("操作失败", { type: "error" });
      return fields;
    }
  });
};
</script>

<style lang="scss">
</style>
