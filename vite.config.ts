import { defineConfig, loadEnv, createLogger } from "vite";
import react from "@vitejs/plugin-react";
import { stringify } from "node:querystring";


// type loadEnv = (
//     mode: string, 
//     envDir: string | false, 
//     prefix?: string | string[]
// ): Record<string, string>;

const validateEnv = (EnvMode: string, env: Record<string, string>): void => {
    const requiredVars: string[] = ["VITE_API_URL", "VITE_API_KEY", "VITE_APP_PORT"];
    for (const varName of requiredVars) {
        if (!env[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    }
};

const normalizePath = (port: number | string) => {
    if (typeof port === "number") {
        return port;
    }
    if (typeof port === "string") {
        const parsedPort = parseInt(port, 10);
        if (!isNaN(parsedPort)) {
            return parsedPort;
        }
    }
    throw new Error(`Invalid port value: ${port}`);
}

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // Ignore empty CSS files warning
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig(({
    command,
    mode,
    ssrBuild,
    isPreview,
}: {
    command: "build" | "serve";
    mode: string;
    ssrBuild?: boolean | undefined;
    isPreview?: boolean | undefined;
}) => {

    if (mode !== "development" && mode !== "production") {
        throw new Error(`Invalid mode: ${mode}`);
    }

    let EnvMode: string = mode

    const env = loadEnv(EnvMode, process.cwd(), "VITE_");

    validateEnv(EnvMode, env);

    const port = normalizePath(env.VITE_APP_PORT);

    // if (command === "serve") {
    //     return {
    //         // dev server options
    //         plugins: [react()],
    //         server: {
    //             host: true,
    //             port: port,
    //         }
    //     }
    // } else {
    //     return {
    //         // build options
    //     }
    // }


    return {
    // root: string;                      // default:-  process.cwd()    // The project root directory (where index.html is located). Can be an absolute path or a path relative to the current working directory. The default value is the current working directory.
    // base: string;                      // default:-  "/"    // The base public path when served in development or production. Can be an absolute path, a path relative to the current working directory, or a full URL. The default value is "/".
    // mode: string;                      // default:-  "development" or "production"    // The mode to run the dev server in. This can be either "development" or "production". The default value is "development" when running the dev server and "production" when building for production.
    // define: Record<string, any>;       // ex:-  __APP_VERSION__: JSON.stringify('v1.0.0'), __API_URL__: 'window.__backend_api_url', Define global constants that can be replaced at compile time. This is useful for creating environment-specific variables or feature flags in your code. The keys of the object are the names of the global constants, and the values are the values that will be replaced in the code. For example, you can specify { __API_URL__: "https://api.example.com" } to replace all occurrences of __API_URL__ in your code with "https://api.example.com".
    // publicDir: string;                   // default:-  "public"    // The directory to serve as plain static assets. Files in this directory are served at the root path during development and copied to the root of the output directory during build. The default value is "public".
    // cacheDir: string;                    // default:-  "node_modules/.vite"    // The directory to store cached files. This is used by Vite to cache pre-bundled dependencies and other build artifacts to improve performance. The default value is "node_modules/.vite".
    // logLevel: "info" | "warn" | "error" | "silent";    // default:-  "info"    // The level of logging to output. This can be one of the following values:
    // // - "info": Output all logs, including informational messages, warnings, and errors. This is the default value.
    // // - "warn": Output only warnings and errors, but not informational messages.
    // // - "error": Output only errors, but not informational messages or warnings.
    // // - "silent": Suppress all logs, including informational messages, warnings, and errors.
    // clearScreen: boolean;                 // default:-  true    // Whether to clear the console screen when the dev server starts. If set to true, the console will be cleared of all previous logs and messages when the dev server starts. If set to false, the console will retain all previous logs and messages when the dev server starts. The default value is true.
    // envDir: string | false;                 // default:-  process.cwd()    // The directory to load .env files from. This is used by Vite to load environment variables from .env files during development and build. The default value is the current working directory.
    // envPrefix: string | string[];                 // default:-  "VITE_"    // The prefix for environment variables loaded from .env files. This is used by Vite to filter which environment variables should be exposed to the client-side code. Only variables that start with the specified prefix will be included in the client-side bundle. The default value is "VITE_".
    plugins: [react()],
        server: {
        // host: string | boolean | undefined;   // Specify which IP addresses the server should listen on. Set this to 0.0.0.0 or true to listen on all addresses, including LAN and public addresses.
        // allowedHosts: string[];               // The hostnames that Vite is allowed to respond to. localhost and domains under .localhost and all IP addresses are allowed by default. When using HTTPS, this check is skipped.
        // port: number;                         // Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on.
        // strictPort: boolean;                  // Set to true to exit if port is already in use, instead of automatically trying the next available port.
        // open: boolean | string;               // Automatically open the app in the browser on server start.
        // proxy: {
        //     target: string,               // Defines backend server URL.
        //     changeOrigin: boolean,        // Changes request host header. 
        //     secure: boolean,            // Enable WebSocket proxy.
        //     ws: boolean,                 // Enable WebSocket proxy.
        //     rewrite: (path: string) => string; // Rewrite target's url by replacing the context with the specified path.
        //     configure: (proxy: any, options: any) => void; // Manually modify the created proxy. Useful when you need to use options that http-proxy doesn't expose by default. The proxy argument is the instance of http-proxy returned by createProxy.
        //     bypass: (req: any, res: any, options: any) => void | string; // Bypass proxy by returning a falsy value or a path to override the target's url. The req argument is the original request object, and the res argument is the response object that will be sent to the client. The options argument is the same options object passed to createProxy.
        //     headers: {
        //         [key: string]: string;    // Custom headers to be sent to the target server.
        //     },
        //     timeout: number;              // Specify the timeout for outgoing requests to the target server. If the target server fails to respond within this time, the request will be aborted and an error will be returned. 
        //     proxyTimeout: number;         // Specify the timeout for incoming requests to the Vite dev server. If a request takes longer than this time to complete, it will be aborted and an error will be returned.  
        //     followRedirects: boolean;         // Follow redirects sent by the target server. If set to true, the proxy will automatically follow HTTP 3xx responses and make a new request to the URL specified in the Location header. If set to false, the proxy will return the redirect response to the client without following it.
        //     xfwd: boolean;                 // Adds x-forward headers. x-forwarded-for, x-forwarded-host, and x-forwarded-proto headers will be added to the request when the proxy is enabled. These headers are commonly used to identify the original client IP address, host, and protocol when the request is forwarded through a proxy server. 
        //     auth: string;                   // Basic authentication credentials in the format "username:password". If specified, the proxy will include an Authorization header with the provided credentials in each request to the target server.
        //     cookieDomainRewrite: string | boolean;    // Rewrites the domain of set-cookie headers. If set to a string, the domain will be rewritten to the specified value. If set to true, the domain will be rewritten to the host of the target URL. If set to false, no rewriting will be performed.
        //     cookiePathRewrite: string | boolean;      // Rewrites the path of set-cookie headers. If set to a string, the path will be rewritten to the specified value. If set to true, the path will be rewritten to "/". If set to false, no rewriting will be performed.
        //     selfHandleResponse: boolean;          // If set to true, the proxy will not automatically send the response from the target server to the client. Instead, it will allow you to handle the response manually in the bypass function or by listening to the proxyRes event on the proxy instance. This can be useful if you need to modify the response before sending it to the client or if you want to implement custom logic for handling certain responses.
        //     agent: any;                         // An instance of http.Agent to use when proxying requests. This can be used to configure connection pooling, SSL settings, and other options for outgoing requests to the target server. If not specified, the default http.Agent will be used.
        // };
        // cors: boolean | string[] | {                    // Enable CORS for the dev server. This is useful when your frontend and backend are running on different origins during development.
        //     origin?: string;
        //     methods?: string[];
        //     allowedHeaders?: string[];
        //     exposedHeaders?: string[];
        // };
        // headers: {
        //     [key: string]: string;    // Custom headers to be sent with every response from the dev server.
        // };
        // forwardConsole: boolean | {
        //     unhandledErrors: boolean;
        //     logLevels?: ("log" | "info" | "warn" | "error" | "debug" | "trace")[];
        // };                 // Forward console logs from the server to the client. This can be useful for debugging server-side code during development.
        // warmup: string |  {          //  // Pre-bundle dependencies when the server starts. This can improve performance by reducing the time it takes to serve the first request, but it may increase the startup time of the server.
        //     clientFiles: string[];    // An array of file paths to pre-bundle when the server starts. These files will be processed and cached by Vite, which can improve performance when they are imported in the application. The file paths should be relative to the project root and can include glob patterns.
        //     ssrFiles: string[];       // An array of file paths to pre-bundle for server-side rendering (SSR) when the server starts. These files will be processed and cached by Vite, which can improve performance when they are imported in the SSR entry point. The file paths should be relative to the project root and can include glob patterns.
        // };
        // watch: {
        //     ignored: string[];    // An array of file paths or glob patterns to ignore when watching for file changes. This can be useful to exclude certain files or directories from triggering a server restart during development. The file paths should be relative to the project root.
        // } ;
        // origin: string;                        // Specify the origin for the dev server. This is used when the server is behind a proxy or when you want to specify a custom origin for CORS requests. The origin should include the protocol and port, e.g. http://localhost:3000.                 
        // sourcemapIgnoreList: false | {
        //     sourcePath: string;    // An array of file paths or glob patterns to ignore when serving source maps. This can be useful to improve performance when debugging large dependencies that have source maps, but it may make it harder to debug those dependencies. The file paths should be relative to the project root.
        //     sourcemap: string;    // If set to true, the dev server will not serve source maps for the specified files. This can be useful to improve performance when debugging large dependencies that have source maps, but it may make it harder to debug those dependencies.
        // }
    },
    build: {
        // target?: string | string[];    // Specify the target browsers or runtime environments for the build. This can be a single string or an array of strings, and it can include browser names, versions, or environment names. For example, you can specify "es2020" to target modern browsers that support ES2020 features, or you can specify ["chrome 80", "firefox 80"] to target specific versions of Chrome and Firefox.
        // modulePreload: boolean | {
        //     polyfill: boolean;    // Whether to include a polyfill for browsers that do not support modulepreload. If set to true, a small polyfill will be included in the build to enable modulepreload support in older browsers. If set to false, no polyfill will be included, and modulepreload will only work in browsers that natively support it.
        //     resolveDependencies: (url: string, daps: string[], context: {
        //         hostId: string;
        //         hostType: "html" | "js";
        //     }) => string[]
        // };
        // polyfillModulePreload: boolean;    // Whether to include a polyfill for browsers that do not support modulepreload. If set to true, a small polyfill will be included in the build to enable modulepreload support in older browsers. If set to false, no polyfill will be included, and modulepreload will only work in browsers that natively support it.
        // outDir: string;                      // Specify the output directory for the build. This is where the built files will be generated. The default value is "dist", but you can change it to any directory name you prefer.
        // assetsDir: string;                    // Specify the directory within the output directory where static assets (such as images, fonts, etc.) will be placed. The default value is "assets", but you can change it to any directory name you prefer.
        // assetsInlineLimit: number | ((
        //     file: string,
        //     content: Buffer,
        // ) => boolean | undefined);            // Specify the maximum file size (in bytes) for inlining static assets as base64 data URLs. If a static asset is smaller than this limit, it will be inlined in the JavaScript bundle as a base64-encoded string. If it is larger than this limit, it will be emitted as a separate file in the output directory. The default value is 4096 (4 KB).
        // cssCodeSplit: boolean;                   // Whether to enable CSS code splitting. If set to true, CSS imported in JavaScript files will be extracted into separate CSS files for each entry point. If set to false, all CSS will be bundled together in a single file. The default value is true.
        // cssTarget: string | string[];                      // Specify the target browsers for CSS features. This can be a single string or an array of strings, and it can include browser names, versions, or environment names. For example, you can specify "chrome 80" to target Chrome version 80 and above, or you can specify ["chrome 80", "firefox 80"] to target specific versions of Chrome and Firefox.
        // cssMinify: boolean | "lightningcss" | "esbuild";                    // Whether to minify CSS in the build. If set to true, CSS will be minified to reduce file size. If set to false, CSS will not be minified and will retain its original formatting. The default value is true.
        // sourcemap: boolean | "inline" | "hidden";          // Whether to generate source maps for the build. If set to true, source maps will be generated as separate files in the output directory. If set to "inline", source maps will be included in the JavaScript files as data URLs. If set to "hidden", source maps will be generated but not included in the JavaScript files, and they will not be referenced in the output files. The default value is false.
        // rolldownOptions: {
        //     input: string | string[] | Record<string, string>;    // Specify the entry points for the build. This can be a single string, an array of strings, or an object mapping entry names to file paths. For example, you can specify "src/main.js" to use a single entry point, or you can specify ["src/main.js", "src/admin.js"] to use multiple entry points, or you can specify { main: "src/main.js", admin: "src/admin.js" } to give custom names to the entry points.
        //     output: {
        //         format: "es" | "cjs" | "iife" | "umd" | "system";    // Specify the output format for the build. This can be one of the following values:
        //         // - "es": Output as ES modules. This is the recommended format for modern browsers and bundlers that support ES modules.
        //         // - "cjs": Output as CommonJS modules. This is the recommended format for Node.js environments.
        //         // - "iife": Output as an immediately-invoked function expression (IIFE). This is a self-executing function that can be used in browsers without a module system.
        //         // - "umd": Output as a Universal Module Definition (UMD) format. This is a format that can be used in both browsers and Node.js environments, and it supports both CommonJS and AMD module systems.
        //         // - "system": Output as SystemJS modules. This is a format that can be used in browsers that support the SystemJS module loader.
        //         // The default value is "es".
        //         entryFileNames: string;    // Specify the naming pattern for entry point files in the output directory. This can include placeholders such as [name] for the entry name and [hash] for a content hash. For example, you can specify "assets/[name].[hash].js" to generate files with names like "assets/main.abc123.js".
        //         chunkFileNames: string;    // Specify the naming pattern for chunk files in the output directory. This can include placeholders such as [name] for the chunk name and [hash] for a content hash. For example, you can specify "assets/[name].[hash].js" to generate files with names like "assets/chunk-abc123.js".
        //         assetFileNames: string;    // Specify the naming pattern for asset files (such as images, fonts, etc.) in the output directory. This can include placeholders such as [name] for the asset name and [hash] for a content hash. For example, you can specify "assets/[name].[hash][extname]" to generate files with names like "assets/image.abc123.png".
        //     }
        // };
        // rollupOptions: {
        //     input: string | string[] | Record<string, string>;    // Specify the entry points for the build. This can be a single string, an array of strings, or an object mapping entry names to file paths. For example, you can specify "src/main.js" to use a single entry point, or you can specify ["src/main.js", "src/admin.js"] to use multiple entry points, or you can specify { main: "src/main.js", admin: "src/admin.js" } to give custom names to the entry points.
        //     output: {
        //         format: "es" | "cjs" | "iife" | "umd" | "system";    // Specify the output format for the build. This can be one of the following values:
        //         // - "es": Output as ES modules. This is the recommended format for modern browsers and bundlers that support ES modules.
        //         // - "cjs": Output as CommonJS modules. This is the recommended format for Node.js environments.
        //         // - "iife": Output as an immediately-invoked function expression (IIFE). This is a self-executing function that can be used in browsers without a module system.
        //         // - "umd": Output as a Universal Module Definition (UMD) format. This is a format that can be used in both browsers and Node.js environments, and it supports both CommonJS and AMD module systems.
        //         // - "system": Output as SystemJS modules. This is a format that can be used in browsers that support the SystemJS module loader.
        //         // The default value is "es".
        //         entryFileNames: string;    // Specify the naming pattern for entry point files in the output directory. This can include placeholders such as [name] for the entry name and [hash] for a content hash. For example, you can specify "assets/[name].[hash].js" to generate files with names like "assets/main.abc123.js".
        //         chunkFileNames: string;    // Specify the naming pattern for chunk files in the output directory. This can include placeholders such as [name] for the chunk name and [hash] for a content hash. For example, you can specify "assets/[name].[hash].js" to generate files with names like "assets/chunk-abc123.js".
        //         assetFileNames: string;    // Specify the naming pattern for asset files (such as images, fonts, etc.) in the output directory. This can include placeholders such as [name] for the asset name and [hash] for a content hash. For example, you can specify "assets/[name].[hash][extname]" to generate files with names like "assets/image.abc123.png".
        //     }
        // };
        // dynamicImportVarsOptions: {
        //     include: RegExp | string | (RegExp | string)[];    // Specify a regular expression, a string, or an array of regular expressions and strings to include files for dynamic import variables. This option is used to control which files are processed for dynamic import variables in the build. For example, you can specify /src/ to include all files in the src directory, or you can specify "src/main.js" to include only that specific file.
        //     exclude: RegExp | string | (RegExp | string)[];    // Specify a regular expression, a string, or an array of regular expressions and strings to exclude files from dynamic import variables. This option is used to control which files are ignored for dynamic import variables in the build. For example, you can specify /node_modules/ to exclude all files in the node_modules directory, or you can specify "src/ignore.js" to exclude only that specific file.
        // };
        // lib: {
        //     entry: string | Record<string, string>;    // Specify the entry point(s) for the library build. This can be a single string or an object mapping entry names to file paths. For example, you can specify "src/index.js" to use a single entry point, or you can specify { main: "src/index.js", module: "src/module.js" } to give custom names to multiple entry points.
        //     name: string;                           // Specify the global variable name for the library when the output format is set to "iife" or "umd". This is required for these formats, as it defines the name of the global variable that will be used to access the library in the browser. For example, if you specify "MyLibrary", the library will be accessible as window.MyLibrary in the browser.
        //     formats: ("es" | "cjs" | "iife" | "umd" | "system")[];    // Specify the output formats for the library build. This can be an array of one or more of the following values:
        //     // - "es": Output as ES modules. This is the recommended format for modern browsers and bundlers that support ES modules.
        //     // - "cjs": Output as CommonJS modules. This is the recommended format for Node.js environments.
        //     // - "iife": Output as an immediately-invoked function expression (IIFE). This is a self-executing function that can be used in browsers without a module system.
        //     // - "umd": Output as a Universal Module Definition (UMD) format. This is a format that can be used in both browsers and Node.js environments, and it supports both CommonJS and AMD module systems.
        //     // - "system": Output as SystemJS modules. This is a format that can be used in browsers that support the SystemJS module loader.
        //     // The default value is ["es"].
        //     fileName?: string | ((format: string) => string);    // Specify the naming pattern for the output files in the library build. This can be a string or a function that takes the output format as an argument and returns a string. The string can include placeholders such as [name] for the entry name and [format] for the output format. For example, you can specify "my-library.[format].js" to generate files with names like "my-library.es.js" and "my-library.cjs.js".
        //     cssFileName?: string | ((format: string) => string);    // Specify the naming pattern for the output CSS files in the library build. This can be a string or a function that takes the output format as an argument and returns a string. The string can include placeholders such as [name] for the entry name and [format] for the output format. For example, you can specify "my-library.[format].css" to generate files with names like "my-library.es.css" and "my-library.cjs.css".
        // };
        // license: boolean | {
        //     fileName: string;
        // }   // Specify the file name for the generated license file. This is used when the license option is enabled to generate a file that includes the licenses of all dependencies used in the build. The default value is "LICENSE.txt".
        // manifest: boolean | string;       // Whether to include a manifest of the included dependencies in the generated license file. If set to true, the license file will include a list of all dependencies used in the build along with their respective licenses. If set to false, only the licenses will be included without the manifest. The default value is false.
        // ssrManifest: boolean | string;    // Whether to include a manifest of the included dependencies in the generated license file for server-side rendering (SSR) builds. If set to true, the license file will include a list of all dependencies used in the SSR build along with their respective licenses. If set to false, only the licenses will be included without the manifest. The default value is false.
        // ssr: boolean | string;           // Whether to generate a separate license file for server-side rendering (SSR) builds. If set to true, a separate license file will be generated for the SSR build, which will include the licenses of all dependencies used in the SSR build. If set to false, no separate license file will be generated for the SSR build, and the licenses will only be included in the main license file. The default value is false.
        // emitAssets: boolean;                 // Whether to emit the generated license file as an asset in the output directory. If set to true, the license file will be emitted as a separate file in the output directory. If set to false, the license file will not be emitted as an asset, and it will only be included in the build output without being written to the file system. The default value is true.
        // ssrEmitAssets: boolean;              // Whether to emit the generated license file for server-side rendering (SSR) builds as an asset in the output directory. If set to true, the license file for the SSR build will be emitted as a separate file in the output directory. If set to false, the license file for the SSR build will not be emitted as an asset, and it will only be included in the build output without being written to the file system. The default value is true.
        // minify: boolean | 'oxc' | 'terser' | 'esbuild';    // Whether to minify the generated license file. If set to true, the license file will be minified to reduce its size. If set to false, the license file will not be minified and will retain its original formatting. The default value is false.
        // terserOptions: {
        //     compress: boolean | Record<string, any>;    // Whether to enable compression when minifying the license file with Terser. If set to true, Terser will apply its default compression options to the license file. If set to an object, you can specify custom compression options for Terser. The options should be in the format expected by Terser, such as { drop_console: true } to remove console statements from the license file. The default value is false.
        //     mangle: boolean | Record<string, any>;      // Whether to enable mangling when minifying the license file with Terser. If set to true, Terser will apply its default mangling options to the license file. If set to an object, you can specify custom mangling options for Terser. The options should be in the format expected by Terser, such as { reserved: ['MyLibrary'] } to prevent mangling of the MyLibrary identifier in the license file. The default value is false.
        // };
        // write: boolean;                        // Whether to write the generated license file to the file system. If set to true, the license file will be written to the output directory as a separate file. If set to false, the license file will not be written to the file system, and it will only be included in the build output without being emitted as an asset. The default value is true.
        // emptyOutDir: boolean;                    // Whether to empty the output directory before building. If set to true, the output directory will be cleared of all existing files before the new build files are generated. If set to false, the new build files will be generated alongside any existing files in the output directory without deleting them. The default value is true.
        // copyPublicDir: boolean;                    // Whether to copy the contents of the public directory to the output directory during the build. If set to true, all files in the public directory will be copied to the output directory as part of the build process. If set to false, the contents of the public directory will not be copied, and you will need to handle any necessary copying of static assets manually. The default value is true.
        // reportCompressedSize: boolean;          // Whether to report the compressed size of the generated files in the build output. If set to true, the build output will include information about the compressed size of each generated file, which can be useful for analyzing the size of your build and optimizing it. If set to false, the compressed size will not be reported in the build output. The default value is true.
        // chunkSizeWarningLimit: number;                 // Specify the warning limit for chunk sizes in kilobytes. If any generated chunk exceeds this size, a warning will be displayed in the build output. This can help you identify and optimize large chunks in your build. The default value is 500 (500 KB).
        // watch: {
        //     include: string | string[];    // Specify a glob pattern or an array of glob patterns to include files for watching during development. This option is used to control which files are watched for changes in the development server. For example, you can specify "src/**/*" to watch all files in the src directory and its subdirectories, or you can specify ["src/**/*.js", "src/**/*.css"] to watch only JavaScript and CSS files in the src directory.
        //     exclude: string | string[];    // Specify a glob pattern or an array of glob patterns to exclude files from watching during development. This option is used to control which files are ignored for changes in the development server. For example, you can specify "node_modules/**/*" to exclude all files in the node_modules directory, or you can specify ["src/ignore.js", "src/ignore.css"] to exclude specific files from being watched.
        // }
    },
    preview: {
        // host: string | boolean | undefined;   // Specify which IP addresses the server should listen on. Set this to
        // allowedHosts: string[];               // The hostnames that Vite is allowed to respond to. localhost and domains under .localhost and all IP addresses are allowed by default. When using HTTPS, this check is skipped.
        // port: number;                         // Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on.
        // strictPort: boolean;                  // Set to true to exit if port is already in use, instead of automatically trying the next available port.
        // open: boolean | string;               // Automatically open the app in the browser on server start.
        // proxy: ProxyOptions;               // Configure the dev server proxy. This is useful when you need to work with an API server during development and want to avoid CORS issues.
        // cors: boolean;                        // Enable CORS for the dev server. This is useful when your frontend and backend are running on different origins during development.
        // headers: {
        //     [key: string]: string;    // Custom headers to be sent with every response from the dev server.
        // };
    },
    customLogger: logger
}

});