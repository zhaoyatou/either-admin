<template>
  <div>
    <div class="head mb-4">
      <el-input
        placeholder="用户ID"
        v-model="params.userId"
        :disabled="disabled"
      />
      <el-input
        placeholder="邀请人ID"
        v-model="params.inviteUserId"
        :disabled="disabled"
      />
      <el-select
        v-model="params.payBusinessType"
        :disabled="disabled"
        placeholder="业务类型"
      >
        <el-option label="全部" value="0" />
        <el-option
          v-for="item in businessTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="params.payType"
        :disabled="disabled"
        placeholder="支付类型"
      >
        <el-option label="全部" value="0" />
        <el-option
          v-for="item in payTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="time"
        :disabled="disabled"
        type="datetimerange"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        :default-time="defaultTime"
      />

      <el-button type="primary" @click="search" :disabled="disabled">
        搜索
      </el-button>
      <el-button
        type="primary"
        :disabled="disabled"
        @click="payModelFlage = true"
      >
        创建
      </el-button>
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="nickname" label="用户昵称" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="cost" label="花费" />
      <el-table-column prop="inviteUserId" label="邀请人ID" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="businessId" label="业务ID" />
      <el-table-column label="业务类型">
        <template #default="scope">
          {{
            businessTypeList.find(i => i.value == scope.row.businessType).label
          }}
        </template>
      </el-table-column>
      <el-table-column label="支付类型">
        <template #default="scope">
          {{ payTypeList.find(i => i.value == scope.row.payType).label }}
        </template>
      </el-table-column>
      <el-table-column prop="payAt" label="支付时间">
        <template #default="scope">
          {{ dayjs(scope.row.payAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="修改时间">
        <template #default="scope">
          {{ dayjs(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="scope">
          {{ dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="20"
      @current-change="change"
    />

    <el-dialog
      title="创建"
      v-model="payModelFlage"
      width="30%"
      style="text-align: center"
    >
      <el-form :model="crePayObj">
        <el-form-item label="用户ID">
          <el-input v-model="crePayObj.userId" />
        </el-form-item>
        <el-form-item label="花费">
          <el-input v-model="crePayObj.cost" />
        </el-form-item>
        <el-form-item label="业务ID">
          <el-input v-model="crePayObj.businessId" />
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="crePayObj.businessType">
            <el-option
              v-for="item in businessTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="支付时间">
          <el-date-picker
            v-model="crePayObj.payAt"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="支付时间"
          />
        </el-form-item>
        <el-form-item label="支付类型">
          <el-select v-model="crePayObj.payType">
            <el-option
              v-for="item in payTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="crePayObj.remark" />
        </el-form-item>
      </el-form>

      <el-button @click="payModelFlage = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="createdVip" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { getPayList, createPay } from "@/api/pay";
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
const list = ref([]);
const total = ref(0);
const time = ref([]);
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59)
]);
// 是否禁止点击
const disabled = ref(true);

const payModelFlage = ref(false);
const params = ref({
  offset: 0,
  limit: 20,
  userId: "",
  vipLevel: "",
  createEnd: "",
  createBegin: ""
});
const crePayObj = ref({
  businessId: "",
  businessType: "",
  cost: "",
  payAt: "",
  payType: "",
  remark: "",
  userId: ""
});
const businessTypeList = [
  { label: "广告位", value: 1 },
  { label: "开通VIP", value: 2 }
];
const payTypeList = [
  { label: "线下", value: 1 },
  { label: "小程序支付", value: 2 }
];

const getList = async () => {
  disabled.value = true;
  await getPayList(params.value)
    .then(({ data }) => {
      list.value = data.records;
      total.value = data.totalCount;
      disabled.value = false;
    })
    .catch(() => {
      disabled.value = false;
    });
};

// 获取下一页
const change = page => {
  params.value.offset = page * 20 - 20;
  getList();
};

// 搜索
const search = () => {
  params.value.offset = 0;
  params.value.payBegin = time.value[0] || "";
  params.value.payEnd = time.value[1] || "";
  getList();
};

const createdVip = () => {
  disabled.value = true;
  createPay(crePayObj.value)
    .then(res => {
      message("创建成功", { type: "success" });
      search();
      payModelFlage.value = false;
      disabled.value = false;
      crePayObj.value = {};
    })
    .catch(() => {
      payModelFlage.value = false;
      disabled.value = false;
      crePayObj.value = {};
    });
};

getList();
</script>

<style lang="scss">
.head {
  text-align: center;
  align-items: center;
  display: flex;

  & > div {
    max-width: 300px;
    margin: 0 10px;
  }
}
</style>
