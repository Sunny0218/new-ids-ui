import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  imports:[TranslateModule.forChild({
    extend:true
})],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TranslateModule
   ],
  providers: [ MenuItems ]
})
export class SharedModule { }
