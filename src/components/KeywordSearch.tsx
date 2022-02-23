import React, { useState, useEffect } from 'react'
import { Box, TextField, Typography } from '@mui/material'

import { useDebounce } from '@site/src/libs/debounce'
import VirtualizedList from '@site/src/components/parts/VirtualizedList'
import ExportButtons from '@site/src/components/parts/ExportButtons'

import type { ChangeEvent } from 'react'
import type { Signatory, SignatoryList } from '@site/src/types'

interface SearchHeaderProps {
  keyword: string
  result: number // filterdList.length
  all: number // list.length
}

const LastUpdated = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

const SearchHeader = ({ keyword, result, all }: SearchHeaderProps) => (
  <Typography variant='h5' component='span'>
    {keyword.length ? (
      <>
        「{keyword}」に該当するのは <span>{result}</span> 人です
      </>
    ) : (
      <>
        署名者一覧を表示しています： 検索ワードを入力してください
        <br />
        （現在の総数 {all} 人　最終更新：{LastUpdated}）
      </>
    )}
  </Typography>
)

const isFulfilled = <T,>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
  input.status === 'fulfilled'

const search = (keyword: string, target: string): boolean => {
  const regexp = new RegExp(keyword, 'iu')
  return regexp.test(target)
}

const getSignatories = async (list: SignatoryList, keyword: string) => {
  // キーワードがなくて検索できない場合，list をそのまま帰す
  if (!keyword) return list

  const data = await Promise.allSettled(
    list.map(
      (member) =>
        new Promise<Signatory>((resolve, reject) => {
          try {
            const { name, affiliation } = member
            const isMatch = search(keyword, `${name}: ( ${affiliation} )`)
            if (isMatch) {
              resolve({ name, affiliation })
            } else {
              reject()
            }
          } catch (e) {
            reject(e)
          }
        })
    )
  )

  return data.filter(isFulfilled).map((r) => r.value)
}

const KeywordSearch = ({ member, keyword: queryParam }: { member: SignatoryList; keyword: string }): JSX.Element => {
  const initialValue = queryParam || '教授'
  const [value, setValue] = useState(initialValue)
  // @see cf. https://zenn.dev/bom_shibuya/articles/bd9c84bfe59f4f#カスタムフックでusedebounceを作る
  const debounce = useDebounce(1250)
  const [keyword, setKeyword] = useState(value)
  debounce(() => setKeyword(value))

  // keyword をもとに， useEffect 内で非同期に filterdList を更新
  const [filterdList, setFilterdList] = useState<SignatoryList>([])
  useEffect(() => {
    const fn = async () => setFilterdList(await getSignatories(member, keyword))
    void fn()
    // keyword をもとにしてクエリパラメータを書き換え
    const { pathname } = window.location
    const param = new URLSearchParams({ keyword })
    const url = keyword.length && keyword !== initialValue ? `${pathname}?${param.toString()}` : pathname
    history.pushState({ keyword }, document.title, url)
  }, [keyword])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)

  return (
    <>
      <TextField
        type='search'
        label='検索キーワード'
        placeholder='非常勤, 教授, 研究, 編集, etc...'
        value={value}
        color='primary'
        onChange={handleChange}
        fullWidth
      />
      <Box mt={3}>
        <SearchHeader keyword={keyword} result={filterdList.length} all={member.length} />
        <Box mt={3} component='ul' className='signatories'>
          <VirtualizedList list={filterdList} />
        </Box>
        <Box mt={1} textAlign='center'>
          <ExportButtons list={filterdList} />
        </Box>
      </Box>
    </>
  )
}

export default KeywordSearch
