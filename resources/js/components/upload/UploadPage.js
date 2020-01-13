import React from "react";
import {
    PageHeader,
    Row,
    Col,
    Upload,
    Icon,
    Button,
    Spin,
    message
} from "antd";
import { withRouter } from "react-router-dom";
import Axios from "axios";
const { Dragger } = Upload;

const UploadPage = ({ history }) => {
    const [fileList, setFileList] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);

    const draggerProps = {
        accept: ".csv,text/csv",
        onRemove: file => {
            setFileList([]);
        },
        beforeUpload: file => {
            setFileList([file]);
            return false;
        },
        fileList
    };

    const _onHandleUpload = async () => {
        if (fileList.length > 0) {
            setUploading(true);

            try {
                const formData = new FormData();
                formData.append("file", fileList[0]);

                const response = await Axios.post("/api/timetables", formData);
                const { data } = response;

                setUploading(false);
                
                if(!data.error){
                    setFileList([]);
                    history.push(`/invoices/${data.data.id}`);
                }else{
                    _showErrorDialog(data.message);
                }
            } catch (err) {
                if (err.response) {
                    switch (response.status) {
                        case 500:
                            _showErrorDialog(response.statusText);
                            break;
                        case 422:
                            _showErrorDialog("Provide a valid CSV file");
                            break;
                        default:
                            _showErrorDialog("Could not handle this request");
                            break;
                    }
                } else {
                    _showErrorDialog(
                        "There was an error processing your request. Try again"
                    );
                    console.log(error);
                }
                setUploading(false);
            }
        }
    };

    function _showErrorDialog(text) {
        message.error(text);
    }

    return (
        <div>
            <PageHeader
                title="Upload Timesheet"
                extra={
                    fileList.length > 0
                        ? [
                              <Button
                                  key="upload-btn"
                                  type="primary"
                                  onClick={_onHandleUpload}
                                  disabled={uploading}
                              >
                                  Generate Invoices
                              </Button>
                          ]
                        : []
                }
            />
            <Row>
                <Col>
                    <Spin
                        tip="Please wait..."
                        indicator={
                            <Icon
                                type="loading"
                                style={{ fontSize: 36 }}
                                spin
                            ></Icon>
                        }
                        spinning={uploading}
                    >
                        <Dragger {...draggerProps}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="file-text" />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Make sure the file that you upload is a valid
                                CSV file with a <b>.csv </b>
                                extension. Be sure that the file matches the
                                correct timesheet format.
                            </p>
                        </Dragger>
                    </Spin>
                </Col>
            </Row>
        </div>
    );
};

export default withRouter(UploadPage);
