module.exports = {
    globals: {
        'ts-jest': {
            tsConfigFile: 'tsconfig.json'
        },
        NODE_ENV: "test"
    },

    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'vue'
    ],

    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        "^vue$": "vue/dist/vue.common.js"
    },
    snapshotSerializers: [
        "<rootDir>/node_modules/jest-serializer-vue"
    ],
    // testMatch: [
    //     '**/test/**/*.test.(ts|js)'
    // ],
    // testEnvironment: 'jsdom',
    // setupTestFrameworkScriptFile: "<rootDir>/test/jest-setup.js"
};