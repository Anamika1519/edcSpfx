import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ReportNavigationWebPartStrings';
import ReportNavigation from './components/ReportNavigation';
import { IReportNavigationProps } from './components/IReportNavigationProps';
import { getSP } from './loc/pnpjsConfig';

export interface IReportNavigationWebPartProps {
  description: string;
}

export default class ReportNavigationWebPart extends BaseClientSideWebPart<IReportNavigationWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IReportNavigationProps> = React.createElement(
      ReportNavigation,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    // Classic page detection and initialization
  // if (typeof this.context.sdks?.spPageContext?.legacyPageContext?.isModernExperience === 'boolean') {
  //   if (!this.context.sdks.spPageContext.legacyPageContext.isModernExperience) {
  //     // Load classic page requirements
  //     return this.loadClassicDependencies();
  //   }
  // }
// const legacyContext = (this.context as any).pageContext.legacyPageContext;
// if (legacyContext?.isModernExperience) {this.initializeForModern();} else {this.initializeForClassic();}
//   return Promise.resolve();
    // Classic page detection and initializationif (typeof this.context.sdks?.spPageContext?.legacyPageContext?.isModernExperience === 'boolean') {if (!this.context.sdks.spPageContext.legacyPageContext.isModernExperience) {// Load classic page requirementsreturn this.loadClassicDependencies();}}return Promise.resolve();
    // if (this.context.sdks === 'SharePointFullPage') {// Classic page specific initializationthis.initializeForClassic();} else {// Modern page initializationthis.initializeForModern();}return Promise.resolve();
      this._environmentMessage = this._getEnvironmentMessage();
  
      await super.onInit();
      getSP(this.context);
    }

  //   private initializeForModern(): void {
  //     // Modern page specific initialization
  //     console.log("Initializing for modern page experience");
  //     // Modern pages don't need special JS files, just proceed with normal initialization
  //     this._environmentMessage = this._getEnvironmentMessage();
  //     getSP(this.context); // Initialize PnPjs
  //     // Modern pages can use React without special handling
  //     this.renderWebPart();
  //   }
  // renderWebPart() {
  //   throw new Error('Method not implemented.');
  // }
     
     
    // private initializeForClassic(): void {
    //   console.log("Initializing for classic page experience");
    //   // Classic pages need special handling
    //   this.loadClassicDependencies().then(() => {
    //     this._environmentMessage = this._getEnvironmentMessage();
    //     getSP(this.context); // Initialize PnPjs
    //     // Classic pages might need DOM ready check
    //     if (document.readyState === 'complete' || document.readyState === 'interactive') {
    //       this.renderWebPart();
    //     } else {
    //       document.addEventListener('DOMContentLoaded', () => this.renderWebPart());
    //     }
    //   });
    // }
  // loadClassicDependencies(): Promise<void> {
  //   return new Promise((resolve) => {
  //     // Simulate loading dependencies
  //     console.log("Loading classic dependencies...");
  //     setTimeout(() => {
  //       console.log("Classic dependencies loaded.");
  //       resolve();
  //     }, 1000); // Simulated delay
  //   });
  // }


    private _getEnvironmentMessage(): string {
      if (!!this.context.sdks.microsoftTeams) { // running in Teams
        return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
      }
  
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
    }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
