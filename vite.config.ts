import dayjs from "dayjs";
import { resolve } from "path";
import pkg from "./package.json";
import { warpperEnv } from "./build";
import { getPluginsList } from "./build/plugins";
import { include, exclude } from "./build/optimize";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";

/** 当前执行node命令时文件夹的地址（工作目录） */
const root: string = process.cwd();

/** 路径查找 */
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

/** 设置别名 */
const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "@build": pathResolve("build")
};

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
};

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // VITE_API_URL
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH, VITE_BUILD_ENV } =
    warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // proxy: {
      //   '/api': {
      //     // target: VITE_API_URL,
      //     target: "http://47.93.87.212:8301/",
      //     // target: "http://127.0.0.1:7860",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // }
    },
    plugins: getPluginsList(command, VITE_CDN, VITE_COMPRESSION),
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      sourcemap: false,
      outDir: VITE_BUILD_ENV,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: `static/js/[name]-[hash]-${dayjs(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          )}.js`,
          entryFileNames: `static/js/[name]-[hash]-${dayjs(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          )}.js`,
          assetFileNames: `static/[ext]/[name]-[hash]-${dayjs(
            new Date()
          ).format("YYYY-MM-DD HH:mm:ss")}.[ext]`
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
