const Layout = () => import("@/layout/index.vue");

export default {
  path: "/inviter",
  name: "inviter",
  component: Layout,
  redirect: "/inviter",
  meta: {
    title: "代理推广列表",
    rank: 7,
  },
  children: [
    {
      path: "/inviter",
      name: "inviter",
      component: () => import("@/views/inviter/index.vue"),
      meta: {
        title: "代理推广列表"
      }
    }
  ]
} as RouteConfigsTable;
