import { buildUUID, storageSession } from "@pureadmin/utils";
import dayjs from "dayjs";
import * as qiniu from "qiniu-js";
import { DataInfo, sessionKey } from "./auth";


/**
 * 向七牛提交图片
 * @param upToken   token
 * @param files     files
 */
export async function upQiniuImage(token: string, files: any) {
  const file = files.file;
  const uuid = buildUUID().substring(0, 4);
  const time = dayjs().unix();
  const userInfo = storageSession().getItem<DataInfo>(sessionKey);
  const day = dayjs().format("YYYY-MM-DD")
  let key = "";// 设置图片的名字，生产随机uid，避免重复调用名字重复
  key = `image/${day}/${userInfo.id}_w_${file.width}_h_${file.height}_${time}_${uuid}.jpg`;
  const promise = new Promise((resolve, reject) => {
    files.content = ""; // 图片的展示的地址
    files.status = "uploading";
    const config = {
      useCdnDomain: true, // cdn加速
      retryCount: 5 // 上传错误重新上传次数
    };
    const putExtra = {
      fname: files,
      params: {},
    };
    const observer = {
      error(res: any) {
        reject(res);
      },
      complete(res: any) {
        resolve(res);
      }
    };
    const observable = qiniu.upload(file, key, token, putExtra, config); // 调用七牛的上传
    observable.subscribe(observer); // 上传监听
  });
  return promise;
}
