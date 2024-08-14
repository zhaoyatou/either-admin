<template>
  <div>
    <div class="head mb-4">
      <el-input placeholder="名称" v-model="params.name" :disabled="disabled" />
      <el-select v-model="params.position" placeholder="位置">
        <el-option
          v-for="item in positionList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
        @click="router.push('/banner/cre')"
        :disabled="disabled"
      >
        创建
      </el-button>
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="sortWeight" label="权重" />
      <!-- <el-table-column prop="channel" label="渠道" /> -->
      <el-table-column prop="targetUrl" label="跳转链接" />
      <el-table-column label="图片" width="100px">
        <template #default="scope">
          <img :src="scope.row.image" @click="previewImage(scope.row.image)" />
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="!scope.row.state ? 'red' : 'green'">
            {{ stateList.find(i => i.value == scope.row.state).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="位置">
        <template #default="scope">
          {{ positionList.find(i => i.value == scope.row.position).label }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="scope">
          {{ dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="startAt" label="开始时间">
        <template #default="scope">
          {{ dayjs(scope.row.startAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="endAt" label="结束时间">
        <template #default="scope">
          {{ dayjs(scope.row.endAt).format("YYYY-MM-DD HH:mm:ss") }}
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
              @click="router.push(`/banner/cre?id=${scope.row.id}`)"
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

    <el-dialog v-model="previewModel">
      <img w-full :src="previewIng" class="m-auto" />
    </el-dialog>
  </div>
</template>

<script setup>
import { delBanner, getBannerList } from "@/api/banner";
import { ref } from "vue";
import { bannerStoreState } from "@/store/modules/banner";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { message } from "@/utils/message";
const router = useRouter();
const list = ref([]);
const total = ref(0);
// 是否禁止点击
const disabled = ref(true);
const params = ref({
  offset: 0,
  limit: 20,
  name: "",
  position: "",
  state: ""
});
const stateList = bannerStoreState().stateList;
const positionList = bannerStoreState().positionList;

const previewModel = ref(false);
const previewIng = ref("");

const getList = async () => {
  disabled.value = true;
  await getBannerList(params.value)
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

// 删除
const delItem = async id => {
  await delBanner(id);
  getList();
  message("操作成功", { type: "success" });
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
