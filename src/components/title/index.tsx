import { useLink } from "@refinedev/core";
import { theme } from "antd";

import { BikeWhiteIcon, FineFoodsIcon } from "../../components";
import { Logo } from "./styled";

const { useToken } = theme;

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const { token } = useToken();
    const Link = useLink();

    return (
        <Logo>
            <Link to="/">
                {collapsed ? (
                    <img style={{
                        width: "4rem"
                    }} src="/images/logo-small.png" alt="" />
                ) : (
                    <img style={{
                        width: "10rem"
                    }} src="/images/logo.png" alt="Logo" />
                )}
            </Link>
        </Logo>
    );
};
