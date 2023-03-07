import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "MENUITEMS.FACTURACION.TEXT",
    icon: "bx bx-money-withdraw",
    subItems: [
      {
        id: 3,
        label: "MENUITEMS.FACTURACION.LIST.CREAR",
        link: "/facturacion/crear",
        parentId: 2,
      }, {
        id: 4,
        label: "MENUITEMS.FACTURACION.LIST.VERLISTADO",
        link: "/facturacion/ver_listado",
        parentId: 2,
      }
    ],
  },
  {
    id: 5,
    label: "MENUITEMS.ADMIN.TEXT",
    icon: "bx bx-cog",
    subItems: [
      {
        id: 6,
        label: "MENUITEMS.ADMIN.LIST.CATALOGOCONF",
        link: "/admin/home",
        parentId: 5,
      },{
        id: 7,
        label: "MENUITEMS.ADMIN.LIST.FACTCONFIG",
        link: "/admin/facturacion_config",
        parentId: 5,
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
