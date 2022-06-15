import React, {useContext, useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {Context} from "../index";
import {sendOrder} from "../http/ordersAPI";
import {useNavigate} from "react-router-dom";
import {shopRoute} from "../utils/consts";

const Ordering = () => {
    const {basket, user} = useContext(Context);
    const [phone, setPhone] = useState(null);
    const navigate = useNavigate();

    const buy = () => {
        let order = {
            mobile: phone,
            basket: basket.Basket
        }

        if(user.isAuth) {
            order.auth = true;
        }

        sendOrder(order).then(data => {
            basket.setDeleteAllDeviceFromBasket();
            navigate(shopRoute);
        });
    }
    return (
        <>
            <Form>
                <Form.Control
                    placeholder="Введите свой телефон..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{width: "230px", marginLeft: "42%", marginTop: "10%"}}
                />
            </Form>
            <Row className="mt-3">
                <Col xs={12}>
                    <Button 
                    style={{ marginLeft: "45%"}}
                    variant="success" onClick={buy}>Оформить заказ</Button>
                </Col>
            </Row>
        </>
    );
};

export default Ordering;