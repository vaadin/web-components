module.exports = {
    verbose: false,
    testTimeout: 6 * 60 * 1000,
    plugins: {
        sauce: {
            disabled: true,
            browsers: [
                "Windows 8.1/internet explorer",
                "Windows 8.1/chrome",
                "Windows 8.1/firefox",
                "OS X 10.10/safari"
            ]
        }
    }
};
