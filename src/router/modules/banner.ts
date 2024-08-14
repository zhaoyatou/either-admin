const Layout = () => import("@/layout/index.vue");

export default {
  path: "/banner",
  name: "banner",
  component: Layout,
  redirect: "/banner",
  meta: {
    title: "banner列表",
    rank: 1,
  },
  children: [
    {
      path: "/banner",
      name: "banner",
      component: () => import("@/views/banner/index.vue"),
      meta: {
        title: "banner列表"
      }
    },
    {
      path: "/banner/cre",
      name: "banner-cre",
      component: () => import("@/views/banner/creBanner.vue"),
      meta: {
        title: "创建banner",
        showLink: false
      }
    }
  ]
} as RouteConfigsTable;
