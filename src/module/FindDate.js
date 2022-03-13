import { Layout, Menu, Breadcrumb, Input, Space, DatePicker, Tag, Row, Upload, Button, Select, Divider, PageHeader, List, Skeleton, Avatar } from "antd";
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, AudioOutlined, UploadOutlined, CommentOutlined } from "@ant-design/icons";
import { useState } from "react";
import "antd/dist/antd.css";
import moment from "moment";
import Title from "antd/lib/typography/Title";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const FindDate = ({dateRange, setDateRange}) => {
    function onChange(dates, dateStrings) {
        setDateRange(prev => ({
            ...prev,
            start:dateStrings[0],
            end:dateStrings[1]
        }))
        console.log("From: ", dates[0], ", to: ", dates[1]);
        console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    }
    return (
        <div>

                <Space align="center">
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            "This Month": [moment().startOf("month"), moment().endOf("month")],
                        }}
                        onChange={onChange}
                    />
                </Space>
        </div>
    );
};

export default FindDate;
