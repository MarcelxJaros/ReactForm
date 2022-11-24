declare interface IAppWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  RequiredField: string;
  BadForm: string;
  NoteAtLeast5: string;
  ChooseOne: string;
  Error: string;
  SHPSentOK: string;
  SHPSavedOK: string;
}

declare module 'AppWebPartStrings' {
  const strings: IAppWebPartStrings;
  export = strings;
}
