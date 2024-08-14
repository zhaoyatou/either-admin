<template>
  <div>
    <div class="head mb-4">
      <el-input
        placeholder="搜索词"
        v-model="params.keyword"
        :disabled="disabled"
      />
      <el-select v-model="params.isHot" placeholder="是否热词">
        <el-option
          v-for="item in isHotList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="params.type" placeholder="类型">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-button type="primary" @click="search" :disabled="disabled">
        搜索
      </el-button>
      <el-button
        type="primary"
        @click="createdModel = true"
        :disabled="disabled"
      >
        创建
      </el-button>
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="keyword" label="搜索词" />
      <el-table-column prop="sortWeight" label="权重" />
      <el-table-column prop="times" label="搜索次数" />
      <el-table-column prop="isHot" label="是否热词">
        <template #default="scope">
          {{ scope.row.isHot ? "是" : "非" }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          {{ scope.row.type == 1 ? "机械商品" : "机械分类" }}
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
          <div>
            <el-button size="small" @click="setKey(scope.row, 1)">
              设置排序
            </el-button>
          </div>
          <div>
            <el-button size="small" @click="setKey(scope.row, 2)">
              设置热词
            </el-button>
          </div>
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
      :title="setKeyType == 1 ? '排序' : '热词'"
      v-model="setKeyModel"
      width="30%"
      style="text-align: center"
    >
      <el-input
        class="mb-4"
        v-model="sortWeight"
        placeholder="排序"
        v-if="setKeyType == 1"
      />
      <div v-else>
        <el-switch class="mb-4" v-model="isHot" />
      </div>
      <el-button @click="setKeyModel = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="sub" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>
    <el-dialog
      title="创建"
      v-model="createdModel"
      width="30%"
      style="text-align: center"
    >
      <el-form :model="creKey">
        <el-form-item label="搜索词">
          <el-input v-model="creKey.keyword" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="creKey.type">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否热词">
          <el-select v-model="creKey.isHot">
            <el-option
              v-for="item in isHotList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="creKey.sortWeight" />
        </el-form-item>
      </el-form>
      <el-button @click="createdModel = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="creKeys" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getKeywordList,
  setKeyword,
  setKeywordSort,
  upKeyword
} from "@/api/keyword";
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
const setKeyModel = ref(false);
const createdModel = ref(false);
const setKeyId = ref();
const setKeyType = ref();
const sortWeight = ref();
const isHot = ref();
const list = ref([]);
const total = ref(0);
const isHotList = ref([
  { label: "是", value: true },
  { label: "非", value: false }
]);
const typeList = ref([
  { label: "机械商品", value: 1 },
  { label: "机械分类", value: 2 }
]);
// 是否禁止点击
const disabled = ref(true);
const creKey = ref({
  keyword: "",
  type: 1,
  sortWeight: 1,
  isHot: false
});
const params = ref({
  offset: 0,
  limit: 20,
  keyword: "",
  type: "",
  isHot: ""
});

const getList = async () => {
  disabled.value = true;
  await getKeywordList(params.value)
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

// 设置
const setKey = (item, type) => {
  setKeyId.value = item.id;
  setKeyType.value = type;
  sortWeight.value = item.sortWeight;
  isHot.value = item.isHot;
  setKeyModel.value = true;
};

const sub = async () => {
  setKeyType.value == 1 &&
    (await setKeywordSort(setKeyId.value, { sortWeight: sortWeight.value }));
  setKeyType.value == 2 &&
    (await setKeyword(setKeyId.value, { isHot: isHot.value }));
  message("成功", { type: "success" });
  setKeyModel.value = false;
  getList();
};

const creKeys = async () => {
  await upKeyword({ ...creKey.value });
  message("成功", { type: "success" });
  createdModel.value = false;
  getList();
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
