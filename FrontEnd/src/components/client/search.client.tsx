import { Button, Col, Form, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, MonitorOutlined, SearchOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './search-client.scss'; // Custom SCSS for styling

const SearchClient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();
  const [optionsSkills, setOptionsSkills] = useState<{
    label: string;
    value: string;
  }[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (location.search) {
      const queryLocation = searchParams.get("location");
      const querySkills = searchParams.get("skills");
      if (queryLocation) {
        form.setFieldValue("location", queryLocation.split(","));
      }
      if (querySkills) {
        form.setFieldValue("skills", querySkills.split(","));
      }
    }
  }, [location.search]);

  useEffect(() => {
    fetchSkill();
  }, []);

  const fetchSkill = async () => {
    let query = `page=1&size=100&sort=createdAt,desc`;
    const res = await callFetchAllSkill(query);
    if (res && res.data) {
      const arr = res?.data?.result?.map(item => ({
        label: item.name as string,
        value: item.id + "" as string,
      })) ?? [];
      setOptionsSkills(arr);
    }
  };

  const onFinish = async (values: any) => {
    let query = "";
    if (values?.location?.length) {
      query = `location=${values?.location?.join(",")}`;
    }
    if (values?.skills?.length) {
      query = values.location?.length
        ? query + `&skills=${values?.skills?.join(",")}`
        : `skills=${values?.skills?.join(",")}`;
    }

    if (!query) {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: "Vui lòng chọn tiêu chí để tìm kiếm",
      });
      return;
    }
    navigate(`/job?${query}`);
  };

  return (
    <div className="search-client-wrapper">
      <h2 className="search-title">
        <SearchOutlined className="title-icon" /> Tìm kiếm việc làm phù hợp với Bạn
      </h2>
      <ProForm
        form={form}
        onFinish={onFinish}
        submitter={{ render: () => <></> }}
        className="search-form"
      >
        <Row gutter={[20, 20]}>
          <Col span={24} md={16}>
            <ProForm.Item name="skills">
              <Select
                mode="multiple"
                allowClear
                suffixIcon={null}
                style={{ width: '100%' }}
                placeholder={
                  <>
                    <MonitorOutlined className="select-icon" /> Tìm theo kỹ năng...
                  </>
                }
                optionLabelProp="label"
                options={optionsSkills}
                className="skills-select"
              />
            </ProForm.Item>
          </Col>
          <Col span={12} md={4}>
            <ProForm.Item name="location">
              <Select
                mode="multiple"
                allowClear
                suffixIcon={null}
                style={{ width: '100%' }}
                placeholder={
                  <>
                    <EnvironmentOutlined className="select-icon" /> Địa điểm...
                  </>
                }
                optionLabelProp="label"
                options={optionsLocations}
                className="location-select"
              />
            </ProForm.Item>
          </Col>
          <Col span={12} md={4}>
            <Button
              type="primary"
              onClick={() => form.submit()}
              className="search-button"
              icon={<SearchOutlined />}
            >
              Search
            </Button>
          </Col>
        </Row>
      </ProForm>
    </div>
  );
};

export default SearchClient;