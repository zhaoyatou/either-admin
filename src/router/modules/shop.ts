const Layout = () => import("@/layout/index.vue");

export default {
  path: "/shop",
  name: "shop",
  component: Layout,
  redirect: "/shop",
  meta: {
    title: "商品列表",
    rank: 3
  },
  children: [
    {
      path: "/shop",
      name: "shop",
      component: () => import("@/views/shop/index.vue"),
      meta: {
        title: "商品列表"
      }
    },
    {
      path: "/shop/detail",
      name: "shopDetail",
      component: () => import("@/views/shop/detail.vue"),
      meta: {
        title: "商品详情",
        showLink: false
      }
    }
  ]
} as RouteConfigsTable;
