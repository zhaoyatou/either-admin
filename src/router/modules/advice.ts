const Layout = () => import("@/layout/index.vue");

export default {
    path: "/advice",
    name: "advice",
    component: Layout,
    redirect: "/advice",
    meta: {
        title: "用户建议管理",
        rank:5,
    },
    children: [
        {
            path: "/advice",
            name: "advice",
            component: () => import("@/views/advice/index.vue"),
            meta: {
                title: "用户建议管理"
            }
        }
    ]
} as RouteConfigsTable;
