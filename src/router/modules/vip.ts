const Layout = () => import("@/layout/index.vue");

export default {
  path: "/vip",
  name: "vip",
  component: Layout,
  redirect: "/vip",
  meta: {
    title: "vip列表",
    rank: 6,
  },
  children: [
    {
      path: "/vip",
      name: "vip",
      component: () => import("@/views/vip/index.vue"),
      meta: {
        title: "vip列表"
      }
    }
  ]
} as RouteConfigsTable;
