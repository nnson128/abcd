import { callFetchCompany } from "@/config/api";
import { convertSlug } from "@/config/utils";
import { ICompany } from "@/types/backend";
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import { RiseOutlined, UserOutlined } from "@ant-design/icons";
import "./company-card.scss";

interface IProps {
  showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
  const { showPagination = false } = props;
  const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompany();
  }, [current, pageSize, filter, sortQuery]);

  const fetchCompany = async () => {
    setIsLoading(true);
    let query = `page=${current}&size=${pageSize}`;
    if (filter) query += `&${filter}`;
    if (sortQuery) query += `&${sortQuery}`;
    const res = await callFetchCompany(query);
    if (res && res.data) {
      setDisplayCompany(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination.current !== current) setCurrent(pagination.current);
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleViewDetailJob = (item: ICompany) => {
    if (item.name) {
      const slug = convertSlug(item.name);
      navigate(`/company/${slug}?id=${item.id}`);
    }
  };

  return (
    <div className="company-section">
      <div className="company-content">
        <Spin spinning={isLoading} tip="Đang tải..." className="custom-spin">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <div className={isMobile ? "dflex-mobile" : "dflex-pc"}>
                <span className="title">
                  <RiseOutlined className="title-icon" /> Nhà Tuyển Dụng Hàng
                  Đầu
                </span>
                {!showPagination && <Link to="company">Xem tất cả</Link>}
              </div>
            </Col>
            {displayCompany?.map((item) => (
              <Col span={24} md={6} key={item.id}>
                <Card
                  onClick={() => handleViewDetailJob(item)}
                  className="company-card"
                  hoverable
                  cover={
                    <div className="card-cover">
                      <img
                        alt={item.name}
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/storage/company/${item?.logo}`}
                        className="company-logo"
                      />
                    </div>
                  }
                >
                  <Divider className="custom-divider" />
                  <h3 className="company-name">{item.name}</h3>
                  <p className="company-address">{item.address || "Không có địa chỉ"}</p>
                  <div className="card-icon">
                    <UserOutlined />
                  </div>
                </Card>
              </Col>
            ))}
            {(!displayCompany || displayCompany.length === 0) && !isLoading && (
              <div className="empty">
                <Empty description="Không có dữ liệu" />
              </div>
            )}
          </Row>
          {showPagination && (
            <>
              <div style={{ marginTop: 30 }} />
              <Row style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  responsive
                  onChange={(p: number, s: number) =>
                    handleOnchangePage({ current: p, pageSize: s })
                  }
                  className="custom-pagination"
                />
              </Row>
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default CompanyCard;