import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'WarHomeTilesWebPartStrings';
import WarHomeTiles from './components/WarHomeTiles';
import { IWarHomeTilesProps } from './components/IWarHomeTilesProps';

export interface IWarHomeTilesWebPartProps {
  description: string;
  listname:string;
}

export default class WarHomeTilesWebPart extends BaseClientSideWebPart<IWarHomeTilesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IWarHomeTilesProps> = React.createElement(
      WarHomeTiles,
      {
        description: this.properties.description,
        listname: this.properties.listname,
        siteurl:this.context.pageContext.web.absoluteUrl
      
      }
    );

    ReactDom.render(element, this.domElement);
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
                PropertyPaneTextField('listname', {
                  label: strings.ListNameLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
