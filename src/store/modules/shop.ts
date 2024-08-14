import { store } from "@/store";
import { defineStore } from "pinia";

export const shopStore = defineStore({
    id: "shop-store",
    state: () => ({
        stateList: [
            {
                label: "全部",
                value: -2
            },
            {
                label: "初始化",
                value: 0
            },
            {
                label: "上架",
                value: 1
            },
            {
                label: "下架",
                value: 2
            },
            {
                label: "已删除",
                value: -1
            }
        ],
        degreeTypeList: [
            {
                label: "全部",
                value: -2
            },
            {
                label: "全新",
                value: 1
            },
            {
                label: "二手",
                value: 2
            },
            {
                label: "求购",
                value: 3
            }
        ],
        auditStateList: [
            {
                label: "全部",
                value: -2
            },
            {
                label: "待审核",
                value: 0
            },
            {
                label: "审核通过",
                value: 1
            },
            {
                label: "审核拒绝",
                value: 2
            }
        ],

    })
});

export function shopStoreState() {
    return shopStore(store);
}
