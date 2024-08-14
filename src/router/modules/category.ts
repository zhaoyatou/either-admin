const Layout = () => import("@/layout/index.vue");

export default {
  path: "/category",
  name: "category",
  component: Layout,
  redirect: "/category",
  meta: {
    title: "分类列表",
    rank:2,
  },
  children: [
    {
      path: "/category",
      name: "category",
      component: () => import("@/views/category/index.vue"),
      meta: {
        title: "分类列表"
      }
    },
    {
      path: "/category/cre",
      name: "category-cre",
      component: () => import("@/views/category/creCategory.vue"),
      meta: {
        title: "创建分类",
        showLink: false
      }
    },
  ]
} as RouteConfigsTable;
