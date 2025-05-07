import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row, Typography } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons'; // Added icon for the section title
import JobCard from '@/components/client/card/job.card';
import './client-job-page.scss'; // Custom SCSS for styling

const { Title } = Typography;

const ClientJobPage = (props: any) => {
  return (
    <div className="client-job-page">
      <div className="container">
        <div className="content-wrapper">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <SearchClient />
            </Col>
            <Divider className="custom-divider" />
            <Col span={24}>
              <Title level={3} className="section-title">
                <FileSearchOutlined className="section-icon" /> Danh Sách Việc Làm
              </Title>
              <JobCard showPagination={true} />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ClientJobPage;