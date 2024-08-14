import { store } from "@/store";
import { defineStore } from "pinia";

export const bannerStore = defineStore({
    id: "banner-store",
    state: () => ({
        stateList: [
            {
                label: "全部",
                value: -2
            },
            {
                label: "不显示",
                value: 0
            },
            {
                label: "显示",
                value: 1
            }
        ],
        positionList: [
            {
                label: "全部",
                value: -2
            },
            {
                label: "开屏广告",
                value: 1
            },
            {
                label: "首页轮播图",
                value: 2
            },
            {
                label: "首页顶部广告",
                value: 3
            },
            {
                label: "搜索页底部广告",
                value: 4
            },
            {
                label: "商品列表顶部广告",
                value: 5
            },
            {
                label: "分类搜索页底部广告",
                value: 6
            },
            {
                label: "用户搜索页顶部广告",
                value: 7
            },
        ],

    })
});

export function bannerStoreState() {
    return bannerStore(store);
}
