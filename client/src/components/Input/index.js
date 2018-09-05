/*  INPUT
*   Должен проходить валидацию иначе при анфокусе красный
*   Иконка с ошибкой и вывод сообщения
*   
*/

import React from 'react';
import styled from 'react-emotion';

const Wrapper = styled('div')``;
const _input = styled('input')`
  border: none;
  outline: none;
  border-bottom: 2px solid black;
`;
const _focusLine = styled('span')`
  display: block;
  background-color: red;
  width: 50px;
  height: 2px;
`;

export const Input = ({ placeholder }) => {
  return (
    <Wrapper>
      <_input type="text" placeholder={placeholder} />
      <_focusLine />
    </Wrapper>
  );
};
