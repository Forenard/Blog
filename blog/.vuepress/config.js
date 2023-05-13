module.exports = {
    title: 'Renard\'s Blog',
    description: 'Renard\'s Portfolio & Blog',
    theme: '@vuepress/theme-blog',
    locales: {
        '/': {
            lang: 'ja'
        }
    },
    head: [["link", { rel: "icon", href: "/favicon.ico" }]],
    themeConfig: {
        dateFormat: 'YYYY-MM-DD',
        nav: [
            { text: 'Top', link: '/top/' },
            { text: 'About', link: '/2023/05/13/about/' },
            { text: 'Works', link: '/2023/05/13/works/' },
            { text: 'Blog', link: '/' },
            { text: 'Tags', link: '/tag/' },
        ],
        footer: {
            contact: [
                {
                    type: 'github',
                    link: 'https://github.com/Forenard',
                },
                {
                    type: 'twitter',
                    link: 'https://twitter.com/Renardealer',
                },
            ],
            copyright: [
                {
                    text: 'Privacy Policy',
                    link: 'https://policies.google.com/privacy?hl=en-US',
                },
                {
                    text: 'MIT Licensed',
                },
            ],
        },
        comment: {
            service: 'disqus',
            shortname: 'vuepress-plugin-blog',
        },
        // pwa: true,
        smoothScroll: true
    }
}