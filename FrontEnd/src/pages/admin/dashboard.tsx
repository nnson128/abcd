import { Card, Col, Row, Statistic, message, notification } from "antd";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { callCount } from "@/config/api";
import { ICount } from "@/types/backend";

const DashboardPage = () => {
    const [counts, setCounts] = useState<ICount>({
        countUser: 0,
        countJob: 0,
        countCompany: 0,
    });

    const fetchCounts = async () => {
        try {
            const res = await callCount();
            if (res && +res.statusCode === 200 && res.data) {
                setCounts(res.data);
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message || "Không thể lấy dữ liệu thống kê",
                });
            }
        } catch (error) {
            message.error("Không thể kết nối đến server.");
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    const formatter = (value: number | string) => (
        <CountUp end={Number(value)} separator="," />
    );

    return (
        <Row gutter={[20, 20]}>
            <Col span={24} md={8}>
                <Card title="Người dùng" bordered={false}>
                    <Statistic
                        title="Số lượng người dùng"
                        value={counts.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Công ty" bordered={false}>
                    <Statistic
                        title="Số lượng công ty"
                        value={counts.countCompany}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Công việc" bordered={false}>
                    <Statistic
                        title="Số lượng công việc"
                        value={counts.countJob}
                        formatter={formatter}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default DashboardPage;
