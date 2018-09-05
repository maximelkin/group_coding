import React from 'react';
import styled from 'react-emotion';

const Wrapper = styled('div')`
  position: fixed;
`;

const MenuItem = styled('div')``;

export default class Login extends React.Component {
  render() {
    return (
      <Wrapper>
        {/*logo or Avatar*/}
        <MenuItem>
          <p>Profile</p>
          <p>Projects</p>
        </MenuItem>
        {/*Exit and settings*/}
      </Wrapper>
    );
  }
}
