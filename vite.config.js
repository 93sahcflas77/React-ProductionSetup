import { defineConfig, loadEnv, createLogger } from 'vite'
import react from '@vitejs/plugin-react'
import http from 'node:http'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
    if (msg.includes('vite:css') && msg.includes(' is empty')) return
    loggerWarn(msg, options)
}

const validateEnv = (EnvMode, env) => {
    const requiredVars = ['VITE_PORT', 'VITE_ENV', 'VITE_PROXY_TARGET']
    for (const varName of requiredVars) {
        if (!env[varName]) {
            throw new Error(`${varName} is missing! Please define it in your .env.${EnvMode}`)
        }
    }
}

const normalizePort = (port) => {
    const portNum = parseInt(port, 10)
    if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
        throw new Error(`Invalid port value: ${port}`)
    }
    return portNum
}

// export default defineConfig(({ command, mode, ssrBuild, isPreview }) => {
export default defineConfig(({ mode }) => {
    if (mode !== 'development' && mode !== 'production') {
        throw new Error(`Invalid mode: ${mode}`)
    }

    const EnvMode = mode
    const env = loadEnv(EnvMode, process.cwd(), 'VITE_')
    validateEnv(EnvMode, env)

    const port = normalizePort(env.VITE_PORT)

    return {
        customLogger: logger,
        root: process.cwd(),
        base: '/',
        define: {
            __API_BASE_URL__: JSON.stringify(env.VITE_PROXY_TARGET),
            __API_VERSION__: JSON.stringify(env.VITE_API_VERSION || 'v1'),
        },
        publicDir: 'public',
        cacheDir: 'node_modules/.vite',
        logLevel: 'info',
        clearScreen: true,
        envDir: process.cwd(),
        envPrefix: 'VITE_',
        plugins: [react()],
        server: {
            host: true, // 0.0.0.0
            port,
            strictPort: true,
            open: true,
            proxy: {
                '/api': {
                    target: env.VITE_PROXY_TARGET,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => {
                        if (path === '/api/health') {
                            return '/'
                        }
                        return path.replace(/^\/api/, '')
                    },
                    configure: (proxy) => {
                        proxy.on('proxyReq', (proxyReq, req) => {
                            logger.info(`Proxying request: ${req.method} ${req.url}`)
                        })
                        proxy.on('proxyRes', (proxyRes, req) => {
                            logger.info(`Received response: ${proxyRes.statusCode} for ${req.method} ${req.url}`)
                        })
                        proxy.on('error', (err, req) => {
                            logger.error(`Proxy error for ${req?.method || 'UNKNOWN'} ${req?.url || 'UNKNOWN'}: ${err.message}`)
                        })
                    },
                    headers: {
                        'X-App': "Tony's Vite App",
                    },
                    timeout: 5000,
                    proxyTimeout: 5000,
                    followRedirects: true,
                    xfwd: true,
                    // auth: "chandan: chandan123",
                    cookieDomainRewrite: 'localhost',
                    cookiePathRewrite: '/',
                    agent: new http.Agent({
                        keepAlive: true,
                    }),
                },
                '/socket': {
                    target: 'ws://localhost:3000',
                    ws: true,
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy) => {
                        proxy.on('open', () => {
                            logger.info('WebSocket proxy connection opened')
                        })
                        proxy.on('close', () => {
                            logger.info('WebSocket proxy connection closed')
                        })
                        proxy.on('error', (err) => {
                            logger.error(`WebSocket proxy error: ${err.message}`)
                        })
                    },
                    timeout: 5000,
                    proxyTimeout: 5000,
                },
            },
            cors: true,
            headers: {
                'X-Custom-Header': 'My custom header value',
            },
            warmup: {
                clientFiles: ['src/**/*.{js,jsx,ts,tsx}'],
                ssrFiles: ['src/**/*.{js,jsx,ts,tsx}'],
            },
            watch: {
                ignored: ['**/node_modules/**', '**/dist/**'],
            },
            origin: `http://localhost:${port}`,
            sourcemapIgnoreList: (path) => path.includes('node_modules'),
        },
        build: {
            target: 'es2020', //["chrome90", "edge90", "firefox90", "safari15"]
            modulePreload: {
                polyfill: true,
            },
            outDir: 'dist',
            assetsDir: 'assets',
            assetsInlineLimit: 8192, //8 kb
            cssCodeSplit: true,
            cssTarget: 'chrome90',
            cssMinify: 'esbuild',
            sourcemap: true,
            rollupOptions: {
                input: 'index.html',
                output: {
                    entryFileNames: 'assets/js/[name].[hash].js',
                    chunkFileNames: 'assets/chunks/[name].[hash].js',
                    assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
                },
            },
            dynamicImportVarsOptions: { include: /src/ },
            minify: 'esbuild',
            emptyOutDir: true,
            copyPublicDir: true,
            reportCompressedSize: true,
            chunkSizeWarningLimit: 1000,
        },
        preview: {
            host: true,
            port,
            strictPort: true,
            open: true,
        },
    }
})
