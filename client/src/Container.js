import React, {useState} from "react";

//import 'antd/dist/antd.min.css';

//import 'antd/dist/antd.compact.min.css';
import 'antd/dist/antd.dark.min.css';

// We import bootstrap to make our application look better.
//import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import {NavLink} from "react-router-dom";

import {
    FundProjectionScreenOutlined, IdcardOutlined,
    ShoppingCartOutlined, ShoppingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu} from 'antd';
import App from "./App";

const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem(<NavLink to="./report">Reports</NavLink>, '1', <FundProjectionScreenOutlined/>),
    getItem(<NavLink to="/user">Employees</NavLink>, '2', <IdcardOutlined/>),
    getItem(<NavLink to="/member">Members</NavLink>, '3', <UserOutlined/>),
    getItem(<NavLink to="/product">Products</NavLink>, '4', <ShoppingOutlined/>),
    getItem(<NavLink to="/sale">Sales</NavLink>, '5', <ShoppingCartOutlined/>),
];


// Here, we display our Navbar
export default function Container() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout
            id={'layout'}
            style={{
                minHeight: '100vh',
            }}
            key={'layout'}
        >
            <Sider collapsible theme="dark" collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <NavLink className="navbar-brand" to={window.location.pathname.split("/")[1]}>
                    <div className="logo"
                         style={{
                             height: 50,
                             margin: 16,
                             backgroundImage: "url('https://media.discordapp.net/attachments/789431654208634895/1016591355524419634/gotogro.png')",
                             //backgroundColor: "#cccccc",
                             backgroundRepeat: "no-repeat",
                             backgroundSize: "contain",
                             backgroundPosition: "center"
                         }}
                    />
                    <h1 style={{textAlign: "center"}}>GoTo Grocery MRM</h1>
                </NavLink>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                        display: "flex"
                    }}
                >
                    <h1>Goto Grocery MRM</h1>
                    <NavLink
                        to="./user/login"
                        style={{
                            marginRight: "4.5%",
                            marginLeft: "auto"
                        }}
                    >
                        Login
                    </NavLink>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                    key={'content'}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                        key={'breadcrumb1'}
                    >
                        {window.location.pathname.split("/").map((e, i) => <Breadcrumb.Item
                            key={"breadcrumbItem" + i}>{e}</Breadcrumb.Item>)}
                    </Breadcrumb>
                    <div
                        id={'site-content'}
                        className="site-layout-background"
                        style={{
                            padding: 0, //24
                            minHeight: 360,
                        }}
                    >
                        <App/>
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Goto Grocery MRM ©2022 Created by Clean Up in Isle 5
                </Footer>
            </Layout>
        </Layout>
    );


}
// Under the NavLink element

/*
<button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
<div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/create">
                Create Record
              </NavLink>
            </li>
          </ul>
        </div> */
