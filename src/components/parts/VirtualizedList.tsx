import React from 'react'

import Link from '@docusaurus/Link'
import { Box } from '@mui/material'

import { Virtuoso } from 'react-virtuoso'

import type { Signatory, SignatoryList } from '@site/src/types'

// Item contents are cached properly with React.memo
const InnerItem = React.memo(({ member }: { member: Signatory }) => (
  <li>
    <Link to={`https://www.google.com/search?q=${member.name}+${member.affiliation}`}>
      {member.name}: ( {member.affiliation} )
    </Link>
  </li>
))

// The callback is executed often - don't inline complex components in here.
const itemContent = (_index: number, member: Signatory) => <InnerItem member={member} />

const VirtualizedList = React.memo(({ list }: { list: SignatoryList }) => (
  <Virtuoso style={{ height: '42vh' }} data={list} itemContent={itemContent} />
))

export default VirtualizedList
