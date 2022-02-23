import axios from 'axios'

import type { LoadContext, Plugin } from '@docusaurus/types'
import type { PluginOptions } from '@docusaurus/plugin-content-pages'
import type { SignatoryList } from '@site/src/types'

type CustomPluginOptions = PluginOptions & {
  routeName?: string
}

const getSignatories = async () => {
  const res = await axios({
    method: 'get',
    url: 'https://raw.githubusercontent.com/Ningensei848/open-letters/api-server/public/signatory.tsv'
  })
  const text: string = await res.data

  const signatories = text.split(/\n+/).map((line) => {
    const [name, affiliation] = line.trim().split(/\s+/)
    return { name, affiliation }
  })
  return signatories
}

const pluginSignatoryList = async (
  context: LoadContext,
  options: CustomPluginOptions
): Promise<Plugin<SignatoryList>> => {
  const { baseUrl } = context
  const { routeName } = options

  return {
    name: 'signatory-search',
    /*
      To fetch from data sources (filesystem, remote API, headless CMS, etc.) or do some server processing.
      The return value is the content it needs.
      @see https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis#loadContent
    */
    async loadContent() {
      return await getSignatories()
    },
    async contentLoaded({ content, actions }) {
      // 1. create static file (createData)
      // 2. configure routes (addRoute)
      const { createData, addRoute } = actions
      const filepath = await createData(
        'signatory.json', // not filepath, but **filename**
        JSON.stringify({ member: content })
      )
      // Add the '/' routes, and ensure it receives the `signatory` as props
      addRoute({
        path: routeName ? baseUrl + routeName : baseUrl,
        component: '@site/src/components/SignatorySearch.tsx',
        modules: {
          // propName -> JSON file path
          signatory: filepath
        },
        exact: true
      })
    }
  }
}

export default pluginSignatoryList
