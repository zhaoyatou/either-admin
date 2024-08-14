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
      <el-form-item label="图片" prop="image">
        <el-uploads
          :limit="1"
          @upImagekey="coverImage"
          :isEstablish="!id"
          :fileList="ruleForm.images"
          tip="只支持.jpg格式 图片比例3:4"
        />
      </el-form-item>
      <!-- <el-form-item label="展示渠道" prop="channel">
        <el-input v-model="ruleForm.channel" placeholder="请输入" />
      </el-form-item> -->
      <el-form-item label="权重" prop="sortWeight">
        <el-input
          v-model="ruleForm.sortWeight"
          type="number"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="跳转链接" prop="targetUrl">
        <el-input v-model="ruleForm.targetUrl" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="位置" prop="position">
        <el-select v-model="ruleForm.position" placeholder="请选择">
          <el-option
            v-for="item in positionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-form-item label="开始时间" prop="startAt">
        <el-date-picker
          v-model="ruleForm.startAt"
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"
          value-format="x"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endAt">
        <el-date-picker
          v-model="ruleForm.endAt"
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"
          value-format="x"
          placeholder="选择日期"
        />
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
import { bannerStoreState } from "@/store/modules/banner";
import type { FormInstance, FormRules } from "element-plus";
import { createBanner, upBanner, getBanner } from "@/api/banner";
import { message } from "@/utils/message";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const router = useRouter();
const id = Number(String(route.query.id));
const positionList = bannerStoreState().positionList;
const stateList = bannerStoreState().stateList;
// 表单信息
const ruleForm = ref({
  name: "",
  image: [],
  images: [],
  channel: "",
  position: "",
  state: 0,
  sortWeight: 1,
  targetUrl: "",
  endAt: "",
  startAt: ""
});
const ruleFormRef = ref<FormInstance>();

// 检查时间
const startTime = (value, rule, callback) => {
  const { startAt, endAt } = ruleForm.value;
  if (!value || !startAt) {
    return callback(new Error("请输入开始时间"));
  }

  if (startAt && endAt && startAt > endAt) {
    return callback(new Error("结束时间必须小于开始时间"));
  }
  callback();
};

const endTime = (value, rule, callback) => {
  const { startAt, endAt } = ruleForm.value;
  if (!value || !endAt) {
    return callback(new Error("请输入结束时间"));
  }

  if (startAt && endAt && startAt > endAt) {
    return callback(new Error("结束时间必须大于开始时间"));
  }
  callback();
};
// 表单验证
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  channel: [
    // { required: true, message: "请输入展示渠道", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  sortWeight: [{ required: true, message: "输入权重" }],
  targetUrl: [
    // { required: true, message: "请输入连接", trigger: "blur" },
    { min: 1, max: 60, message: "长度在 1 到 60 个字符", trigger: "blur" }
  ],
  startAt: [{ required: true, validator: startTime }],
  endAt: [{ required: true, validator: endTime }],
  state: [{ required: true, message: "选择状态" }],
  position: [{ required: true, message: "选择位置" }],
  image: [{ required: true, message: "请上传图片" }]
});

// 图片上传成功后的key
const coverImage = key => {
  ruleForm.value.image = key[0];
};

if (id) {
  getBanner(id).then(({ data }: any) => {
    data.images = [{ uuid: "", url: data.image }];
    ruleForm.value = data;
  });
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (id) {
        await upBanner(id, ruleForm.value);
      } else {
        await createBanner(ruleForm.value);
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
