// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const { default: remarkEmbedder } = require('@remark-embedder/core')
const { default: oembedTransformer } = require('@remark-embedder/transformer-oembed')
const pattern_twitter = /^https:\/\/twitter\.com\/[a-zA-Z0-9_-]+\/status\/[a-zA-Z0-9?=&]+$/
const isTweetUrl = (url) => {
  return pattern_twitter.test(url)
}

const admonitionIcon = `<span class="admonition-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"></path></svg></span>`
const getFailureAdmonition = (url) => `
<div class="admonition admonition-danger alert alert--danger">
  <div class="admonition-heading"><h5>${admonitionIcon}ツイートの埋め込みに失敗しました</h5></div>
  <div class="admonition-content">
    <p>
      <ul><li><a href="${url}" target="_blank" rel="noopener noreferrer"><em>${url}</em></a></li></ul>
      指定されたリンクが間違っている、またはツイートが削除されています😢
      <hr />
      <ul>
        <li><a href="https://gyo.tc/${url}" target="_blank" rel="noopener noreferrer">Web 魚拓</a>で探す</li>
        <li><a href="https://web.archive.org/web/*/${url}" target="_blank" rel="noopener noreferrer">Internet Archive</a> で探す</li>
      </ul>
    </p>
  </div>
</div>`

const handleEmbedError = ({ error, url, transformer }) => {
  if (transformer.name !== '@remark-embedder/transformer-oembed' || !isTweetUrl(url)) {
    // we're only handling errors from this specific transformer and the twitter URL
    // so we'll rethrow errors from any other transformer/url
    throw error
  }
  return getFailureAdmonition(url)
}

const remarkOembedderPlugin = [
  remarkEmbedder,
  {
    transformers: [
      [
        oembedTransformer,
        // cf. https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-oembed
        { params: { maxwidth: 550, omit_script: true, align: 'center', lang: 'ja', dnt: true } }
      ]
    ],
    handleError: handleEmbedError
  }
]

const username = process.env.USER_NAME || 'Ningensei848' // Usually your GitHub org/user name.
const domainName = process.env.DOMAIN_NAME || 'ningensei848.github.io'
const repositoryName = process.env.REPOSITORY_NAME || 'againstc' // Usually your repo name.

const protocol = process.env.FORCE_HTTP ? 'http' : 'https'
const siteUrl = `${protocol}://${domainName}`
const siteName = process.env.SITE_NAME || '#againstc'
const basePath = process.env.BASE_PATH ? `/${process.env.BASE_PATH}/` : '/'

/** @type {import('@docusaurus/types').Config} */
const config = {
  projectName: repositoryName,
  title: '#againstc',
  tagline: 'キャンセル・カルチャーに徹底的に対抗し，「キャンセル」されないように過ごす方法を模索する',
  url: siteUrl,
  baseUrl: basePath,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: username,
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'content/topics', // Path to the docs content directory on the filesystem, relative to site dir.
          routeBasePath: 'topic',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: `https://github.com/${username}/${repositoryName}/edit/main/`,
          showLastUpdateTime: true,
          beforeDefaultRemarkPlugins: [remarkOembedderPlugin]
        },
        blog: {
          path: 'content/blogs', // Path to the blog content directory on the filesystem, relative to site dir.
          routeBasePath: 'blog',
          // Please change this to your repo.
          editUrl: `https://github.com/${username}/${repositoryName}/edit/main/`,
          showReadingTime: false,
          blogTitle: '気合でなんとか',
          blogDescription: 'キャンセル・カルチャーに徹底的に対抗し，「キャンセル」されないように過ごす方法を模索する',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All our posts',
          beforeDefaultRemarkPlugins: [remarkOembedderPlugin],
          feedOptions: {
            type: 'all',
            title: '気合でなんとか / #againstc',
            description: 'キャンセル・カルチャーに徹底的に対抗し，「キャンセル」されないように過ごす方法を模索する',
            copyright: `Copyright © #againstc / Kubokawa Takara, ${new Date().getFullYear()}`,
            language: 'ja-JP'
          }
        },
        theme: {
          customCss: [require.resolve('./src/css/custom.css')]
        }
      })
    ]
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Noto+Sans+JP',
    'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c',
    'https://fonts.googleapis.com/css?family=Sawarabi+Mincho'
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      hideableSidebar: true,
      navbar: {
        title: siteName,
        logo: {
          alt: siteName,
          src: 'img/logo.svg',
          srcDark: 'img/logo_dark.svg'
          // Logo URL is set to base URL of your site by default (siteConfig.baseUrl).
          // Although you can specify your own URL for the logo,
          // if it is an external link, it will open in a new tab.
          // href: `${siteUrl}/${repositoryName}`,
          // target: '_self'
        },
        items: [
          { to: '/', label: 'Home', position: 'left' },
          { to: '/blog', label: 'Blog', position: 'left' },
          { to: '/topic/open-letters/search', label: 'Signatory Search', position: 'left' },
          {
            href: `https://github.com/${username}/${repositoryName}`,
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Explore',
            items: [
              {
                label: 'Home',
                to: `/`
              },
              {
                label: 'Blog',
                to: `/blog`
              },
              {
                label: 'Signatory Search',
                to: '/topic/open-letters/search'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'Search API',
                href: 'https://open-letters.vercel.app'
              },
              {
                label: 'GitHub',
                href: `https://github.com/${username}/${repositoryName}`
              }
            ]
          }
        ],
        logo: {
          alt: 'Against Cancel Culture',
          src: 'img/logo.svg',
          srcDark: 'img/logo_dark.svg',
          // Logo URL is set to base URL of your site by default (siteConfig.baseUrl).
          // Although you can specify your own URL for the logo,
          // if it is an external link, it will open in a new tab.
          // href: `${siteUrl}/${repositoryName}`,
          width: 50,
          height: 50
        },
        copyright: `Copyright © #againstc / Kubokawa Takara, Built with Docusaurus. ${new Date().getFullYear()}`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      },
      googleAdsense: {
        dataAdClient: process.env.GOOGLE_ADSENSE_ID || 'ca-pub-xxxxxxxxxx'
      },
      // image: 'img/open-letters-banner.png', // og:image & twitter:image | cf. https://docusaurus.io/docs/api/themes/configuration#meta-image
      metadata: [
        // image は themeCondfig.image で指定する
        // ここで指定したものは，プロジェクトが管轄するすべてのページに「上書きして」適用される
        // docs / blogs / pages で個別に設定したい場合，それぞれの Page component を適宜 Swizzling する必要があることに留意
        { property: 'og:type', content: 'article' },
        { name: 'twitter:title', content: '#againstc' }
      ]
    }),

  plugins: [
    'docusaurus-plugin-google-adsense',
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        language: ['ja', 'en']
      }
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        /*
          <link rel="apple-touch-icon" sizes="180x180" href=`${basePath}img/apple-touch-icon.png">
          <link rel="icon" type="image/png" sizes="32x32" href=`${basePath}img/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="16x16" href=`${basePath}img/favicon-16x16.png">
          <link rel="manifest" href=`${basePath}img/site.webmanifest">
          <link rel="mask-icon" href=`${basePath}img/safari-pinned-tab.svg" color="#e60033">
          <meta name="msapplication-TileColor" content="#e60033">
          <meta name="theme-color" content="#e60033">
        */
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: `${basePath}img/apple-touch-icon.png`
          },
          {
            tagName: 'link',
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: `${basePath}img/favicon-32x32.png`
          },
          {
            tagName: 'link',
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: `${basePath}img/favicon-16x16.png`
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: `${basePath}img/site.webmanifest` // your PWA manifest
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: `${basePath}img/safari-pinned-tab.svg`,
            color: '#e60033'
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#e60033'
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(230, 0, 51)' // #e60033
          }
        ]
      }
    ],
    [
      // only active in production (always _inactive_ in development)
      '@docusaurus/plugin-client-redirects',
      /** @type {import("@docusaurus/plugin-client-redirects").Options} */
      ({
        redirects: [
          { from: '/topic', to: '/topic/open-letters' },
          { from: '/blog/2022', to: '/blog' }
        ]
      })
    ],
    // local plugins ----------------------------------------------------------
    [
      `${__dirname}/src/plugins/injectHeadTag`,
      { GTM_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || 'GTM-XXXXXX' }
    ],
    [`${__dirname}/src/plugins/signatory`, { routeName: 'topic/open-letters/search' }]
  ]
}

module.exports = config
