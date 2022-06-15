import React, { useContext } from "react";
import {Routes, Route} from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { Context } from '../index';
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
    const {user} = useContext(Context);
    
    return (
        <Routes>
            {user.isAuth && authRoutes.map((item) =>
                <Route key={item?.path}  path={item?.path} element={item?.component} />
            )}
            
            {publicRoutes.map((item) =>
                <Route key={item?.path}  path={item?.path} element={item?.component} />
            )}        
        </Routes>
    );
});

export default AppRouter;
