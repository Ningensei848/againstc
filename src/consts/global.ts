export const SITE_NAME = 'Archives for Open Letters'

export const Title = `署名者検索 for オープンレター`

export const Description =
  '「オープンレター　女性差別的な文化を脱するために」への署名者を検索できるツール（このツールが名を騙られたかもしれない人，あるいはオープンレター署名者についてもっと知りたい人の手助けとなることを願って已まない）'

export const ImageTitle =
  '💌【 **オープンレター** 】に署名した人を検索🔍できるツールをつくった 🎉🎊🍾🥳 <br />〈詳細検索 `API` 有〼〉'

const QueryParams: { [key: string]: string } = {
  theme: 'light', // or dark
  copyright: SITE_NAME,
  logo: 'https://raw.githubusercontent.com/Ningensei848/open-letters/main/static/img/logo.png',
  avater: 'https://pbs.twimg.com/profile_images/763543133724352513/r6RlBYDo_400x400.jpg',
  author: 'Kiai',
  aka: '@Ningensei848',
  site: SITE_NAME
}

// Ningensei848/og-image ||  cf. https://github.com/Ningensei848/og-image#README
const APIEndpoint = 'https://custom-og-image-generator.vercel.app/api'

export const Tags = ['againstc', 'open-letter', 'search-in-text', 'nextjs', 'docusaurus-v2']

export const ImageUrl =
  `${APIEndpoint}` +
  `/${encodeURIComponent(ImageTitle)}.png` +
  '?' +
  Object.keys(QueryParams)
    .map((key) => `${key}=${encodeURIComponent(QueryParams[key])}`)
    .join('&') +
  `&tags=${Tags.map((t) => encodeURIComponent(t)).join('&tags=')}`

export const TWITTER_SITE = '@Ningensei848'
