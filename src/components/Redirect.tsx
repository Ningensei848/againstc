import React from 'react'
import { Redirect } from '@docusaurus/router'

const PermanentRedirect = ({ pathTo }: { pathTo: { dest: string } }): JSX.Element => {
  const { dest } = pathTo
  return <Redirect to={dest} />
}

export default PermanentRedirect
