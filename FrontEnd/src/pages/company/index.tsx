import { Col, Row } from 'antd';
import { RiseOutlined } from '@ant-design/icons'; // Decorative icon
import CompanyCard from '@/components/client/card/company.card';
import './client-company-page.scss'; // Custom SCSS for styling

const ClientCompanyPage = (props: any) => {
  return (
    <div className="client-company-page">
      <div className="container">
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <CompanyCard showPagination={true} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ClientCompanyPage;