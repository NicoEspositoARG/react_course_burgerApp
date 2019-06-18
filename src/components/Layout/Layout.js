import React from 'react';
import Aux from '../../hoc/Aux';

import clasess from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'

const layout = props => (
  <Aux>
    <Toolbar />
    <SideDrawer />
    <main className={clasess.Content}>{props.children}</main>
  </Aux>
);

export default layout;