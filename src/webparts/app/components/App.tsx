import * as React from 'react';
import styles from './App.module.scss';
import { IAppProps } from './IAppProps';
import { escape } from '@microsoft/sp-lodash-subset';

import Form2 from './Form';

export default class App extends React.Component<IAppProps, {}> {
  public render(): React.ReactElement<IAppProps> {
    return (
      <Form2 context={this.props.context}/>
    );
  }
}
