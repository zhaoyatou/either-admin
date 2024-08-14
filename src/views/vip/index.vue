<template>
  <div>
    <div class="head mb-4">
      <el-input
        placeholder="用户ID"
        v-model="params.userId"
        :disabled="disabled"
      />
      <el-select
        v-model="params.vipLevel"
        :disabled="disabled"
        placeholder="VIP等级"
      >
        <el-option label="全部" value="0" />
        <el-option
          v-for="item in vipLevelList"
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
        @click="vipModelFlage = true"
      >
        创建
      </el-button>
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="nickname" label="用户昵称" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="vip等级">
        <template #default="scope">
          {{
            scope.row.vipLevel &&
            vipLevelList.find(i => i.value == scope.row.vipLevel).label
          }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
        <template #default="scope">
          {{ dayjs(scope.row.startTime).format("YYYY-MM-DD HH:mm:ss") }}
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
      <el-table-column prop="startAt" label="结束时间">
        <template #default="scope">
          {{ dayjs(scope.row.endTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="updateVip(scope.row)" size="small">
            修改
          </el-button>
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
      :title="creVipObj.id ? '修改' : '创建'"
      v-model="vipModelFlage"
      width="30%"
      style="text-align: center"
    >
      <el-form :model="creVipObj">
        <el-form-item label="用户ID">
          <el-input v-model="creVipObj.userId" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="creVipObj.level">
            <el-option
              v-for="item in vipLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="creVipObj.startAt"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="creVipObj.endAt"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="creVipObj.remark" />
        </el-form-item>
      </el-form>

      <el-button @click="vipModelFlage = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="createdVip" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { getVipList, createVip, upVip } from "@/api/vip";
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

const vipModelFlage = ref(false);
const params = ref({
  offset: 0,
  limit: 20,
  userId: "",
  vipLevel: "",
  createEnd: "",
  createBegin: ""
});
const creVipObj = ref({
  id: "",
  endAt: "",
  startAt: "",
  remark: "",
  userId: "",
  level: ""
});
const vipLevelList = [
  { label: "黄金会员", value: 1 },
  { label: "铂金会员", value: 2 },
  { label: "钻石会员", value: 3 }
];

const getList = async () => {
  disabled.value = true;
  await getVipList(params.value)
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
  params.value.createBegin = time.value[0] || "";
  params.value.createEnd = time.value[1] || "";
  getList();
};

const createdVip = () => {
  disabled.value = true;
  const { id, endAt, startAt, remark, userId, level } = creVipObj.value;
  if (id) {
    upVip(id, {
      endAt,
      startAt,
      remark,
      userId: Number(userId),
      level: Number(level)
    })
      .then(res => {
        message("修改成功", { type: "success" });
        search();
        vipModelFlage.value = false;
        disabled.value = false;
        creVipObj.value = {};
      })
      .catch(() => {
        vipModelFlage.value = false;
        disabled.value = false;
        creVipObj.value = {};
      });
  } else {
    createVip({
      endAt,
      startAt,
      remark,
      userId: Number(userId),
      level: Number(level)
    })
      .then(res => {
        message("创建成功", { type: "success" });
        search();
        vipModelFlage.value = false;
        disabled.value = false;
        creVipObj.value = {};
      })
      .catch(() => {
        vipModelFlage.value = false;
        disabled.value = false;
        creVipObj.value = {};
      });
  }
};

const updateVip = row => {
  const { startTime, endTime, id, userId, vipLevel, remark } = row;
  creVipObj.value = {
    remark,
    id,
    userId,
    level: vipLevel,
    startAt: dayjs(startTime).format("YYYY-MM-DD HH:mm:ss"),
    endAt: dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
  };
  console.log(creVipObj.value);
  vipModelFlage.value = true;
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
