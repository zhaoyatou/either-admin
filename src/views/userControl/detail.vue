<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="公司名称">
        {{ ruleForm.companyName }}
      </el-form-item>
      <el-form-item label="公司介绍">
        {{ ruleForm.brief }}
      </el-form-item>
      <el-form-item label="法人身份证">
        <el-image
          :src="ruleForm.identityCard"
          style="width: 200px; height: 200px"
          @click="previewImage(ruleForm.identityCard)"
        />
      </el-form-item>
      <el-form-item label="营业执照">
        <el-image
          :src="ruleForm.businessLicense"
          style="width: 200px; height: 200px"
          @click="previewImage(ruleForm.businessLicense)"
        />
      </el-form-item>
      <el-form-item label="公司照片">
        <el-image
          v-for="i in ruleForm.photos"
          :key="i"
          :src="i"
          style="width: 200px; height: 200px"
          @click="previewImage(ruleForm.photos)"
        />
      </el-form-item>
      <el-form-item label="首次认证时间">
        {{
          ruleForm.identifiedAt &&
          dayjs(ruleForm.identifiedAt).format("YYYY-MM-DD HH:mm:ss")
        }}
      </el-form-item>
      <el-form-item label="审核拒绝原因">
        {{ ruleForm.rejectReason }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="shopPas()">审核通过</el-button>
        <el-button type="warning" @click="shopModel = true">审核拒绝</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="审核拒绝原因"
      v-model="shopModel"
      width="30%"
      style="text-align: center"
    >
      <el-input class="mb-4" v-model="reason" placeholder="审核拒绝原因" />
      <el-button @click="shopModel = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="shopRej" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>

    <el-dialog v-model="previewModel">
      <img w-full :src="previewIng" class="m-auto" />
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { getUserDetail, userPass, userReject } from "@/api/userControl";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
const route = useRoute();
const router = useRouter();
const id = String(route.query.id);
const shopModel = ref(false);
const reason = ref("reason");

const previewModel = ref(false);
const previewIng = ref("");
// 表单信息
const ruleForm = ref({});

getUserDetail(id).then(({ data }: any) => {
  data.images = [{ uuid: "", url: data.image }];
  ruleForm.value = data;
});

const shopPas = async () => {
  await userPass(id);
  router.back();
};

const shopRej = async () => {
  await userReject(id, { reason: reason.value });
  router.back();
};

const previewImage = image => {
  previewModel.value = true;
  previewIng.value = image;
};
</script>

<style lang="scss">
</style>
