import React from 'react';
import { Icon, Row, Col, Card, Typography } from 'antd';
import './invoice-card.css';

const InvoiceCard = ({item}) => {
    return <Row className="invoice-item">
        <Col span={24}>
            <Card className="invoice-card">
                <Typography.Text className="invoice-title">Invoice for {item.name}</Typography.Text>
                <Icon type="file-pdf" style={{fontSize:56}}/>
            </Card>
        </Col>
        <div className="overlay">
            <Icon type="search" style={{fontSize: 48, color: "white", display: "block"}}/>
            <Typography.Paragraph style={{fontSize: "16px", color:"white", fontWeight: "bold", textAlign: "center"}}>Preview</Typography.Paragraph>
        </div>
    </Row>
}

export default InvoiceCard;