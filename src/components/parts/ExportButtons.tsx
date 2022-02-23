import React, { useState } from 'react'
import { Button, ButtonGroup, IconButton, Snackbar, Tooltip } from '@mui/material'
import { ContentCopy as CopyIcon, Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material'
import BrowserOnly from '@docusaurus/BrowserOnly'

import type { Dispatch, SetStateAction, SyntheticEvent } from 'react'
import type { SignatoryList } from '@site/src/types'

// BOM 用のバイナリ配列を用意する
// cf. https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
const bom = new Uint8Array([0xef, 0xbb, 0xbf])

const copyTextToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Async: Copying to clipboard was successful!')
    return true
  } catch (err) {
    console.error('Async: Could not copy text: ', err)
    return false
  }
}

const SnackbarForCopy = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={handleClose}
      message='Copying to clipboard was successful ! 🥳'
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      action={
        <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
          <CloseIcon fontSize='small' />
        </IconButton>
      }
    />
  )
}

const ExportButtons = React.memo(({ list }: { list: SignatoryList }): JSX.Element => {
  // Export JSON, TSV and Raw text
  const jsonBlob = new Blob([bom, JSON.stringify({ member: list }, null, '  ')], { type: 'application/json' })
  const jsonSource = window ? window.URL.createObjectURL(jsonBlob) : '#'
  const tsvString = `name\taffiliation\n` + list.map((s) => `${s.name}\t${s.affiliation}`).join('\n')
  const tsvBlob = new Blob([bom, tsvString], { type: 'text/tab-separated-values' })
  const tsvSource = window ? window.URL.createObjectURL(tsvBlob) : '#'

  const [text, setText] = useState('Copy to Clipboard')
  const [open, setOpen] = useState(false)
  const handleCopyOnClick = async () => {
    const res = await copyTextToClipboard(tsvString)
    setTimeout(() => setText('Copy to Clipboard'), 2500) // テキスト表示をリセット
    setText(res ? 'Copied !😽' : 'Unexpected Error Occuered ...😿')
    setOpen(res)
  }

  return (
    <ButtonGroup variant='outlined' aria-label='outlined primary button group' size='small'>
      <Tooltip title='Save as JSON File' arrow>
        <Button href={jsonSource} download='open-letters-signatory.json' endIcon={<DownloadIcon />}>
          JSON
        </Button>
      </Tooltip>
      <Tooltip title='Save as TSV File' arrow>
        <Button href={tsvSource} download='open-letters-signatory.tsv' endIcon={<DownloadIcon />}>
          TSV
        </Button>
      </Tooltip>

      <Tooltip title={text} arrow>
        <Button component='a' onClick={handleCopyOnClick} endIcon={<CopyIcon />}>
          Copy
        </Button>
      </Tooltip>
      <SnackbarForCopy {...{ open, setOpen }} />
    </ButtonGroup>
  )
})

const ExportButtonsOnBrowser = ({ list }: { list: SignatoryList }): JSX.Element => (
  <BrowserOnly>{() => <ExportButtons list={list} />}</BrowserOnly>
)

export default ExportButtonsOnBrowser
