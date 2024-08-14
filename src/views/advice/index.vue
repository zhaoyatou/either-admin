<template>
  <div>
    <div class="head mb-4">
      <el-input
        placeholder="用户ID"
        v-model="params.userId"
        :disabled="disabled"
      />
      <el-select v-model="params.isReplied" placeholder="是否回复">
        <el-option
          v-for="item in recoverList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-date-picker
        v-model="params.begin"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="开始时间"
      />
      <el-date-picker
        v-model="params.end"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="结束时间"
      />

      <el-button type="primary" @click="search" :disabled="disabled">
        搜索
      </el-button>
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="advice" label="建议" />
      <el-table-column prop="reply" label="回复" />
      <el-table-column label="图片" width="250px">
        <template #default="scope">
          <el-row justify="space-between" type="flex">
            <el-col :span="11" v-for="(i, d) in scope.row.images" :key="d">
              <el-image
                :src="i"
                style="width: 100px; height: 100px"
                @click="previewImage(i)"
              />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="scope">
          {{ dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="修改时间">
        <template #default="scope">
          {{ dayjs(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="recover(scope.row.id)">
            回复
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
      title="回复"
      v-model="recoverModel"
      width="30%"
      style="text-align: center"
    >
      <el-input class="mb-4" v-model="reply" placeholder="回复" />
      <el-button @click="recoverModel = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="sub" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>

    <el-dialog v-model="previewModel">
      <img w-full :src="previewIng" class="m-auto" />
    </el-dialog>
  </div>
</template>

<script setup>
import { getAdviceList, upAdvice } from "@/api/advice";
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
const recoverModel = ref(false);
const recoverId = ref();
const reply = ref();
const list = ref([]);
const total = ref(0);
const previewModel = ref(false);
const previewIng = ref("");
const recoverList = ref([
  { label: "全部", value: "" },
  { label: "已回复", value: true },
  { label: "未回复", value: false }
]);
// 是否禁止点击
const disabled = ref(true);
const params = ref({
  offset: 0,
  limit: 20,
  userId: "",
  begin: "",
  end: "",
  isReplied: ""
});

const getList = async () => {
  disabled.value = true;
  await getAdviceList(params.value)
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

// 回复
const recover = id => {
  recoverId.value = id;
  reply.value = "";
  recoverModel.value = true;
};

const sub = async () => {
  await upAdvice(recoverId.value, { reply: reply.value });
  message("成功", { type: "success" });
  recoverModel.value = false;
  getList();
};

const previewImage = image => {
  previewModel.value = true;
  previewIng.value = image;
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
