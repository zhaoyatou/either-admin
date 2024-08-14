const Layout = () => import("@/layout/index.vue");

export default {
    path: "/userControl",
    name: "userControl",
    component: Layout,
    redirect: "/userControl",
    meta: {
        title: "用户管理",
        rank: 4
    },
    children: [
        {
            path: "/userControl",
            name: "userControl",
            component: () => import("@/views/userControl/index.vue"),
            meta: {
                title: "用户管理"
            }
        },
        {
            path: "/userControl/detail",
            name: "userDetail",
            component: () => import("@/views/userControl/detail.vue"),
            meta: {
                title: "用户详情",
                showLink: false
            }
        }
    ]
} as RouteConfigsTable;
