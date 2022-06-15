import React, { useState} from 'react';
import {
    Button,
    Container,
    Pagination,
} from "react-bootstrap";

import CreateDevice from "../components/modals/CreateDevice";
import CreateBrand from "../components/modals/CreateBrand";
import CreateType from "../components/modals/CreateType";
import DeleteBrandOrType from "../components/modals/DeleteBrandOrType";

const Admin = () => {
    const [brandVisible, setBrandVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [deviceVisible, setDeviceVisible] = useState(false);
    const [deleteBrandOrType, setDeleteBrandOrType] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [count] = useState(1);

    const [successMsg, setSuccessMsg] = useState('');
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    //pagination
    const limit = 5;
    const pageCount = Math.ceil(Number(count) / limit);
    const pages = [];
    for (let number = 1; number < pageCount + 1; number++) {
        pages.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>
        );
    }


   
    const showSuccessMsgFunc = (msg) => {
        setSuccessMsg(msg);
        setShowSuccessMsg(true);
        setTimeout(() => setShowSuccessMsg(false), 5000);
    }

    return (
        <Container className="d-flex flex-column">
            {showSuccessMsg && <p>{successMsg}</p>}
            <Button
                onClick={() => setTypeVisible(true)}
                variant="outline-dark"
                className="mt-4 p-2"
            >
                Добавить тип
            </Button>
            <Button
                onClick={() => setBrandVisible(true)}
                variant="outline-dark"
                className="mt-4 p-2"
            >
                Добавить бренд
            </Button>
            <Button
                onClick={() => setDeviceVisible(true)}
                variant="outline-dark"
                className="mt-4 p-2"
            >
                Добавить Девайс
            </Button>
            <Button
                onClick={() => setDeleteBrandOrType(true)}
                variant="outline-dark"
                className="mt-4 p-2"
            >
                Удалить тип или бренд
            </Button>
            <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)}/>
            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
            <DeleteBrandOrType show={deleteBrandOrType} onHide={() => setDeleteBrandOrType(false)} showSuccessMsgFunc={showSuccessMsgFunc}/>

        </Container>
    );
};

export default Admin;