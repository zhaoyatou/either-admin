const Layout = () => import("@/layout/index.vue");

export default {
    path: "/keyword",
    name: "keyword",
    component: Layout,
    redirect: "/keyword",
    meta: {
        title: "用户建议管理",
        rank: 9
    },
    children: [
        {
            path: "/keyword",
            name: "keyword",
            component: () => import("@/views/keyword/index.vue"),
            meta: {
                title: "搜索词管理"
            }
        }
    ]
} as RouteConfigsTable;
