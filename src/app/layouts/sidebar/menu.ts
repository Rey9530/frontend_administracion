import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  
  {
    id: 2,
    label: "MENUITEMS.CLIENTE.TEXT",
    icon: "ri-shield-user-fill",
    link: "/facturacion/clientes",
  },
  {
    id: 3,
    label: "MENUITEMS.FACTURACION.TEXT",
    icon: "bx bx-money-withdraw",
    subItems: [
      {
        id: 31,
        label: "MENUITEMS.FACTURACION.LIST.CREAR",
        link: "/facturacion/crear",
        parentId: 2,
      },
      {
        id: 32,
        label: "MENUITEMS.FACTURACION.LIST.VERLISTADO",
        link: "/facturacion/ver_listado",
        parentId: 2,
      },
    ],
  },
  {
    id: 4,
    label: "MENUITEMS.ADMIN.TEXT",
    icon: "bx bx-cog",
    subItems: [
      {
        id: 41,
        label: "MENUITEMS.ADMIN.LIST.CATALOGOCONF",
        link: "/admin/home",
        parentId: 4,
      },
      {
        id: 42,
        label: "MENUITEMS.ADMIN.LIST.FACTCONFIG",
        link: "/admin/facturacion_config",
        parentId: 4,
      },
    ],
  },
  {
    id: 131,
    label: "MENUITEMS.WIDGETS.TEXT",
    icon: "ri-honour-line",
    link: "/widgets",
  },
];
