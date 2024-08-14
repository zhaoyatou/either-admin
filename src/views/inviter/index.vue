<template>
  <div>
    <div class="head mb-4">
      <el-input
        placeholder="用户ID"
        v-model="params.userId"
        :disabled="disabled"
      />
      <el-input placeholder="昵称" v-model="params.name" :disabled="disabled" />
      <el-input
        placeholder="手机号"
        v-model="params.mobile"
        :disabled="disabled"
      />
      <el-select v-model="params.state" :disabled="disabled" placeholder="状态">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in stateList"
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
        @click="inviterModelFlage = true"
      >
        创建
      </el-button>
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="用户昵称" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="state" label="状态">
        <template #default="scope">
          <span :class="!scope.row.state ? 'red' : 'green'">
            {{ stateList.find(i => i.value == scope.row.state).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="bank" label="银行" />
      <el-table-column prop="bankCardNo" label="银行卡号" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="remark" label="推广码">
        <template #default="scope">
          <el-image :src="scope.row.miniCode" />
        </template>
      </el-table-column>

      <el-table-column prop="lastSalary" label="上次发薪日">
        <template #default="scope">
          {{
            scope.row.lastSalary &&
            dayjs(scope.row.lastSalary).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="修改时间">
        <template #default="scope">
          {{
            scope.row.updatedAt &&
            dayjs(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="scope">
          {{
            scope.row.createdAt &&
            dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            @click="updateInviter(scope.row)"
            size="small"
          >
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
      :title="creInviterObj.id ? '修改' : '创建'"
      v-model="inviterModelFlage"
      width="30%"
      style="text-align: center"
    >
      <el-form :model="creInviterObj">
        <el-form-item label="用户ID">
          <el-input v-model="creInviterObj.userId" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="creInviterObj.name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="creInviterObj.mobile" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="creInviterObj.address" />
        </el-form-item>
        <el-form-item label="上次发薪时间">
          <el-date-picker
            v-model="creInviterObj.lastSalary"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="发薪时间"
          />
        </el-form-item>
        <el-form-item label="银行">
          <el-input v-model="creInviterObj.bank" />
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="creInviterObj.bankCardNo" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="creInviterObj.state">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="creInviterObj.remark" />
        </el-form-item>
      </el-form>

      <el-button @click="inviterModelFlage = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="createdVip" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { getInviterList, createInviter, upInviter } from "@/api/inviter";
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
const list = ref([]);
const total = ref(0);
// 是否禁止点击
const disabled = ref(true);

const inviterModelFlage = ref(false);
const params = ref({
  offset: 0,
  limit: 20,
  userId: "",
  name: "",
  mobile: "",
  state: ""
});
const creInviterObj = ref({
  id: "",
  address: "",
  bank: "",
  bankCardNo: "",
  lastSalary: "",
  name: "",
  remark: "",
  state: "",
  userId: "",
  mobile: ""
});
const stateList = [
  { label: "禁用", value: 0 },
  { label: "正常", value: 1 }
];

const getList = async () => {
  disabled.value = true;
  await getInviterList(params.value)
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
  getList();
};

const createdVip = () => {
  disabled.value = true;
  const {
    id,
    address,
    bank,
    bankCardNo,
    lastSalary,
    name,
    remark,
    state,
    userId,
    mobile
  } = creInviterObj.value;
  if (id) {
    upInviter(id, {
      address,
      bank,
      bankCardNo,
      lastSalary,
      name,
      remark,
      state,
      mobile,
      userId: Number(userId)
    })
      .then(res => {
        message("修改成功", { type: "success" });
        search();
        inviterModelFlage.value = false;
        disabled.value = false;
        creInviterObj.value = {};
      })
      .catch(() => {
        inviterModelFlage.value = false;
        disabled.value = false;
        creInviterObj.value = {};
      });
  } else {
    createInviter({
      address,
      bank,
      bankCardNo,
      lastSalary,
      name,
      remark,
      state,
      mobile,
      userId: Number(userId)
    })
      .then(res => {
        message("创建成功", { type: "success" });
        search();
        inviterModelFlage.value = false;
        disabled.value = false;
        creInviterObj.value = {};
      })
      .catch(() => {
        inviterModelFlage.value = false;
        disabled.value = false;
        creInviterObj.value = {};
      });
  }
};

const updateInviter = row => {
  const {
    id,
    address,
    bank,
    bankCardNo,
    lastSalary,
    name,
    remark,
    state,
    mobile,
    userId
  } = row;
  creInviterObj.value = {
    id,
    address,
    bank,
    bankCardNo,
    lastSalary: lastSalary?dayjs(lastSalary).format("YYYY-MM-DD HH:mm:ss"):'',
    name,
    remark,
    state,
    mobile,
    userId
  };
  inviterModelFlage.value = true;
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
