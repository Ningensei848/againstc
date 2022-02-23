import React from 'react'

import { useTweetEmbed } from '@site/src/libs'

// Default implementation, that you can customize
// @see cf. https://docusaurus.io/docs/advanced/swizzling#wrapper-your-site-with-root
const Root = ({ children }: { children: ChildNode }): JSX.Element => {
  // 埋め込みツイートをアクティベートする（単なる blockquote が tweet widget になる）
  useTweetEmbed()

  return <>{children}</>
}

export default Root
