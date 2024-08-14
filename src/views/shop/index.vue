<template>
  <div>
    <div class="head mb-4">
      <el-input placeholder="商品ID" v-model="params.id" :disabled="disabled" />
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
      <el-input placeholder="名称" v-model="params.name" :disabled="disabled" />
      <el-input
        placeholder="商品分类id"
        v-model="params.categoryId"
        :disabled="disabled"
      />
      <el-input placeholder="城市" v-model="params.city" :disabled="disabled" />
      <el-select v-model="params.degreeType" placeholder="新旧类型">
        <el-option
          v-for="item in degreeType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="params.auditState" placeholder="审核状态">
        <el-option
          v-for="item in auditState"
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
    </div>
    <el-table border :data="list" class="mb-4">
      <el-table-column prop="id" label="商品ID" />
      <el-table-column prop="name" label="机械名称" />
      <el-table-column prop="cover" label="封面图" width="100px">
        <template #default="scope">
          <img :src="scope.row.cover" @click="previewImage(scope.row.cover)" />
        </template>
      </el-table-column>
      <el-table-column label="新旧类型">
        <template #default="scope">
          {{
            degreeType.find(i => i.value == scope.row.degreeType.toString())
              .label
          }}
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="nickname" label="用户名" />
      <el-table-column prop="linkerMobile" label="联系人手机号" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="categoryName" label="所属分类名称" />
      

      <el-table-column label="审核状态">
        <template #default="scope">
          <span
            :class="{ red: scope.row.auditState == 2, green: scope.row.auditState == 1 }"
          >
            {{
              auditState.find(i => i.value == scope.row.auditState.toString())
                .label
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="linkerMobile" label="状态">
        <template #default="scope">
          <span
            :class="{ red: scope.row.state == 2, green: scope.row.state == 1 }"
          >
            {{ stateList.find(i => i.value == scope.row.state).label }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="上架时间">
        <template #default="scope">
          {{
            scope.row.launchedAt
              ? dayjs(scope.row.launchedAt).format("YYYY-MM-DD HH:mm:ss")
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedScore" label="是否更新分数" />
      <el-table-column prop="calls" label="呼入量" />
      <el-table-column prop="favorites" label="收藏量" />
      <el-table-column prop="views" label="浏览量" />
      <el-table-column prop="score" label="推荐分" />
      <el-table-column prop="defaultScore" label="默认分" />
      <el-table-column prop="randomScore" label="随机分" />
      <el-table-column prop="setScore" label="设置分" />
      <el-table-column prop="signIn" label="签到分" />
      <el-table-column prop="sortWeight" label="排序" />
      <el-table-column prop="stock" label="库存" />
      <el-table-column prop="rejectReason" label="审核拒绝原因" />
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ dayjs(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #default="scope">
          {{ dayjs(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <div>
            <el-button
              type="success"
              size="small"
              @click="goDetail(scope.row.id)"
            >
              详情
            </el-button>
          </div>
          <div>
            <el-button
              type="warning"
              size="small"
              @click="upShopDetil(scope.row, 1)"
            >
              设置分
            </el-button>
          </div>
          <div>
            <el-button
              type="danger"
              size="small"
              @click="upShopDetil(scope.row, 2)"
            >
              设置排序
            </el-button>
          </div>
          <div v-if="scope.row.auditState == 1">
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="upState(scope.row)"
              :title="`确认${scope.row.state != 1 ? '上架' : '下架'}？`"
            >
              <template #reference>
                <el-button type="primary" size="small">
                  {{ scope.row.state != 1 ? "上架" : "下架" }}
                </el-button>
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

    <el-dialog
      :title="shopDetail.type == 1 ? '设置分' : '设置排序'"
      v-model="shopModel"
      width="30%"
      style="text-align: center"
    >
      <el-input
        class="mb-4"
        v-if="shopDetail.type == 1"
        v-model="shopDetail.setScore"
        placeholder="设置分"
      />
      <el-input
        class="mb-4"
        v-if="shopDetail.type == 2"
        v-model="shopDetail.sortWeight"
        placeholder="设置排序"
      />
      <el-button @click="shopModel = false" :disabled="disabled">
        取消
      </el-button>
      <el-button type="primary" @click="submit" :disabled="disabled">
        确认
      </el-button>
    </el-dialog>

    <el-dialog v-model="previewModel">
      <img w-full :src="previewIng" class="m-auto" />
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getShopList,
  shopOffSale,
  shopOnSale,
  shopSetScore,
  shopSetSort
} from "@/api/shop";
import { ref } from "vue";
import { shopStoreState } from "@/store/modules/shop";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { message } from "@/utils/message";
const router = useRouter();
const list = ref([]);
const total = ref(0);
const shopModel = ref(false);
const shopDetail = ref({});
// 是否禁止点击
const disabled = ref(true);
const params = ref({
  offset: 0,
  limit: 20,
  name: "",
  id: "",
  userId: "",
  categoryId: "",
  degreeType: "",
  city: "",
  linkerMobile: "",
  state: "",
  auditState: ""
});
const stateList = shopStoreState().stateList;
const degreeType = shopStoreState().degreeTypeList;
const auditState = shopStoreState().auditStateList;

const previewModel = ref(false);
const previewIng = ref("");

const getList = async () => {
  disabled.value = true;
  await getShopList(params.value)
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

// 详情
const goDetail = id => {
  router.push(`/shop/detail?id=${id}`);
};

// 上下架
const upState = async item => {
  console.log(item);
  item.state != 1 ? await shopOnSale(item.id) : await shopOffSale(item.id);
  getList();
  message("操作成功", { type: "success" });
};

// 修改设置分、排序
const upShopDetil = (item, type) => {
  shopModel.value = true;
  const { setScore, sortWeight, id } = item;
  shopDetail.value = { setScore, sortWeight, id, type };
};

// 设置分、排序
const submit = async () => {
  shopDetail.value.type == 1
    ? await shopSetScore(shopDetail.value.id, {
        setScore: shopDetail.value.setScore
      })
    : await shopSetSort(shopDetail.value.id, {
        sortWeight: shopDetail.value.sortWeight
      });
  shopModel.value = false;
  shopDetail.value = {};
  message("操作成功", { type: "success" });
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
  flex-wrap: wrap;

  & > div {
    max-width: 300px;
    margin: 0 10px 10px;
  }
}
</style>
