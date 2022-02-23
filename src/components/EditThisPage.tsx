/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
// import Translate from "@docusaurus/Translate";

import IconEdit from '@theme/IconEdit'
import { ThemeClassNames } from '@docusaurus/theme-common'

import type { Props } from '@theme/EditThisPage'

// 交差型 cf. https://typescriptbook.jp/reference/object-oriented/interface/interface-vs-type-alias
type CustomProps = Props & {
  text: string
}

export default function EditThisPage({ editUrl, text = 'Edit Request' }: CustomProps): JSX.Element {
  return (
    <a href={editUrl} target='_blank' rel='noreferrer noopener' className={ThemeClassNames.common.editThisPage}>
      <IconEdit />
      <wbr />
      {/* <Translate id="theme.common.editThisPage" description="The link label to edit the current page">
        Request for editing
      </Translate> */}
      {text}
    </a>
  )
}
