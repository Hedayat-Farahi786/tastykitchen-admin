import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IUser, IOrder } from "../../interfaces";
import {
  Typography,
  Avatar,
  Row,
  Col,
  Card,
  Space,
  Table,
  List,
  Popover,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { OrderStatus } from "../../components";
import { TextField, NumberField, DateField } from "@refinedev/antd";
import avatar from "../../../public/images/avatar.svg";

const UserShow: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<any>([]);
  const [addresses, setAddresses] = useState<any>([]);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const { id } = useParams();

  const userId = id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://tastykitchen-backend.vercel.app/users/${userId}`
        );
        const userData: IUser = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const response = await fetch(
          `https://tastykitchen-backend.vercel.app/users/${userId}/orders`
        );
        const orderData: any = await response.json();
        setOrders(orderData);
      } catch (error) {
        console.error("Failed to fetch user orders:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
      fetchUserOrders();
    }
  }, [userId]);

  useEffect(() => {
    if (orders.length > 0) {
      const uniqueAddresses = new Set();
      for (let i = 0; i < orders.length; i++) {
        uniqueAddresses.add(JSON.stringify(orders[i].delivery));
      }
      const uniqueAddressesArray = Array.from(uniqueAddresses).map(JSON.parse);
      setAddresses(uniqueAddressesArray);
    }
  }, [orders]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetailsPromises = orders.flatMap((order) =>
          order.products.map(async (product) => {
            const response = await fetch(
              `https://tastykitchen-backend.vercel.app/products/${product.productId}`
            );
            return await response.json();
          })
        );
        const productDetails = await Promise.all(productDetailsPromises);
        setProductDetails(productDetails);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    if (orders.length > 0) {
      fetchProductDetails();
    }
  }, [orders]);

  if (!user) {
    return <Typography.Text>Loading...</Typography.Text>;
  }

  return (
    <>
      <Row gutter={[16, 16]} style={{}}>
        <Col xl={6} lg={24} xs={24}>
          <Card bordered={false}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space
                direction="vertical"
                style={{ textAlign: "center", width: "100%" }}
              >
                <Avatar size={120} src={avatar}></Avatar>
                <Typography.Title level={3}>{user?.name}</Typography.Title>
              </Space>
              <Space
                direction="vertical"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Typography.Text>
                  <PhoneOutlined /> {user?.phone}
                </Typography.Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xl={18} xs={24}>
          <List title="Orders">
            <Table rowKey="id" dataSource={orders}>
              <Table.Column
                key="orderNumber"
                dataIndex="orderNumber"
                title="Order Number"
                render={(value) => <TextField value={"#"+value} />}
              />
              <Table.Column
                key="status"
                dataIndex="status"
                title="Status"
                render={(value) => <TextField value={value ? value : "-"} />}
              />
              <Table.Column
                align="right"
                key="totalPrice"
                dataIndex="totalPrice"
                title="Amount"
                render={(value) => (
                  <NumberField
                    options={{
                      currency: "EUR",
                      style: "currency",
                    }}
                    value={value}
                  />
                )}
              />
              <Table.Column key="payment" dataIndex="payment" title="Payment" />
              <Table.Column
                key="products"
                dataIndex="products"
                title="Products"
                render={(_, record) => {
                  const productsWithDetails = record.products.map(
                    (product, index) => ({
                      ...product,
                      ...productDetails[index],
                    })
                  );
                  return (
                    <Popover
                      content={
                        <ul>
                          {productsWithDetails.map((product) => (
                            <li key={product.id}>
                              {product.name} - {product.quantity}x{" "}
                              <strong style={{ marginLeft: "10px" }}>
                                {product.price.toFixed(2)} €
                              </strong>
                            </li>
                          ))}
                        </ul>
                      }
                      title="Products"
                      trigger="hover"
                    >
                      {`${record.products.length}`}
                    </Popover>
                  );
                }}
              />
              <Table.Column
                key="createdAt"
                dataIndex="createdAt"
                title="Created At"
                render={(value) => (
                  <DateField value={value} format="YYYY.MM.DD" />
                )}
              />
            </Table>
          </List>
          <List title="Addresses">
            <Table pagination={false} dataSource={addresses}>
              <Table.Column
                title="Address"
                render={(value) => (
                  <TextField
                    value={value.street + ", " + value.postcode + " München"}
                  />
                )}
              />
            </Table>
          </List>
        </Col>
      </Row>
    </>
  );
};

export default UserShow;
