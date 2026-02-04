// Use environment variables in development, runtime config in production
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// For tests, use environment variables or defaults
const testConfig = {
    FM_KEY: process.env.VUE_APP_FM_KEY || 'test-key',
    API_URL: process.env.VUE_APP_API_URL || 'https://test-api.example.com',
    AUTH_URL: process.env.VUE_APP_AUTH_URL || 'https://test-auth.example.com'
};

export const getConfig = () => {
    // In test environment, use test config
    if (isTest) {
        return {
            fmKey: testConfig.FM_KEY,
            apiUrl: testConfig.API_URL,
            authUrl: testConfig.AUTH_URL
        };
    }

    // In development use env vars, in production use runtime config
    return {
        fmKey: isDevelopment ? process.env.VUE_APP_FM_KEY : window.APP_CONFIG.FM_KEY,
        apiUrl: isDevelopment ? process.env.VUE_APP_API_URL : window.APP_CONFIG.API_URL,
        authUrl: isDevelopment ? process.env.VUE_APP_AUTH_URL : window.APP_CONFIG.AUTH_URL
    };
}; 