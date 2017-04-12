module.exports = {
    verbose: false,
    testTimeout: 6 * 60 * 1000,
    plugins: {
        sauce: {
            'disabled': true,
            'browsers': [
                {
                    'browserName': 'MicrosoftEdge',
                    'platform': 'Windows 10',
                    'version': '14.14393'
                },
                {
                    'browserName': 'Internet Explorer',
                    'platform': 'Windows 7',
                    'version': '11'
                },
                {
                    'browserName': 'Chrome',
                    'platform': 'Windows 10',
                    'version': '56.0'
                },
                {
                    'browserName': 'Firefox',
                    'platform': 'Windows 10',
                    'version': '50.0'
                },
                {
                    'browserName': 'safari',
                    'platform': 'OS X 10.11',
                    'version': '10.0'
                },
                {
                    'browserName': 'safari',
                    'platform': 'OS X 10.11',
                    'version': '9.0'
                }
            ]
        }
    }
}
