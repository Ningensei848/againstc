import React from 'react'
import { Redirect } from '@docusaurus/router'

const IndexPage = (): JSX.Element => {
  // 見せられるコンテンツがないのでとりあえずリダイレクトする
  return <Redirect to='/topic/open-letters' />
}

export default IndexPage
