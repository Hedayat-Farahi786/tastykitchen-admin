import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Row, Col, Form, Input, Select, List as AntdList } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { useSimpleList, CreateButton, useDrawerForm } from "@refinedev/antd";

import { ProductItem, CreateProduct, EditProduct } from "../../components/product";
import { IProduct, ICategory } from "../../interfaces";

const { Text } = Typography;
const { Option } = Select;

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("https://tastykitchen-backend.vercel.app/categories");
      setCategories(response.data);
    };

    const fetchProducts = async () => {
      const response = await axios.get("https://tastykitchen-backend.vercel.app/products");
      setAllProducts(response.data);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on category and search term
    const filterProducts = () => {
      let filteredProducts = allProducts;
      if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(product => product.menuId === selectedCategory);
      }
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      setProducts(filteredProducts);
    };

    filterProducts();
  }, [selectedCategory, allProducts, searchTerm]);

  const { drawerProps: createDrawerProps, formProps: createFormProps, saveButtonProps: createSaveButtonProps, show: createShow } = useDrawerForm<IProduct>({
    action: "create",
    resource: "products",
    redirect: false,
  });

  const { drawerProps: editDrawerProps, formProps: editFormProps, saveButtonProps: editSaveButtonProps, show: editShow, id: editId } = useDrawerForm<IProduct>({
    action: "edit",
    resource: "products",
    redirect: false,
  });

  return (
    <div>
      <Form
        initialValues={{
          name: "",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <Text style={{ fontSize: "24px" }} strong>
                {t("products.products")}
              </Text>
              <Input
                style={{ width: "400px" }}
                placeholder={t("stores.productSearch")}
                suffix={<SearchOutlined />}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <CreateButton onClick={() => createShow()}>
                {t("stores.buttons.addProduct")}
              </CreateButton>
            </div>
            <Select
              defaultValue="all"
              style={{ width: 200, marginBottom: 16 }}
              onChange={(value) => setSelectedCategory(value)}
            >
              <Option value="all">All Categories</Option>
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            <AntdList
              grid={{
                gutter: 8,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4,
              }}
              dataSource={products}
              renderItem={(item) => (
                <ProductItem item={item} editShow={editShow} />
              )}
            />
          </Col>
        </Row>
      </Form>
      <CreateProduct
        drawerProps={createDrawerProps}
        formProps={createFormProps}
        saveButtonProps={createSaveButtonProps}
      />
      <EditProduct
        drawerProps={editDrawerProps}
        formProps={editFormProps}
        saveButtonProps={editSaveButtonProps}
        editId={editId}
      />
    </div>
  );
};
