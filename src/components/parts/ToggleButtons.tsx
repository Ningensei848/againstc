import React from 'react'

import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material'

import type { ChangeEvent } from 'react'

interface ToggleButtonsProps {
  AND: boolean
  toggleOperator: (event: ChangeEvent<HTMLInputElement>) => void
  EX: boolean
  toggleEx: (event: ChangeEvent<HTMLInputElement>) => void
}

const ToggleButtons = ({ AND, EX, toggleOperator, toggleEx }: ToggleButtonsProps) => (
  <FormControl component='fieldset'>
    <FormLabel component='legend' sx={{ textAlign: 'center' }}>
      Search Options
    </FormLabel>
    <FormGroup aria-label='position' row>
      <FormControlLabel
        control={<Checkbox checked={AND} onChange={toggleOperator} inputProps={{ 'aria-label': 'LogicalOoperator' }} />}
        label='AND'
        labelPlacement='start'
      />
      <FormControlLabel
        control={<Checkbox checked={EX} onChange={toggleEx} inputProps={{ 'aria-label': 'ExclusiveCondition' }} />}
        label='Exclude'
        labelPlacement='start'
      />
    </FormGroup>
  </FormControl>
)

export default ToggleButtons
