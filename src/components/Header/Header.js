import React from 'react';
import { Segment, Menu } from 'semantic-ui-react';

class Header extends React.Component {
  render() {
    return (
      <Menu>
        <Menu.Item header>React Apollo Subscriptions</Menu.Item>
      </Menu>
    );
  }
}

export default Header;
