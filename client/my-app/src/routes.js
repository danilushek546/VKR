
import {adminRoute, basketRoute, deviceRoute, loginRoute, registrationRoute, shopRoute, ORDERING_ROUTE, ORDERS_ROUTE} from "./utils/consts";

import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import DevicePage from "./pages/DevicePage";
import BasketCard from "./pages/BasketCard";
import OneOrder from "./pages/OneOrder";
import Ordering from "./pages/Ordering";

export const authRoutes = [
    {
        path: adminRoute,
        component: <Admin />
    },
    {
        path: ORDERS_ROUTE,
        component: <Orders />
    },
    {
        path: ORDERS_ROUTE + '/:id',
        component: <OneOrder />
    },
]

export const publicRoutes = [
    {
        path: ORDERING_ROUTE,
        component: <Ordering />
    },
    {
        path: shopRoute,
        component: <Shop />
    },
    {
        path: loginRoute,
        component: <Auth />
    },
    {
        path: registrationRoute,
        component: <Auth />
    },
    {
        path: deviceRoute + '/:id',
        component: <DevicePage />
    },
    {
        path: basketRoute,
        component: <BasketCard />
    },
]