declare interface IQuickLinkFormWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'QuickLinkFormWebPartStrings' {
  const strings: IQuickLinkFormWebPartStrings;
  export = strings;
}
