import React, { useEffect, useState } from 'react';
import { useNavigation, useTranslate } from "@refinedev/core";
import { Typography, Table, Space } from "antd";
import { OrderActions } from "../../../components";

const { Text } = Typography;

export const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const t = useTranslate();
  const { show } = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://tastykitchen-backend.vercel.app/orders');
        const data = await response.json();
        setOrders(data.reverse());
        fetchProductDetails(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchProductDetails = async (orders) => {
    try {
      const productDetailsPromises = orders.flatMap((order) =>
        order.products.map(async (product) => {
          const response = await fetch(
            `https://tastykitchen-backend.vercel.app/products/${product.productId}`
          );
          return await response.json();
        })
      );
      const details = await Promise.all(productDetailsPromises);
      setProductDetails(details);
      console.log(details);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  return (
    <Table
      dataSource={orders}
      pagination={{ simple: true }}
      showHeader={false}
      rowKey="_id"
      loading={loading}
    >
      <Table.Column
        title="Order Number"
        dataIndex="orderNumber"
        key="orderNumber"
        render={orderNumber => <Text strong>{orderNumber ? "#" + orderNumber : "-"}</Text>}
      />
      <Table.Column
        title="Products"
        key="products"
        render={(_, record) => (
          <Space direction="vertical">
            {record.products.map((product, index) => (
              <Space key={index} direction="horizontal">
                <Text>{productDetails[index]?.name || 'Products loading...'}</Text>
                <Text>x{product.quantity}</Text>
                <Text>€{product.price.toFixed(2)}</Text>
              </Space>
            ))}
          </Space>
        )}
      />
      <Table.Column
        title="Total Price"
        dataIndex="totalPrice"
        key="totalPrice"
        render={totalPrice => <Text strong>{totalPrice}€</Text>}
      />
        <Table.Column
        title="Delivery"
        dataIndex="delivery"
        key="delivery"
        render={delivery => (
          <Space direction="vertical">
            <Text>{delivery.street},</Text>
            <Text>{delivery.postcode} München</Text>
          </Space>
        )}
      />
      <Table.Column
        title="Status"
        dataIndex="status"
        key="status"
        render={status => <Text>{status ? status.toUpperCase() : "-"}</Text>}
      />
      <Table.Column
        title="Action"
        key="action"
        align="center"
        render={(_, record) => (
          <Space size="middle">
            <OrderActions record={record} />
          </Space>
        )}
      />
    </Table>
  );
};
