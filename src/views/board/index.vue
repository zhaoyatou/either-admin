<template>
  <div class="p-3">
    <el-row class="mb-4">
      <el-col class="mb-4">
        开始时间：
        <el-date-picker
          v-model="dataBegin"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="开始时间"
          :disabled="disabled"
        />
      </el-col>
      <el-col class="mb-4">
        结束时间：
        <el-date-picker
          v-model="dataEnd"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="结束时间"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="18">
        密码：
        <el-input
          style="width: 200px"
          v-model="password"
          autocomplete="on"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="4" :offset="2">
        <el-button @click="search()" :disabled="disabled" type="primary">
          查询
        </el-button>
      </el-col>
    </el-row>
    <el-form :model="form" label-width="100px">
      <el-form-item label="注册人数">
        {{ form.userRegisterNum || 0 }}
      </el-form-item>
      <el-form-item label="认证用户数">
        {{ form.userIdentityNum || 0 }}
      </el-form-item>
      <el-form-item label="发布商品数">
        {{ form.publishMachineNum || 0 }}
      </el-form-item>
      <el-form-item label="上架商品数">
        {{ form.onSaleMachineNum || 0 }}
      </el-form-item>
      <el-form-item label="电话呼出数">
        {{ form.userCallNum || 0 }}
      </el-form-item>
      <el-form-item label="商品收藏数">
        {{ form.machineFavoriteNum || 0 }}
      </el-form-item>
      <el-form-item label="付费用户数">
        {{ form.payUserNum || 0 }}
      </el-form-item>
      <el-form-item label="付费总金额">
        {{ form.payTotalAmount || 0 }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { ref } from "vue";
import { getBoardDate } from "@/api/board";
defineOptions({
  name: "board"
});

const dataBegin = ref(dayjs().format("YYYY-MM-DD"));
const dataEnd = ref(dayjs().format("YYYY-MM-DD"));
const password = ref();
const form = ref({});
const disabled = ref(false);
const search = () => {
  disabled.value = true;
  getBoardDate({
    dataBegin: dataBegin.value,
    dataEnd: dataEnd.value,
    password: password.value
  })
    .then((res: any) => {
      form.value = res.data;
      disabled.value = false;
    })
    .catch(() => {
      disabled.value = false;
    });
};
</script>

<style lang="scss">
.el-form-item {
  margin-bottom: 0;
  border-bottom: 1px solid black;
}
</style>
