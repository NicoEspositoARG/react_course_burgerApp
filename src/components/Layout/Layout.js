import React from 'react';
import Aux from '../../hoc/Aux';

import clasess from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'

const layout = props => (
  <Aux>
    <Toolbar/>
    <main className={clasess.Content}>{props.children}</main>
  </Aux>
);

export default layout;