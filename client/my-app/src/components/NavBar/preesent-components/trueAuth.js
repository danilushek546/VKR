import {Button, Nav} from "react-bootstrap";
import React, {useContext} from "react";
import {Context} from "../../../index";
import { useNavigate} from "react-router-dom";
import {adminRoute, ORDERS_ROUTE} from "../../../utils/consts";
import BasketNavBar from "../BasketNavBar";

const TrueAuth = () => {
    const {user, basket} = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        basket.resetBasket();
    }

    return (
        <Nav className="ml-auto" style={{color: "white"}}>
            <BasketNavBar/>
            {user?.isAuth && user?.user?.role === "ADMIN" && <Button
                style={{marginLeft: "7px", backgroundColor:'CornflowerBlue'}}
                className={"mr-3"}
                variant="info"
                onClick={() => {navigate(ORDERS_ROUTE)}}
            >
                Заказы
            </Button>} 

            {user?.isAuth && user?.user?.role === "ADMIN" &&<Button
                style={{marginLeft: "7px", backgroundColor:'CornflowerBlue'}}
                className={"mr-3"}
                variant="info"
                onClick={() => {navigate(adminRoute)}}
            >
                Админ панель
            </Button>}

            <Button
                style={{marginLeft: "7px", backgroundColor:'CornflowerBlue'}}
                variant="info"
                onClick={() => logOut()}
            >
                Выйти
            </Button>
        </Nav>
    );
};

export default TrueAuth;