import React from 'react';
import {Card, Col} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from '../assets/star.jpg'
import {useNavigate } from 'react-router-dom'
import {deviceRoute} from "../utils/consts";

const DeviceItem = ({device}) => {
    const navigate = useNavigate();

    return (
        <Col md={3} className={"mt-3"} onClick={() => navigate(deviceRoute + '/' + device.id)}>
            <Card style={{width: 170, cursor: 'pointer', padding: "10px"}} border={"light"}>
                <Image  style={{objectFit:"contain"}} width={150} height={150} src={process.env.REACT_APP_API_URL + device.image}/>
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center p-20">
                    <div className="d-flex align-items-center">
                        <div>{device.rating}</div>
                        <Image width={18} height={18} src={star}/>
                    </div>
                </div>
                <div>{device.name}</div>
            </Card>
        </Col>
    );
};

export default DeviceItem;