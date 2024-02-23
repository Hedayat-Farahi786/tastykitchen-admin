import React, { useEffect, useState } from "react";
import { useTranslate, useNavigation } from "@refinedev/core";
import { Typography, Tooltip, ConfigProvider, theme } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Import your styled components
import {
  TimelineContent,
  CreatedAt,
  Number,
  Timeline,
  TimelineItem,
} from "./styled";

dayjs.extend(relativeTime);

export const OrderTimeline: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslate();
  const { show } = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://tastykitchen-backend.vercel.app/orders"
        );
        const data = await response.json();
        // Assuming you want to display the last 5 orders
        setOrders(data.slice(-5).reverse());
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const orderStatusColor = (status: string) => {
    // Adjust this function based on how your status is represented in the fetched data
    switch (status) {
      case "pending":
        return {
          indicatorColor: "orange",
          backgroundColor: "#fff7e6",
          text: "pending",
        };
      case "ready":
        return {
          indicatorColor: "cyan",
          backgroundColor: "#e6fffb",
          text: "ready",
        };
      case "on the way":
        return {
          indicatorColor: "green",
          backgroundColor: "#e6f7ff",
          text: "on the way",
        };
      case "delivered":
        return {
          indicatorColor: "blue",
          backgroundColor: "#e6fffb",
          text: "delivered",
        };
      case "cancelled":
        return {
          indicatorColor: "red",
          backgroundColor: "#fff1f0",
          text: "cancelled",
        };
      default:
        return {
          indicatorColor: "gray",
          backgroundColor: "transparent",
          text: status,
        };
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <Timeline>
        {loading ? (
          <TimelineItem>
            <TimelineContent>Loading...</TimelineContent>
          </TimelineItem>
        ) : (
          orders.map(
            ({
              _id,
              delivery,
              products,
              totalPrice,
              payment,
              orderNumber,
              status,
              time,
            }) => {
              // Assuming status is part of your order object, or you define how to get it
              const colorInfo = orderStatusColor(status ? status : "-");
              return (
                <TimelineItem key={_id} color={colorInfo.indicatorColor}>
                  <TimelineContent backgroundColor={colorInfo.backgroundColor}>
                    <Tooltip title={dayjs(time).format("YYYY-MM-DD HH:mm:ss")}>
                      <CreatedAt italic>{dayjs(time).fromNow()}</CreatedAt>
                    </Tooltip>
                    <Typography.Text>
                      {t(`dashboard.timeline.orderStatuses.${colorInfo.text}`)}
                    </Typography.Text>
                    <Number onClick={() => show("orders", _id)} strong>
                      #{orderNumber}
                    </Number>
                  </TimelineContent>
                </TimelineItem>
              );
            }
          )
        )}
      </Timeline>
    </ConfigProvider>
  );
};
