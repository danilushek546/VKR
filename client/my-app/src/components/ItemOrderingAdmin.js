import React, {useState} from 'react';
import {Button, Col, ListGroup, Modal, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {fetchChangeStatusOrder, fetchDeleteOrder} from "../http/ordersAPI";
import {ORDERS_ROUTE} from "../utils/consts";

const ItemOrderingAdmin = ({id, complete, mobile, createdAt, updatedAt, userId, reRender}) => {
    const [modalDelete, setShowDelete] = useState(false);
    const [modalStatus, setShowStatus] = useState(false);

    //modal delete
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    const deleteOrder = () => {
        fetchDeleteOrder({id}).then(() => {
            setShowStatus(false);
            setTimeout(() => reRender(), 250);
        })
    }

    //modal status
    const handleCloseStatus = () => setShowStatus(false);
    const handleShowStatus = () => setShowStatus(true);
    const changeStatusOrder = () => {
        fetchChangeStatusOrder({complete: !complete, id}).then(() => {
            setShowStatus(false);
            setTimeout(() => reRender(), 250);
        })
    }

    //Format date (createdAt)
    const formatDate = (propsDate) => {
        const date = new Date(Date.parse(propsDate));
        const options = {
            weekday: "short",
            hour: 'numeric',
            minute: 'numeric',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC'
        };
        return date.toLocaleString("en-US", options);
    }

    return (
        <>
            <ListGroup.Item className="mt-3" key={id}>
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col xs={12}>
                                <NavLink to={ORDERS_ROUTE + `/${id}`}>id: {id}</NavLink>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                Телефон: <a href={`tel:${mobile}`}>{mobile}</a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                Заказ создан: {formatDate(createdAt)}
                            </Col>
                        </Row>
                        {complete ? <Row>
                            <Col xs={12}>
                                Заказ завершен: {formatDate(updatedAt)}
                            </Col>
                        </Row> : false}
                        <Row>
                            <Col xs={12}>
                                {userId ? "Buyer: Registered" : "Buyer: Not registered"}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                Статус: {complete ? "Завершен" : "В ожидании"}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <Row style={{height: "100%"}} className="d-flex align-items-center">
                            <Col xs={6} className="d-flex justify-content-center">
                                {complete ?
                                    <Button variant="success" onClick={handleShowStatus}>Пометить не завершенным</Button>
                                    :
                                    <Button variant="warning" onClick={handleShowStatus}>Закрыть заказ</Button>}
                            </Col>
                            <Col xs={6} className="d-flex justify-content-center">
                                <Button variant="danger" onClick={handleShowDelete}>Удалить</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ListGroup.Item>

            {/*modal confirm change status*/}
            <Modal show={modalStatus} onHide={handleCloseStatus}>
                <Modal.Header closeButton>
                    <Modal.Title>Пожалуйста подтвердите</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы хотите изменить статус(id: {id}), с {complete ? '\'Завершен\'' : '\'В ожидании\''} на {complete ? '\'В ожидании\'' : '\'Завершен\''}?
                    <br/><br/>
                    Информация:
                    <ul>
                        <li>Мобильный: {mobile}</li>
                        <li>Заказ создан в: {formatDate(createdAt)}</li>
                        {complete ? `Заказ завершен: ${formatDate(updatedAt)}` : false}
                        <li>Статус: {complete ? 'Завершен' : `В ожидании`}</li>
                        <li>{userId ? 'Покупатель зарегистрирован' : `Покупатель не зарегистрирован`}</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseStatus}>
                        Отменить
                    </Button>
                    <Button variant="primary" onClick={changeStatusOrder}>
                        Подтвердить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*modal confirm delete order*/}
            <Modal show={modalDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Пожалуйста подтвердите</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы хотите удалить заказ?(id: {id})?
                    <br/><br/>
                    Информация:
                    <ul>
                        <li>Мобильный: {mobile}</li>
                        <li>Заказ создан в: {formatDate(createdAt)}</li>
                        {complete ? `Заказ завершен: ${formatDate(updatedAt)}` : false}
                        <li>Статус: {complete ? 'Завершен' : `В ожидании`}</li>
                        <li>{userId ? 'Покупатель зарегистрирован' : `Покупатель не зарегистрирован`}</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={deleteOrder}>
                        Подтвердить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

export default ItemOrderingAdmin;