import { Layout, Menu, Breadcrumb, Input, Space, DatePicker, Tag, Row, Upload, Button, Select, Divider, PageHeader, List, Skeleton, Avatar } from "antd";
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined, AudioOutlined, UploadOutlined, CommentOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "antd/dist/antd.css";
import moment from "moment";
import Title from "antd/lib/typography/Title";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const FindUser = ({userPick, setUserPick}) => {
    const [options, setOptions] = useState([])
    // const options = [{ value: "gold" }, { value: "lime" }, { value: "green" }, { value: "cyan" }];
    const {userList, pickedUser} = userPick;
    function tagRender(props) {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag color={"gold"} onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
                {label}
            </Tag>
        );
    }
    const onChange = (e) => {
        setUserPick(prev => ({
            ...prev,
            pickedUser:e
        }))
    }
    useEffect(() => {
        
        setOptions(userList.map(e => ({value:e})))
    }, [userList])

    return (
        <div>
            <Select mode="multiple" showArrow tagRender={tagRender} value={pickedUser} onChange={onChange} style={{ width: "100%" }} options={options} allowClear="true" />
        </div>
    );
};

export default FindUser;
