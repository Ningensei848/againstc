import React, { useState, useEffect } from 'react'
import { Box, Stack } from '@mui/material'

import VariableForm from '@site/src/components/parts/VariableForm'
import ToggleButtons from '@site/src/components/parts/ToggleButtons'
import SearchHeader from '@site/src/components/parts/SearchHeader'
import VirtualizedList from '@site/src/components/parts/VirtualizedList'
import ExportButtons from '@site/src/components/parts/ExportButtons'

import type { ChangeEvent } from 'react'
import type { Signatory, SignatoryList } from '@site/src/types'

const isFulfilled = <T,>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
  input.status === 'fulfilled'

const search = (regexp: RegExp[], target: string): boolean => {
  for (const r of regexp) {
    if (!r.test(target)) {
      return false
    }
  }
  return true
}

const getRegExp = (text: string, flags?: string) => {
  try {
    return new RegExp(text, flags)
  } catch (e) {
    console.warn(e.message)
    return
  }
}

const getSignatories = async (list: SignatoryList, queries: string[], AND = false, EX = false) => {
  // クエリパラメータ指定がなく，検索しようがない場合は，すべての署名者リストを返す
  if (!queries.length || !queries.join('').length) return list

  // キーワード，排他条件の有無，論理演算子を組み合わせて正規表現の配列を作り，
  // 「すべてに一致した候補を返す」ようにすればよい
  const filtered = queries.filter(Boolean)
  // 検索候補があれば RegExp[] をつくる；なければ空の配列を返す
  const regexp = AND
    ? filtered.map((t) => getRegExp(t, 'iu')).filter(Boolean)
    : filtered.length
    ? [getRegExp(filtered.join('|'), 'iu')].filter(Boolean)
    : []

  const data = await Promise.allSettled(
    list.map(
      (member) =>
        new Promise<Signatory>((resolve, reject) => {
          try {
            const { name, affiliation } = member
            const isMatch = search(regexp, `${name}: ( ${affiliation} )`)
            // exclude = true なら，search した結果がひっくり返る
            const cond = EX ? !isMatch : isMatch
            if (cond) {
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

const defaultValue = '[^助准]教授'

const AdvancedSearch = ({ member, regexp }: { member: SignatoryList; regexp: string[] }): JSX.Element => {
  const initialValue = regexp.length ? regexp : [defaultValue]
  // 複数入力可能な可変長フォーム
  const [queries, setQueries] = useState<Array<string>>(initialValue)

  // 論理演算子 AND/OR のトグル
  const [AND, setAND] = useState(false) // true => AND 検索 / false => OR 検索
  const toggleOperator = (event: ChangeEvent<HTMLInputElement>) => {
    AND ? setAND(false) : setAND(true)
  }
  // 排他条件 EX のトグル
  const [EX, setEX] = useState(false) // true => 除外検索 / false => 包含検索
  const toggleEx = (event: ChangeEvent<HTMLInputElement>) => {
    EX ? setEX(false) : setEX(true)
  }
  // queries をもとに， useEffect 内で非同期に filterdList を更新
  const [filterdList, setFilterdList] = useState<SignatoryList>([])

  useEffect(() => {
    // 非同期関数を定義
    const fn = async () => setFilterdList(await getSignatories(member, queries, AND, EX))
    void fn()

    // queries をもとにしてクエリパラメータを書き換え
    const queriesString = JSON.stringify(queries.filter(Boolean))
    const { pathname } = window.location
    const params = new URLSearchParams(queries.filter(Boolean).map((q) => ['regexp', q]))
    const url = queriesString !== defaultValue ? `${pathname}?${params.toString()}` : pathname
    history.pushState({ query: queriesString }, document.title, url)
  }, [queries, AND, EX])

  return (
    <>
      <VariableForm state={queries} setState={setQueries} />
      <Stack
        direction={{ xs: 'column', md: 'row-reverse' }}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-end', md: 'flex-start' }}
        spacing={{ xs: 1, md: 2 }}
        mt={{ xs: 1, md: 3 }}
        ml={{ xs: 2, md: 3 }}
      >
        <ToggleButtons {...{ AND, EX, toggleOperator, toggleEx }} />
        <Box ml={0} mr='auto'>
          <SearchHeader queries={queries} op={AND} ex={EX} result={filterdList.length} all={member.length} />
        </Box>
      </Stack>
      <Box mt={{ xs: 2, md: 3 }} component='ul' className='signatories'>
        <VirtualizedList list={filterdList} />
      </Box>
      <Box mt={1} textAlign='center'>
        <ExportButtons list={filterdList} />
      </Box>
    </>
  )
}

export default AdvancedSearch
