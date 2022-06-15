import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";


import {Context} from "../index";
import {Button, Col, Image, Row} from "react-bootstrap";
import BasketItem from "../components/BasketItem";

import {ORDERING_ROUTE} from "../utils/consts";
import {NavLink} from "react-router-dom";

const BasketCard = observer(() => {
    const {basket} = useContext(Context);

    if(basket.Basket.length === 0) {
        return (
            <div className="d-flex flex-column align-items-center mt-5">
                <div className="text-center mt-5" style={{fontSize: 28}}><b>Ваша корзина пока пуста</b></div>
            </div>
        )
    }

    return (
        <>
            <br/>
            <NavLink to={ORDERING_ROUTE}>
                <Button>Оформить заказ</Button>
            </NavLink>
            <Row className="mt-3">
                <Col xs={12}>
                    {basket.Basket.map(device => <BasketItem key={device.id} device={device}/>)}
                </Col>
            </Row>
        </>
    );
});

export default BasketCard;