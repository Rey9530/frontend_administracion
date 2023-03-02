import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "MENUITEMS.ADMIN.TEXT",
    icon: "ri-dashboard-2-line",
    subItems: [
      {
        id: 3,
        label: "MENUITEMS.ADMIN.LIST.CATALOGOCONF",
        link: "home",
        parentId: 2,
      }
    ],
  },
  {
    id: 131,
    label: "MENUITEMS.WIDGETS.TEXT",
    icon: "ri-honour-line",
    link: "/widgets",
  },
];
