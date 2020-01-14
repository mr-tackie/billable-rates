import React from "react";
import { withRouter } from "react-router-dom";
import {
    PageHeader,
    Spin,
    Icon,
    Button,
    Row,
    Col,
    Typography,
    Modal
} from "antd";
import InvoiceCard from "./../invoice-card/InvoiceCard";
import Axios from "axios";
import "./invoices.css";
const { Text } = Typography;

class Invoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: [],
            title: "",
            showModal: false,
            selectedItem: null
        };

        this.handleCancel = () => {
            this.setState({ showModal: false, selectedItem: null });
        };
    }

    async componentDidMount() {
        const { match } = this.props;
        const id = match.params.id;
        this.setState({ loading: true });
        const result = await Axios.get(`/api/timetables/${id}`);

        if (!result.data.error) {
            this.setState({
                loading: false,
                items: result.data.data.invoices,
                title: result.data.data.identifier
            });
        } else {
            this.setState({ loading: false });
        }
    }

    _showInvoiceModal(item) {
        this.setState({ showModal: true, selectedItem: item });
    }

    _renderInvoiceCard() {
        let invoice_cards = [];
        for (const item of this.state.items) {
            invoice_cards.push(
                <Col
                    key={item.id}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    onClick={() => this._showInvoiceModal(item)}
                >
                    <InvoiceCard item={item} />
                </Col>
            );
        }

        return invoice_cards;
    }

    _renderInvoiceTable() {
        const { selectedItem } = this.state;

        if (selectedItem) {
            const rows = [];
            let total = 0;
            for (const item of selectedItem.data) {
                rows.push(
                    <tr key={`${item.employee_id}_${item.name}`}>
                        <td>{item.employee_id}</td>
                        <td>{item.no_of_hours}</td>
                        <td>{item.unit_price}</td>
                        <td className="text-right">{item.cost}</td>
                    </tr>
                );
                total += item.cost;
            }
            return (
                <div className="printable">
                    <p>
                        Company Name: <b>{selectedItem.name}</b>
                    </p>
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Number of hours</th>
                                <th>Unit Price</th>
                                <th className="text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>
                                    <b>Total</b>
                                </td>
                                <td className="text-right">{total}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        }
    }

    render() {
        const { loading, title, showModal, selectedItem } = this.state;
        return (
            <div>
                <PageHeader
                    style={{
                        border: "1px solid rgb(235, 237, 240)"
                    }}
                    onBack={() => null}
                    title="Invoices"
                />
                <Spin
                    tip="Please wait..."
                    indicator={
                        <Icon
                            type="loading"
                            style={{ fontSize: 24 }}
                            spin
                        ></Icon>
                    }
                    spinning={loading}
                >
                    <Text type="secondary" className="semi-title">
                        The following invoices were generated for {title}
                    </Text>
                    <Row gutter={16}>{this._renderInvoiceCard()}</Row>
                </Spin>
                <Modal
                    visible={showModal}
                    title={
                        selectedItem ? `Invoice for ${selectedItem.name}` : ""
                    }
                    onCancel={this.handleCancel}
                    width={720}
                    footer={[
                        <Button key="print-pdf" onClick = {() => window.print()}>Print</Button>
                    ]}
                >
                    {selectedItem ? this._renderInvoiceTable() : null}
                </Modal>
            </div>
        );
    }
}

export default withRouter(Invoices);
