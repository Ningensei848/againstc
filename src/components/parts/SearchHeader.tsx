import React, { Fragment } from 'react'

import { Typography } from '@mui/material'

interface SearchHeaderProps {
  queries: string[]
  op: boolean
  ex: boolean
  result: number
  all: number
}

const LastUpdated = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

const SearchHeader = ({ queries, op, ex, result, all }: SearchHeaderProps): JSX.Element => (
  <Typography variant='h5' component='span' maxWidth='67vw'>
    {queries.join('').length ? (
      <>
        {queries.filter(Boolean).map((q, idx) => (
          <Fragment key={idx}>
            {!idx ? '' : op ? 'かつ' : 'または'}
            <wbr /> <code className='search-header'>/{q}/</code>
            <wbr />{' '}
          </Fragment>
        ))}
        に該当{ex ? <u>しない</u> : 'する'}
        <wbr />
        のは <span>{result}</span> 人です
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

export default SearchHeader
