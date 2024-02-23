import { useEffect, useState } from "react";
import { Button, Space } from "antd";
import { ICategory } from "../../interfaces";

type ProductCategoryFilterProps = {
    categories: ICategory[];
    value?: string[];
    onChange?: (value: string[]) => void;
};

export const ProductCategoryFilter: React.FC<ProductCategoryFilterProps> = ({
    categories,
    onChange,
    value = [],
}) => {
    const [filterCategories, setFilterCategories] = useState<string[]>(value);

    useEffect(() => {
        // Notify parent component about the change
        onChange?.(filterCategories);
    }, [filterCategories, onChange]);

    const toggleFilterCategory = (clickedCategoryId: string) => {
        setFilterCategories((currentCategories) => {
            const isAlreadySelected = currentCategories.includes(clickedCategoryId);
            if (isAlreadySelected) {
                return currentCategories.filter(id => id !== clickedCategoryId);
            } else {
                return [...currentCategories, clickedCategoryId];
            }
        });
    };

    return (
        <Space wrap>
            <Button
                shape="round"
                type={filterCategories.length === 0 ? "primary" : "default"}
                onClick={() => setFilterCategories([])}
            >
                All
            </Button>
            {categories.map((category) => (
                <Button
                    key={category._id}
                    shape="round"
                    type={filterCategories.includes(category._id) ? "primary" : "default"}
                    onClick={() => toggleFilterCategory(category._id)}
                >
                    {category.name}
                </Button>
            ))}
        </Space>
    );
};
