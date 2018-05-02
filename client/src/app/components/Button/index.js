/*  BUTTON
*   Если кнопка находится в форме то она имеет несколько состояний: disabled || active || error
*   
*
*
*/

import React from 'react'
import styled from 'react-emotion'

const _button = styled('button')`
  display: flex;
  cursor: pointer;
  background-color: #33A3CD;

  padding: 9px 70px;
  border-radius: 2px;

  outline: none;
  border: 0 none;
  text-decoration: none;

  &:hover {
    background-color: #3DB0DB;
  }
`
const _content = styled('span')`
  color: white;
`

export const Button = ({text}) => {
    return (
      <_button type='submit'>
        <_content> { text } </_content>
      </ _button>
    )
}
