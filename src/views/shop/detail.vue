<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="商品ID">
        {{ ruleForm.id }}
      </el-form-item>
      <el-form-item label="商品名称">
        {{ ruleForm.name }}
      </el-form-item>
      <el-form-item label="价格">
        {{ ruleForm.price }}
      </el-form-item>
      <el-form-item label="用户ID">
        {{ ruleForm.userId }}
      </el-form-item>
      <el-form-item label="用户昵称">
        {{ ruleForm.nickname }}
      </el-form-item>
      <el-form-item label="联系人手机">
        {{ ruleForm.linkerMobile }}
      </el-form-item>
      <el-form-item label="商品简介">
        {{ ruleForm.brief }}
      </el-form-item>

      <el-form-item label="地址">
        {{ ruleForm.address }}
      </el-form-item>

      <el-form-item label="运费">
        {{ ruleForm.carriage }}
      </el-form-item>
      <el-form-item label="城市">
        {{ ruleForm.city }}
      </el-form-item>
      <el-form-item label="新旧类型">
        {{
          ruleForm.degreeType &&
          degreeType.find(i => i.value == ruleForm.degreeType).label
        }}
      </el-form-item>
      <el-form-item label="新旧程度">
        {{ degreeArr[ruleForm.degree] }}
      </el-form-item>
      <el-form-item label="所属分类名称">
        {{ ruleForm.categoryName }}
      </el-form-item>
      <el-form-item label="库存">
        {{ ruleForm.stock }}
      </el-form-item>
      <el-form-item label="标签">
        {{ ruleForm.tags }}
      </el-form-item>

      <el-form-item label="封面图">
        <el-image
          :src="ruleForm.cover"
          style="width: 200px; height: 200px"
          @click="previewImage(ruleForm.cover)"
        />
      </el-form-item>
      <el-form-item label="详情图">
        <el-image
          v-for="i in ruleForm.images"
          class="mr-3 mb-3"
          :key="i"
          :src="i"
          @click="previewImage(i)"
          style="width: 200px; height: 200px"
        />
      </el-form-item>

      <el-form-item label="审核状态">
        <span v-if="ruleForm.auditState == 0"> 等待审核 </span>
        <span v-if="ruleForm.auditState == 1"> 审核通过 </span>
        <span v-if="ruleForm.auditState == 2"> 审核拒绝 </span>
      </el-form-item>
      <el-form-item label="审核拒绝原因" v-if="ruleForm.auditState == 2">
        {{ ruleForm.rejectReason }}
      </el-form-item>
      <el-form-item v-if="!ruleForm.auditState">
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
import { getShop, shopPass, shopReject } from "@/api/shop";
import { useRoute, useRouter } from "vue-router";
import { shopStoreState } from "@/store/modules/shop";
const route = useRoute();
const router = useRouter();
const id = String(route.query.id);
const shopModel = ref(false);
const reason = ref("reason");
const degreeType = shopStoreState().degreeTypeList;
const degreeArr = [
  "九成新",
  "八成新",
  "七成新",
  "六成新",
  "五成新",
  "四成新",
  "三成新",
  "二成新",
  "一成新"
];

const previewModel = ref(false);
const previewIng = ref("");
// 表单信息
const ruleForm = ref({});

getShop(id).then(({ data }: any) => {
  ruleForm.value = data;
});

const shopPas = async () => {
  await shopPass(id);
  router.back();
};

const shopRej = async () => {
  await shopReject(id, { reason: reason.value });
  router.back();
};

const previewImage = image => {
  previewModel.value = true;
  previewIng.value = image;
};
</script>

<style lang="scss">
</style>
