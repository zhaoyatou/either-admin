<template>
  <div>
    <div class="head mb-4">
      <el-select v-model="params.state" placeholder="状态">
        <el-option
          v-for="item in stateList"
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
        @click="router.push('/category/cre')"
        :disabled="disabled"
      >
        创建
      </el-button>
    </div>
    <el-table
      :data="list"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children' }"
      class="mb-4"
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="sortWeight" label="权重" />
      <el-table-column prop="level" label="等级">
        <template #default="scope">
          {{ levelList[scope.row.level - 1].label }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="80px">
        <template #default="scope"> <img :src="scope.row.icon" /> </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
           <span :class="!scope.row.state ? 'red' : 'green'">
            {{ stateList.find(i => i.value == scope.row.state).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="subordinateNum" label="下级分类数量" />
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
            <el-button
              type="primary"
              size="small"
              @click="router.push(`/category/cre?id=${scope.row.id}`)"
            >
              修改
            </el-button>
          </div>
          <div>
            <el-popconfirm title="确认删除" @confirm="delItem(scope.row.id)">
              <template #reference>
                <el-button type="danger" size="small"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </div>
          <div v-if="scope.row.level == 1">
            <el-button
              type="primary"
              size="small"
              @click="router.push(`/category/cre?id=${scope.row.id}&level=1`)"
            >
              创建子分类
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {
  getCategoryTopList,
  getCategoryChildList,
  delCategory
} from "@/api/category";
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { categoryStoreState } from "@/store/modules/category";
import { useRouter } from "vue-router";

const router = useRouter();
const list = ref([]);
// 是否禁止点击
const disabled = ref(true);
const stateList = categoryStoreState().stateList;
const levelList = categoryStoreState().levelList;
const params = ref({
  state: ""
});

const getList = async () => {
  disabled.value = true;
  await getCategoryTopList(params.value)
    .then(({ data }) => {
      data.map(item => {
        item.hasChildren = true;
      });
      list.value = data;

      disabled.value = false;
    })
    .catch(() => {
      disabled.value = false;
    });
};

const load = async (row, treeNode, resolve) => {
  const { data } = await getCategoryChildList(row.id);
  resolve(data);
  return data;
};

// 搜索
const search = () => {
  getList();
};

// 删除
const delItem = async id => {
  await delCategory(id);
  // getList();
  window.location.reload();
  message("操作成功", { type: "success" });
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
.el-table__expand-icon {
  width: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
}
</style>
