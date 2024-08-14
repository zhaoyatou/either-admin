const Layout = () => import("@/layout/index.vue");

export default {
  path: "/pay",
  name: "pay",
  component: Layout,
  redirect: "/pay",
  meta: {
    title: "支付记录",
    rank: 8,
  },
  children: [
    {
      path: "/pay",
      name: "pay",
      component: () => import("@/views/pay/index.vue"),
      meta: {
        title: "支付记录"
      }
    }
  ]
} as RouteConfigsTable;
