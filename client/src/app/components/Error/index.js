/* Error
*
*
*/

import React from 'react'
import styled from 'react-emotion'

const Wrapper = styled("div")`
  color: #D9004C;
  text-align: center;
`
const Content = styled("p")`
  color: white;
  font-size: 1.2em;
`

const Error = (prop) => {
  <Wrapper>
    <Content>
      {prop.text}
    </Content>
  </Wrapper>
}

export default Error