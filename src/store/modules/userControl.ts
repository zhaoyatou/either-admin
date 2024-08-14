import { store } from "@/store";
import { defineStore } from "pinia";

export const userControlStore = defineStore({
    id: "user-control",
    state: () => ({
        stateList: [
            {
                label: "全部",
                value: -2
            },
            {
                label: "禁用",
                value: 0
            },
            {
                label: "正常",
                value: 1
            },
            {
                label: "已删除",
                value: -1
            }
        ],
        sexList: [
            {
                label: "未知",
                value: 0
            },
            {
                label: "男",
                value: 1
            },
            {
                label: "女",
                value: 2
            }
        ],
        identityStateList: [
            {
                label: "全部",
                value: -2
            },
            {
                label: "初始化",
                value: 0
            },
            {
                label: "待审核",
                value: 1
            },
            {
                label: "审核通过",
                value: 2
            },
            {
                label: "审核拒绝",
                value: 3
            }
        ],

    })
});

export function userControlStoreState() {
    return userControlStore(store);
}
