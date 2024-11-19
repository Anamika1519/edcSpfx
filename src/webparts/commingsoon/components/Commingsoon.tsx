import * as React from 'react';
import styles from './Commingsoon.module.scss';
import type { ICommingsoonProps } from './ICommingsoonProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Commingsoon extends React.Component<ICommingsoonProps> {
  public render(): React.ReactElement<ICommingsoonProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.commingsoon} ${hasTeamsContext ? styles.teams : ''}`}>
      
        <div>
          <h3>Comming soon..</h3>
         
        
        </div>
      </section>
    );
  }
}
