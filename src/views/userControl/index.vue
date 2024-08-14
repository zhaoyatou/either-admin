<template>
  <div>
    <div class="head mb-4">
      <el-input
        placeholder="用户ID"
        v-model="params.userId"
        :disabled="disabled"
      />
      <el-input
        placeholder="手机号"
        v-model="params.linkerMobile"
        :disabled="disabled"
      />
      <el-input
        placeholder="名称"
        v-model="params.nickname"
        :disabled="disabled"
      />

      <el-select v-model="params.state" :disabled="disabled" placeholder="状态">
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select
        v-model="params.identityState"
        :disabled="disabled"
        placeholder="认证状态"
      >
        <el-option
          v-for="item in identityStateList"
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

      <div>
        <el-button type="primary" @click="search" :disabled="disabled">
          搜索
        </el-button>
      </div>
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="nickname" label="用户名" />
      <el-table-column prop="mobile" label="联系人手机号" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="allowMachineNum" label="允许上架数量" />
      <el-table-column label="头像">
        <template #default="scope">
          <img :src="scope.row.avatar" style="width: 40px" />
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template #default="scope">
          {{ sexList.find(i => i.value == scope.row.sex.toString()).label }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <span
            :class="{ red: scope.row.state != 1, green: scope.row.state == 1 }"
          >
            {{
              stateList.find(i => i.value == scope.row.state.toString()).label
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="认证状态">
        <template #default="scope">
          <span
            :class="{
              red: scope.row.identityState == 3,
              green: scope.row.identityState == 2,
              blue: scope.row.identityState == 1
            }"
          >
            {{
              identityStateList.find(
                i => i.value == scope.row.identityState.toString()
              ).label
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="上次登陆时间">
        <template #default="scope">
          {{ dayjs(scope.row.lastLoginTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>

      <el-table-column label="注册时间">
        <template #default="scope">
          {{ dayjs(scope.row.registerTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="解冻时间">
        <template #default="scope">
          {{
            scope.row.releaseTime &&
            dayjs(scope.row.releaseTime).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #default="scope">
          {{ dayjs(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            v-if="scope.row.identityState"
            @click="goDetail(scope.row.id)"
          >
            用户认证
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
  </div>
</template>

<script setup>
import { getUserList } from "@/api/userControl";
import { ref } from "vue";
import { userControlStoreState } from "@/store/modules/userControl";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
const router = useRouter();
const list = ref([]);
const total = ref(0);
const time = ref([]);
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59)
]);
// 是否禁止点击
const disabled = ref(true);
const params = ref({
  offset: 0,
  limit: 20,
  state: "",
  userId: "",
  nickname: "",
  mobile: "",
  registerBegin: "",
  registerEnd: "",
  identityState: ""
});
const stateList = userControlStoreState().stateList;
const sexList = userControlStoreState().sexList;
const identityStateList = userControlStoreState().identityStateList;

const getList = async () => {
  disabled.value = true;
  await getUserList(params.value)
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
  params.value.registerBegin = time.value[0];
  params.value.registerEnd = time.value[1];
  getList();
};

// 详情
const goDetail = id => {
  router.push(`/userControl/detail?id=${id}`);
};

getList();
</script>

<style lang="scss">
.head {
  text-align: center;
  align-items: center;
  display: flex;
  flex-wrap: wrap;

  & > div {
    max-width: 300px;
    margin: 0 10px 10px;
  }
}
</style>
