import React, { useEffect } from 'react'

import { IconButton, TextField, Stack } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'

import { useForm, useFieldArray } from 'react-hook-form'

import type { Dispatch, SetStateAction } from 'react'

interface VariableFormProps {
  state: string[]
  setState: Dispatch<SetStateAction<string[]>>
}
type FormValues = {
  query: { regexp: string }[]
}

const VariableForm = ({ state, setState }: VariableFormProps): JSX.Element => {
  const defaultQueries = state.length ? state : ['']
  const { register, control, watch } = useForm<FormValues>({
    defaultValues: {
      query: defaultQueries.map((q) => {
        return { regexp: q }
      })
    }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'query' })
  const watchFieldArray = watch('query')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    }
  })

  // Debounced function
  useEffect(() => {
    // delay 後 debounce の対象 state をアップデート
    const timer = setTimeout(() => {
      const queries = controlledFields.map((form) => form.regexp)
      if (JSON.stringify(queries) !== JSON.stringify(state)) {
        setState(queries)
      }
    }, 1200)

    // 次の effect が実行される直前に timer キャンセル
    return () => clearTimeout(timer)
    // controlledFields がアップデートするたびに effect 実行
  }, [controlledFields])

  return (
    <>
      {controlledFields.map((field, index) => {
        return (
          <Stack key={field.id} direction='row' spacing={1} mb={1.67}>
            {/* 一番最初だけ AddIcon，あとは DeleteIcon */}
            {index ? (
              <IconButton aria-label='delete' onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            ) : (
              <IconButton aria-label='delete' onClick={() => append({ regexp: '' })}>
                <AddIcon />
              </IconButton>
            )}
            <TextField
              type='search'
              label='RegExp'
              placeholder='[^非]常勤, [^ァ-ンヴーｧ-ﾝﾞﾟ\-], ^(?!.*教授), etc...'
              // value={value}
              {...register(`query.${index}.regexp` as const)} // as value={value}
              color='primary'
              size='small'
              fullWidth
            />
          </Stack>
        )
      })}
    </>
  )
}

const VariableFormMemoised = React.memo((props: VariableFormProps): JSX.Element => <VariableForm {...props} />)

export default VariableFormMemoised
