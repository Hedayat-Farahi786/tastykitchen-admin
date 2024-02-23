import React, { useEffect, useState } from "react";
import { Table, Card, Col, Row, Input, Button, Space } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { ShowButton } from "@refinedev/antd";
import { Link } from "react-router-dom";
interface IUser {
  _id: string;
  name: string;
  phone: string;
  address: {
    street: string;
    postcode: string;
    floor: string;
  };
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://tastykitchen-backend.vercel.app/users?q=${searchTerm}`
        );
        const data: IUser[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const viewUserDetails = (userId: string) => {
    history.push(`/users/${userId}`);
    navigation.show("users", userId);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Card>
          <Table dataSource={users} rowKey="_id">
            <Table.Column title="Name" dataIndex="name" key="name" />
            <Table.Column title="Phone" dataIndex="phone" key="phone" />
            <Table.Column
              title="Address"
              key="address"
              render={(_, record: IUser) =>
                `${record.address.street}, ${record.address.postcode}`
              }
            />
            <Table.Column
              fixed="right"
              title="Actions"
              render={(_, record: IUser) => (
                <Space size="middle">
                  <Link to={`/users/show/${record._id}`}>
                    <Button icon={<EyeOutlined />} />
                  </Link>
                </Space>
              )}
            />
          </Table>
        </Card>
      </Col>
    </Row>
  );
};

export default UserList;
