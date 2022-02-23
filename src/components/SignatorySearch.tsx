import React, { useEffect, useState, useMemo } from 'react'
import { useColorMode } from '@docusaurus/theme-common'
import { useLocation } from '@docusaurus/router'
import { parse as queryParse } from 'query-string'
import Layout from '@theme/Layout'
import { Box, Container, createTheme, Stack, Tab, Tabs, ThemeProvider } from '@mui/material'

import { ImageUrl, Title, Description, Tags } from '@site/src/consts'
import NextShareButtons from '@site/src/components/NextShareButtons'
import EditThisPage from '@site/src/components/EditThisPage'
import KeywordSearch from '@site/src/components/KeywordSearch'
import AdvancedSearch from '@site/src/components/AdvancedSearch'

import type { SyntheticEvent, ReactNode } from 'react'
import type { SignatoryList } from '@site/src/types'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

interface QueryParams {
  tab: 0 | 1
  keyword: string
  regexp: string[]
}

const TabPanel = React.memo((props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box mt={3}>{children}</Box>}
    </div>
  )
})

type TabIndex = 0 | 1

const SignatorySearch = ({ member, params }: { member: SignatoryList; params: QueryParams }) => {
  const { keyword, regexp, tab: initTab } = params
  // [Bug?] MUI.Tabs ... tab に props から index を渡すと 0 以外のタブは hidden になる
  const [tab, setTab] = useState<TabIndex>(0) // immutable な値を初期値として与え，useEffect を初回だけ実行して補正
  useEffect(() => setTab(initTab), []) // fired like `componentDidMount`

  const handleTabChange = (event: SyntheticEvent, newValue: TabIndex) => setTab(newValue)

  return (
    <>
      <Box borderBottom={1} borderColor='divider'>
        <Tabs value={tab} onChange={handleTabChange} aria-label='select type of search'>
          <Tab label='Keyword' />
          <Tab label='Advanced' />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <KeywordSearch {...{ member, keyword }} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <AdvancedSearch {...{ member, regexp }} />
      </TabPanel>
    </>
  )
}

const SearchFooter = () => {
  return (
    <Stack direction='row' justifyContent='space-between' mx={2} my={2}>
      <NextShareButtons />
      <EditThisPage
        editUrl='https://github.com/Ningensei848/open-letters/edit/api-server/public/signatory.tsv'
        text='Update Request'
      />
    </Stack>
  )
}

const Content = ({ member, params }: { member: SignatoryList; params: QueryParams }): JSX.Element => {
  // Docusaurus Color Mode: cf. https://docusaurus.io/docs/api/themes/configuration#use-color-mode
  const { isDarkTheme } = useColorMode()
  // MUI Color Mode: cf. https://docusaurus.io/docs/api/themes/configuration#use-color-mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkTheme ? 'dark' : 'light',
          primary: {
            light: isDarkTheme ? '#ff9699' : '#ff0a40',
            main: isDarkTheme ? '#ff6166' : '#e60033',
            dark: isDarkTheme ? '#ff2c33' : '#c4002b',
            contrastText: isDarkTheme ? '#fff' : '#000'
          }
        }
      }),
    [isDarkTheme]
  )

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='lg'>
        <SignatorySearch member={member} params={params} />
        <SearchFooter />
      </Container>
    </ThemeProvider>
  )
}

const SingleSpace = ' '

const Page = ({ signatory }: { signatory: { member: SignatoryList } }): JSX.Element => {
  /*
    React router provides the current component's route, even in SSR
    @see cf. https://docusaurus.io/docs/advanced/routing#generating-and-accessing-routes
   */
  const { search } = useLocation()
  const params = queryParse(search)
  const tab = 'regexp' in params ? 1 : 0
  const keyword = Array.isArray(params['keyword']) ? params['keyword'].join('|') : params['keyword'] || ''
  const regexp = Array.isArray(params['regexp']) ? params['regexp'].filter(Boolean) : [params['regexp']].filter(Boolean)
  const queries = 'regexp' in params ? regexp.map((r) => `\`/${r}/\``) : keyword.length ? [`\`/${keyword}/\``] : []
  const imgSrc = !queries.length
    ? ImageUrl
    : ImageUrl.replace(
        /\/[^\/]+?\.png\/?\?/,
        `/${encodeURIComponent(queries.join(SingleSpace) + `${SingleSpace}による検索結果`)}.png?`
      )

  console.log(imgSrc)

  return (
    <Layout image={imgSrc} title={Title} description={Description} keywords={Tags}>
      <Content member={signatory.member} params={{ tab, keyword, regexp }} />
    </Layout>
  )
}

export default Page
