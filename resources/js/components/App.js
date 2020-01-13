import React from "react";
import "./App.css";
import { Layout, Menu, Icon } from "antd";
import UploadPage from "./upload/UploadPage";

import HistoryPage from "./history/History";
import NotFoundPage from "./notfound/NotFound";
import InvoicesPage from "./invoices/Invoices";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
const { Sider, Content, Footer } = Layout;

function App() {
    return (
        <Layout className="main-layout">
            <BrowserRouter>
                <Sider breakpoint="lg" collapsedWidth="0">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                    >
                        <Menu.Item key="1">
                            <Link to="/">
                                <Icon type="upload" />
                                <span className="nav-text">
                                    Upload Timesheet
                                </span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/history">
                                <Icon type="history" />
                                <span className="nav-text">
                                    Invoice History
                                </span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ margin: "24px 16px 0" }}>
                        <div
                            style={{
                                padding: 24,
                                background: "#fff",
                                minHeight: 360
                            }}
                        >
                            <Switch>
                                <Route exact path="/invoices/:id">
                                    <InvoicesPage />
                                </Route>
                                <Route exact path="/history">
                                    <HistoryPage />
                                </Route>
                                <Route exact path="/">
                                    <UploadPage />
                                </Route>
                                <Route component={NotFoundPage} />
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        Billable Hours &copy; 2020
                    </Footer>
                </Layout>
            </BrowserRouter>
        </Layout>
    );
}

export default App;
