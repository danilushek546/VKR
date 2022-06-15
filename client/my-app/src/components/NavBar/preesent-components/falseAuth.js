import React from "react";

import {Button, Nav} from "react-bootstrap";
import {loginRoute} from "../../../utils/consts";
import {NavLink} from "react-router-dom";
import BasketNavBar from "../BasketNavBar";

const FalseAuth = () => {
    return (
        <Nav className="ml-auto" style={{color: "white"}}>
            <BasketNavBar/>
            <NavLink to={loginRoute}>
                <Button style={{ backgroundColor:'CornflowerBlue'}} variant="info">Авторизация</Button>
            </NavLink>
        </Nav>
    );
};

export default FalseAuth;