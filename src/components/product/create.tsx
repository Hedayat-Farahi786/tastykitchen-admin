import React, { useEffect, useState } from 'react';
import { useTranslate, useApiUrl } from '@refinedev/core';
import { Drawer, DrawerProps, Form, FormProps, Input, InputNumber, Select, Space, Button, Typography, Grid, Switch, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

import { ICategory } from '../../interfaces';

const { Text } = Typography;

type CreateProductProps = {
    drawerProps: DrawerProps;
};

const OptionComponent = ({ form }) => {
    return (
        <Form.List name="options">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, 'size']}
                                rules={[{ required: true, message: 'Missing size' }]}
                            >
                                <Input placeholder="Size" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'price']}
                                rules={[{ required: true, message: 'Missing price' }]}
                            >
                                <InputNumber placeholder="Price" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Option
                    </Button>
                </>
            )}
        </Form.List>
    );
};

export const CreateProduct: React.FC<CreateProductProps> = ({ drawerProps }) => {
    const t = useTranslate();
    const apiUrl = "https://tastykitchen-backend.vercel.app";
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get(`${apiUrl}/categories`);
            setCategories(response.data);
        };
        fetchCategories();
    }, [apiUrl]);

    const onCreateProduct = async (values) => {
        try {
            await axios.post(`${apiUrl}/products`, {
                ...values,
                menuId: values.menuId, // Ensure this matches your API's expected payload
            });
            message.success('Product created successfully');
            form.resetFields();
            // drawerProps.onClose(); // Close the drawer
        } catch (error) {
            console.error('Failed to create product:', error);
            message.error('Failed to create product');
        }
    };

    return (
        <Drawer {...drawerProps} title="Create Product" width={Grid.useBreakpoint().sm ? '500px' : '100%'} zIndex={1001}>
            <Form form={form} layout="vertical" onFinish={onCreateProduct} initialValues={{ isActive: true }}>
                <Form.Item label={t('products.fields.name')} name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={t('products.fields.description')} name="description" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label={t('products.fields.image')} name="image" rules={[{ required: true }]}>
                    <Input placeholder="Image URL" />
                </Form.Item>
                <Form.Item label={t('products.fields.optionsTitle')} name="optionsTitle" rules={[{ required: true }]}>
                    <Input placeholder="Options Title" />
                </Form.Item>
                
                <OptionComponent form={form} />
                <Form.Item label={t('products.fields.category')} name="menuId" rules={[{ required: true }]}>
                    <Select placeholder="Select category">
                        {categories.map(category => (
                            <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label={t('products.fields.topProduct')} name="topProduct" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Product
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};
