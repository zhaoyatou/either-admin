<template>
  <div class="el-uploads">
    <el-upload
      ref="upLoad"
      action="#"
      list-type="picture-card"
      :on-exceed="handleExceed"
      :multiple="limit > 1 ? true : false"
      :limit="limit"
      :http-request="imageUploads"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeUp"
      :file-list="fileList"
      accept="image/jpg,image/jpeg,image/png"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip">
          {{ tip }}
        </div>
      </template>
    </el-upload>
    <!-- 大图预览 -->
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref, watch } from "vue";
import { getQiniuToken } from "@/api/qiniu";
import { upQiniuImage } from "@/utils/qiniu-js";
import { message } from "@/utils/message";
import { Plus } from "@element-plus/icons-vue";
// 大图
const dialogImageUrl = ref();
// 查看大图
const dialogVisible = ref(false);
// 创建图片列表
const fileKeyList = ref([]);

const upLoad = ref();

const props = defineProps<{
  // 限制长度
  limit?: number;
  // 修改图片列表
  fileList: Array<{ uid: string; url: string }>;
  // 是否创建图片
  isEstablish?: boolean;
  // 提示消息
  tip?: string;
  // 按钮样式
  btnName?: string;
  // 是否展示已上传
  showList?: boolean;
}>();

const dialogShow = computed({
  get: () => props.fileList,
  set: val => val
});

// 删除当前图片
const handleRemove = file => {
  if (props.isEstablish) {
    // 根据当前要删除图片uid，获取该uid在uid数组中所对应的下标
    const index = fileKeyList.value.findIndex(item => item.uid === file.uid);
    // 在fileList数组中找到它！干掉它！
    fileKeyList.value.splice(index, 1);
  } else {
    // 根据当前要删除图片uid，获取该uid在uid数组中所对应的下标
    const index = dialogShow.value.findIndex(item => item.uid === file.uid);
    // 在fileList数组中找到它！干掉它！
    dialogShow.value.splice(index, 1);
  }
};

// 自定义上传
const imageUploads = async (file: any) => {
  const { data }: any = await getQiniuToken();
  const { key }: any = await upQiniuImage(data.uploadToken, file);
  const uid = file.file.uid;
  if (props.isEstablish) {
    fileKeyList.value.push({ uid, key });
  } else {
    dialogShow.value.push({
      uid,
      url: `https://cdn.eithergo.com/${key}`
    });
  }
};

const handleExceed = (files, fileList) => {
  message(
    `当前限制选择 ${props.limit} 个文件，本次选择了 ${
      files.length
    } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
    { type: "warning" }
  );
};

// 修改
watch(
  () => dialogShow,
  () => {
    let keyList: any = [];
    if (dialogShow.value.length > 0) {
      dialogShow.value.map(item => {
        keyList = [
          ...keyList,
          item.url.split("https://cdn.eithergo.com/")[1]
        ];
      });
      upImagekey(keyList);
    }
  },
  { deep: true }
);

// 创建
watch(
  () => fileKeyList,
  () => {
    let keyList: any = [];
    if (fileKeyList.value.length) {
      fileKeyList.value.map(item => {
        keyList = [...keyList, item.key];
      });
      upImagekey(keyList);
    }
  },
  { deep: true }
);

// 获取图片宽高
const beforeUp = file => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message(`上传图片大小不能超过 2MB!`, { type: "error" });
    return false;
  }
  const reader = new FileReader();
  reader.onload = function (event: any) {
    const txt = event.target.result;
    const img = document.createElement("img");
    img.src = txt;
    img.onload = function () {
      file.width = img.width;
      file.height = img.height;
    };
  };
  reader.readAsDataURL(file);
};

// 查看大图
const handlePictureCardPreview = file => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

// 清除图片
// const clearFiles = () => {
//   upLoad.value.clearFiles();
// };

// 上传成功后key发送到父组件
const emit = defineEmits(["upImagekey"]);

const upImagekey = key => {
  console.log(key)
  emit("upImagekey", key);
};
</script>
<style lang="scss" scoped>
.el-uploads {
  .img1-1 {
    width: 100%;
    padding-top: 100%;
    background-size: 100%;
    background-position: center;
  }
}
</style>
