// cf. https://github.com/LukasGentele/docusaurus-gtm-plugin

import type { LoadContext } from '@docusaurus/types'
import type { PluginOptions } from '@docusaurus/plugin-content-pages'

type CustomOptions = PluginOptions & {
  AD_ID: string
  GTM_ID: string
}

// Set up Twitter for Websites | Docs | Twitter Developer Platform
// cf. https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
const twttr = `
<script>
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
</script>
`
  .split('\n')
  .map((line) => line.trim())
  .join('')

const gtm = (id: string) => `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');</script>
<!-- End Google Tag Manager -->
`

const gtm_noscript = (id: string) => `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`
const adsense = (id: string) => {
  return {
    tagName: 'script',
    attributes: {
      async: true,
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${id}`,
      crossorigin: 'anonymous'
    }
  }
}
// options は `docusaurus.config.js` にてオプション引数として指定する
const plugin = async (context: LoadContext, options: CustomOptions) => {
  return {
    name: 'docusaurus-plugin-inject-html-tags',
    injectHtmlTags() {
      return {
        headTags: [
          `<link rel='preconnect' href='//fonts.gstatic.com' crossOrigin='anonymous' />`,
          adsense(options.AD_ID),
          gtm(options.GTM_ID),
          twttr
        ],
        postBodyTags: [gtm_noscript(options.GTM_ID)]
      }
    }
  }
}

export default plugin
