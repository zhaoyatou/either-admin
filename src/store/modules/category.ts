import { store } from "@/store";
import { defineStore } from "pinia";

export const categoryStore = defineStore({
    id: "category-store",
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
        levelList: [
            {
                label: "一级分类",
                value: 1
            },
            {
                label: "二级分类",
                value: 2
            }
        ],
    })
});

export function categoryStoreState() {
    return categoryStore(store);
}
