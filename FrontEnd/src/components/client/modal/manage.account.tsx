import { Button, Col, Form, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume, ISubscribers } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callCreateSubscriber, callFetchAllSkill, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import UserUpdateInfo from "@/components/client/modal/UserUpdateInfo";
import './manage-account.scss'; // Custom SCSS for styling
import UserUpdatePassword from "@/components/client/modal/UserUpdatePassword";

const { Option } = Select;

const UserResume = () => {
  const [listCV, setListCV] = useState<IResume[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setIsFetching(true);
      const res = await callFetchResumeByUser();
      if (res && res.data) {
        setListCV(res.data.result as IResume[]);
      }
      setIsFetching(false);
    };
    init();
  }, []);

  const columns: ColumnsType<IResume> = [
    { title: 'STT', key: 'index', width: 50, align: "center", render: (text, record, index) => index + 1 },
    { title: 'Công Ty', dataIndex: "companyName" },
    { title: 'Job title', dataIndex: ["job", "name"] },
    { title: 'Trạng thái', dataIndex: "status" },
    {
      title: 'Ngày rải CV',
      dataIndex: "createdAt",
      render: (value, record) => dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss'),
    },
    {
      title: '',
      dataIndex: "",
      render: (value, record) => (
        <a href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`} target="_blank">
          Chi tiết
        </a>
      ),
    },
  ];

  return (
    <Table<IResume>
      columns={columns}
      dataSource={listCV}
      loading={isFetching}
      pagination={false}
      className="user-resume-table"
    />
  );
};

const JobByEmail = () => {
  const [form] = Form.useForm();
  const user = useAppSelector(state => state.account.user);
  const [optionsSkills, setOptionsSkills] = useState<{ label: string; value: string }[]>([]);
  const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);

  useEffect(() => {
    const init = async () => {
      await fetchSkill();
      const res = await callGetSubscriberSkills();
      if (res && res.data) {
        setSubscriber(res.data);
        const arr = res.data.skills.map((item: any) => ({
          label: item.name as string,
          value: item.id + "",
        }));
        form.setFieldValue("skills", arr);
      }
    };
    init();
  }, []);

  const fetchSkill = async () => {
    const query = `page=1&size=100&sort=createdAt,desc`;
    const res = await callFetchAllSkill(query);
    if (res && res.data) {
      const arr = res?.data?.result?.map((item: any) => ({
        label: item.name as string,
        value: item.id + "",
      })) ?? [];
      setOptionsSkills(arr);
    }
  };

  const onFinish = async (values: any) => {
    const { skills } = values;
    const arr = skills?.map((item: any) => (item?.id ? { id: item.id } : { id: item }));

    if (!subscriber?.id) {
      const data = { email: user.email, name: user.name, skills: arr };
      const res = await callCreateSubscriber(data);
      if (res.data) {
        message.success("Cập nhật thông tin thành công");
        setSubscriber(res.data);
      } else {
        notification.error({ message: 'Có lỗi xảy ra', description: res.message });
      }
    } else {
      const res = await callUpdateSubscriber({ id: subscriber?.id, skills: arr });
      if (res.data) {
        message.success("Cập nhật thông tin thành công");
        setSubscriber(res.data);
      } else {
        notification.error({ message: 'Có lỗi xảy ra', description: res.message });
      }
    }
  };

  return (
    <Form onFinish={onFinish} form={form} className="job-by-email-form">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Kỹ năng"
            name="skills"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}
          >
            <Select
              mode="multiple"
              allowClear
              suffixIcon={<MonitorOutlined />}
              style={{ width: '100%' }}
              placeholder="Tìm theo kỹ năng..."
              optionLabelProp="label"
              options={optionsSkills}
              className="skills-select"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button htmlType="submit" type="primary" size="large" block className="update-button">
            Cập nhật
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const ManageAccount = (props: IProps) => {
  const { open, onClose } = props;

  const onChange = (key: string) => {
    // console.log(key);
  };

  const items: TabsProps['items'] = [
    { key: 'user-resume', label: `Rải CV`, children: <UserResume /> },
    { key: 'email-by-skills', label: `Nhận Jobs qua Email`, children: <JobByEmail /> },
    { key: 'user-update-info', label: `Cập nhật thông tin`, children: <UserUpdateInfo /> },
    { key: 'user-password', label: `Thay đổi mật khẩu`, children: <UserUpdatePassword /> },
  ];

  return (
    <Modal
      title="Quản lý tài khoản"
      open={open}
      onCancel={() => onClose(false)}
      maskClosable={false}
      footer={null}
      destroyOnClose={true}
      width={isMobile ? "90%" : "800px"}
      className="manage-account-modal"
    >
      <div style={{ minHeight: 400, padding: '16px' }}>
        <Tabs defaultActiveKey="user-resume" items={items} onChange={onChange} className="manage-account-tabs" />
      </div>
    </Modal>
  );
};

export default ManageAccount;