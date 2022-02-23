import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { Redirect } from '@docusaurus/router'

const IndexPage = (): JSX.Element => {
  const dest = useBaseUrl('/topic/open-letters')
  // 見せられるコンテンツがないのでとりあえずリダイレクトする
  return <Redirect to={dest} />
}

export default IndexPage
