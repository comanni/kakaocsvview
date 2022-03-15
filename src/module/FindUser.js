import { Layout, Menu, Breadcrumb, Input, Space, DatePicker, Tag, Row, Col, Select, Divider, PageHeader, List, Skeleton, Avatar } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "antd/dist/antd.css";
import moment from "moment";
import Title from "antd/lib/typography/Title";
import { renderIntoDocument } from "react-dom/test-utils";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const FindUser = ({ userPick, setUserPick }) => {
    const [options, setOptions] = useState([]);
    // const options = [{ value: "gold" }, { value: "lime" }, { value: "green" }, { value: "cyan" }];
    const { userList, pickedUser } = userPick;
    const [recentUserList, setRecentUserList] = useState([]);
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
    const RecentUserSearch = (user) => {
        console.log(user.user);
        return (
            <Col onClick={() => onKeywordClick(user.user)}>
                <Tag style={{ marginBottom: "6px" }} value={user.user}>
                    {user.user}
                </Tag>
            </Col>
        );
    };
    const onKeywordClick = (e) => {
        // console.log(e);
        // console.log(recentUserList);
        setRecentUserList((prev) => [...prev.filter((a) => a !== e), e]);
        // if (recentUserList.indexOf(e) > -1) {
        //     console.log(recentUserList);
        // } else {
        //     console.log("ㄷ");
        // }
        setUserPick((prev) => ({
            ...prev,
            pickedUser: [...prev.pickedUser.filter((user) => user !== e), e],
        }));
    };
    const onChange = (e) => {
        // console.log(pickedUser)
        // console.log(e);

        let _newKeyword = []
        e.forEach((keyword) => {
            if (recentUserList.indexOf(keyword) === -1 && pickedUser.indexOf(keyword) === -1) {
                _newKeyword.push(keyword);
            }
        });
        // console.log(_newKeyword)
        let deleteCount = recentUserList.length + _newKeyword.length - 5
        setRecentUserList((prev) => [...prev.filter((user, index) => index >= deleteCount), ..._newKeyword]);
        window.localStorage.setItem("recentUserList", JSON.stringify([...recentUserList.filter((user,index)=> index >= deleteCount), ..._newKeyword]))
        setUserPick((prev) => ({
            ...prev,
            pickedUser: e,
        }));
    };
    useEffect(() => {
        setOptions(userList.map((e) => ({ value: e })));
    }, [userList]);
    useEffect(() => {
        let _userList = window.localStorage.getItem("recentUserList")||"[]"
        let userList = JSON.parse(_userList)
        setRecentUserList(prev => [...prev,...userList ])
    },[])

    return (
        <div>
            <Select mode="multiple" showArrow tagRender={tagRender} value={pickedUser} onChange={onChange} style={{ width: "100%" }} options={options} allowClear="true" />
            <div style={{ padding: "12px" }}>
                <UnorderedListOutlined /> 최근 검색어
            </div>
            <div style={{ padding: "0 16px" }}>
                <Row>
                    {recentUserList.map((user) => (
                        <RecentUserSearch user={user} />
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default FindUser;
