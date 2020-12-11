const utils = require('./utils')
module.exports = {
  title: '大前端研究所',
  description: '欢迎关注公众号：大前端研究所',
  base: '/frontend/',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],

  themeConfig: {
    // repo: 'alfalfaw/frontend',
    editLinks: true,
    docsDir: 'docs',
    smoothScroll: true,
    nav: [
      {
        text: '博客',
        link: '/blog/'
      },
      {
        text: '分享',
        link: '/share/'
      },
      {
        text: '面试',
        link: '/interview/'
      }
    ],
    sidebar: utils.inferSiderbars(),
    lastUpdated: '上次更新',
    editLinkText: '在 GitHub 上编辑此页'
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    [
      '@vuepress/active-header-links',
      {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor'
      }
    ],
    ['@vuepress/back-to-top', true],
    ['@vuepress/medium-zoom', true],
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10
      }
    ]
  ],
  chainWebpack: (config, isServer) => {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: `assets/img/[name].[hash:8].[ext]`
      })
  }
}
