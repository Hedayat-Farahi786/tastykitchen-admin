import { useEffect, useMemo, useState } from "react";
import {
  useTranslate,
  IResourceComponentsProps,
  useExport,
  useNavigation,
  HttpError,
  getDefaultFilter,
} from "@refinedev/core";

import {
  List,
  TextField,
  useTable,
  getDefaultSortOrder,
  DateField,
  NumberField,
  useSelect,
  ExportButton,
} from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Table, Button, Skeleton, Row, Col, Popover } from "antd";
import dayjs from "dayjs";

import { IOrder, IOrderFilterVariables } from "../../interfaces";
import { OrderActions } from "../../components";

export const OrderList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const { show } = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [productDetails, setProductDetails] = useState<any[]>([]);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      // Replace this with your actual backend API endpoint to fetch orders
      const response = await fetch("https://tastykitchen-backend.vercel.app/orders");
      const data: any = await response.json();
      setOrders(data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

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

  useMemo(() => {
    fetchOrders();
  }, []); // Fetch orders only once on component mount

  const { tableProps, sorter, searchFormProps, filters } = useTable<
    IOrder,
    HttpError,
    IOrderFilterVariables
  >({
    // Implement your table configuration as needed
  });

  const handleExport = () => {
    // Implement export functionality as needed
  };

  const renderTable = () => {
    if (loading) {
      return <Skeleton active />;
    }

    return (
      <Table
        {...tableProps}
        dataSource={orders}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            show("orders", record.id);
          },
        })}
      >
        <Table.Column
          key="id"
          dataIndex="id"
          title="#"
          render={(_, val, index) =>  index + 1}
        />
        <Table.Column
          key="orderNumber"
          dataIndex="orderNumber"
          title={t("orders.fields.orderNumber")}
          render={(value) => <TextField value={"#"+value} />}
        />
        <Table.Column
          key="status"
          dataIndex="status"
          title={t("orders.fields.status")}
          render={(value) => <TextField value={value ? value : "-"} />}
        />
        <Table.Column
                align="right"
                key="totalPrice"
                dataIndex="totalPrice"
                title={t("orders.fields.totalPrice")}
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
        <Table.Column
          key="payment"
          dataIndex="payment"
          title={t("orders.fields.payment")}
          render={(value) => <TextField value={value ? value : "-"} />}
        />
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
              title={t("orders.fields.createdAt")}
              render={(value) => <DateField value={value} format="YYYY.MM.DD" />}
              sorter
            />
            <Table.Column<IOrder>
              fixed="right"
              title={t("table.actions")}
              dataIndex="actions"
              key="actions"
              align="center"
              render={(_value, record) => <OrderActions record={record} />}
            />
        {/* Add more columns as needed based on your order data */}
      </Table>
    );
  };

  return (
    <Row gutter={[16, 16]}>
        {/* <Col xl={6} lg={24} xs={24}>
      </Col> */}
      <Col xl={24} xs={24}>
        <List
          headerProps={{
            extra: (
              <ExportButton onClick={handleExport} loading={false} />
            ), // Update loading status as needed
          }}
        >
          {renderTable()}
        </List>
      </Col>
    </Row>
  );
};
