import React, { useEffect, useState } from 'react';
import { useTranslate, useApiUrl } from '@refinedev/core';
import { Drawer, DrawerProps, Form, FormProps, Input, InputNumber, Radio, Select, Space, ButtonProps, Avatar, Typography, Grid, Button, Switch, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'; // Ensure axios is installed and imported

import { ICategory } from '../../interfaces';

const { Text } = Typography;

type EditProductProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    editId?: string;
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

export const EditProduct: React.FC<EditProductProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    editId,
}) => {
    const t = useTranslate();
    const apiUrl = "https://tastykitchen-backend.vercel.app";
    const [form] = Form.useForm();
    const breakpoint = Grid.useBreakpoint();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [initialValues, setInitialValues] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get(`${apiUrl}/categories`);
            setCategories(response.data);
        };
        fetchCategories();

        if (editId) {
            const fetchProductDetails = async () => {
                const response = await axios.get(`${apiUrl}/products/${editId}`);
                form.setFieldsValue(response.data);
                setInitialValues(response.data);
            };
            fetchProductDetails();
        }
    }, [editId, apiUrl, form]);

    const onUpdateProduct = async (values) => {
        try {
            await axios.put(`${apiUrl}/products/${editId}`, values);
            message.success('Product updated successfully');
        } catch (error) {
            message.error('Failed to update product');
        }
    };

    return (
        <Drawer {...drawerProps} width={breakpoint.sm ? '500px' : '100%'} zIndex={1001}>
            <Form {...formProps} form={form} layout="vertical" onFinish={onUpdateProduct}>
                <Form.Item label={t('products.fields.name')} name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={t('products.fields.description')} name="description" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label={t('products.fields.image')} name="image">
                    <Input placeholder="Image URL" />
                    {initialValues.image && <Avatar src={initialValues.image} size={64} style={{ marginTop: '10px' }} />}
                </Form.Item>
                <Form.Item label={t('products.fields.optionsTitle')} name="optionsTitle">
                    <Input />
                </Form.Item>
                <OptionComponent form={form} />
                <Form.Item label={t('products.fields.category')} name="menuId" rules={[{ required: true }]}>
                    <Select>
                        {categories.map((category) => (
                            <Select.Option key={category._id} value={category._id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label={t('products.fields.topProduct')} name="topProduct" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Product
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};
