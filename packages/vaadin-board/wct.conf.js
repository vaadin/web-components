module.exports = {
    verbose: false,
    testTimeout: 6 * 60 * 1000,
    suites: ['test'],
    plugins: {
        sauce: {
            disabled: true,
            browsers: [
                "Windows 10/microsoftedge",
                "Windows 10/internet explorer",
                "Windows 10/chrome",
                "Windows 10/firefox",
                "OS X 10.10/safari"
            ]
        }
    }
};
