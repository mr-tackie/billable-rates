import React from "react";
import { Typography, PageHeader, Skeleton, Table, Empty } from "antd";
import { Link } from "react-router-dom";
import Axios from "axios";
const { Text } = Typography;

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: []
        };
    }

    async componentDidMount() {
        this.setState({ loading: true });
        const result = await Axios.get("/api/timetables");
        this.setState({ loading: false, items: result.data });
    }

    _renderInvoicesList() {
        const {items} = this.state;

        if(items.length === 0){
            return <Empty/>
        }

        const columns = [
            {
                title: "ID",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "Name",
                dataIndex: "identifier",
                key: "identifier",
                render: (text, record) => <Link to={`invoices/${record.id}`}>{text}</Link>
            },
            {
                title: "Created At",
                dataIndex: "created_at",
                key: "created_at"
            }
        ];

        return <Table rowKey="id" dataSource={items} columns={columns} />;
    }

    render() {
        const { loading } = this.state;
        return (
            <div>
                <PageHeader title="Generated Invoice History" />
                <Skeleton active loading={loading}>
                    {this._renderInvoicesList()}
                </Skeleton>
            </div>
        );
    }
}

export default History;
