import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Modal} from "react-bootstrap";
import {deleteBrand, deleteType, fetchBrands, fetchTypes} from "../../http/deviceAPI";

const DeleteBrandOrType = ({show, onHide, showSuccessMsgFunc}) => {
    const [brandOrType, setBrandOrType] = useState("Бренд");
    const [brands, setBrands] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectBrand, setSelectBrand] = useState({name: "Бренд не выбран"});
    const [selectType, setSelectType] = useState({name: "Тип не выбран"});
    const [showMsgErr, setShowMsgErr] = useState(false);
    const [msgErr, setMsgErr] = useState('');

    useEffect(() => {
        fetchTypes().then(data => setTypes(data));
        fetchBrands().then(data => setBrands(data));
    }, []);

    const Delete = async () => {
        if(brandOrType === "Бренд") {
            if(selectBrand.name !== "Бренд не выбран") {
                await deleteBrand(selectBrand.id).then(data => {
                    showSuccessMsgFunc(data);
                    onHide();
                    setSelectBrand({name: "Бренд не выбран"});
                });
            } else {
                setMsgErr("Пожалуйста выберете бренд");
                setShowMsgErr(true);
            }
        } else {
            if(selectType.name !== "Тип не выбран") {
                await deleteType(selectType.id).then(data => {
                    showSuccessMsgFunc(data);
                    onHide();
                    setSelectType({name: "Тип не выбран"});
                });
            } else {
                setMsgErr("Пожалуйста выберете тип");
                setShowMsgErr(true);
            }
        }
    };

    useEffect(() => setShowMsgErr(false), [selectType, selectBrand, brandOrType])

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Удалить тип или бренд
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showMsgErr &&
                    <>
                        <p style={{color: "red", textAlign: "center"}}>{msgErr}</p>
                    </>
                }

                Выберете категорию:
                <Dropdown className="mb-3" style={{margin: "0 auto"}}>
                    <Dropdown.Toggle  id="dropdown-basic-button">
                        {brandOrType}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {brandOrType === "Бренд" ? <Dropdown.Item disabled>Бренд</Dropdown.Item> : <Dropdown.Item onClick={() => setBrandOrType("Бренд")}>Бренд</Dropdown.Item>}
                        {brandOrType === "Тип" ? <Dropdown.Item disabled>Тип</Dropdown.Item> : <Dropdown.Item onClick={() => setBrandOrType("Тип")}>Тип</Dropdown.Item>}
                    </Dropdown.Menu>
                </Dropdown>

                Выберанная категория {brandOrType === "Бренд" ? "Бренд" : "Тип"}
                <Dropdown className="mb-3" style={{margin: "0 auto"}}>
                    <Dropdown.Toggle id="dropdown-basic-button">
                        {brandOrType === "Бренд" ? selectBrand.name : selectType.name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {brandOrType === "Бренд" ?
                            brands.map(({id, name}) =>
                                selectBrand.name === name ? <Dropdown.Item disabled key={id}>{name}</Dropdown.Item> : <Dropdown.Item  key={id} onClick={() => setSelectBrand({id, name})}>{name}</Dropdown.Item>
                            )
                            :
                            types.map(({id, name}) =>
                                selectType.name === name ? <Dropdown.Item disabled  key={id}>{name}</Dropdown.Item> : <Dropdown.Item  key={id} onClick={() => setSelectType({id, name})}>{name}</Dropdown.Item>
                            )
                        }

                    </Dropdown.Menu>
                </Dropdown>


            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={Delete}>Удалить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteBrandOrType;