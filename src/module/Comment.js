import { Layout, Menu, Input, DatePicker, Select, Divider, PageHeader, List, Skeleton, Avatar, Alert } from "antd";
import { useState, useEffect } from "react";
import moment from "moment";

import InfiniteScroll from "react-infinite-scroll-component";

const { Footer } = Layout;

const Comment = ({ messageData, keywords, dateRange, userPick, setUserPick }) => {
    const [messageNum, setMessageNum] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visibleMessage, setVisibleMessage] = useState([]);
    const [filteredMessage, setFilteredMessge] = useState([]);
    const {pickedUser} = userPick

    const getRandomColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
          let value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }

    const loadMoreData = (isReset) => {
        if (loading) {
            return;
        }

        setLoading(true);
        console.log("데이터를 추가로 불러오고 있습니다.")
        // console.log(messageNum)
        let newMessage = filteredMessage.slice(messageNum, messageNum + 20);
        setMessageNum(messageNum + 20);
        setVisibleMessage([...visibleMessage, ...newMessage]);
        setLoading(false);
    };
    const refresh = () => {
        setVisibleMessage([]);
        setMessageNum(0);
        setTimeout(() => {
            // console.log(messageNum)
            let newMessage = filteredMessage.slice(0, 19);
            setVisibleMessage([...newMessage]);
            setMessageNum(20);
        }, 100);
    };

    const addPickedUser = (userName) => {
        if(pickedUser.indexOf(userName) === -1){
            setUserPick(prev => ({
                ...prev,
                pickedUser: [...prev.pickedUser, userName]
            })
            )
        }
    }
    useEffect(() => {
        console.log("읽어온 파일을 정제된 메세지함에 넣습니다.");
        setFilteredMessge((prev) => [...messageData]);

        // 중복되지 않은 닉네임 명을 저장합니다.
        const _set = new Set(messageData.map((e) => e.user));

        setUserPick((prev) => ({
            ...prev,
            userList: [..._set],
        }));
    }, [messageData]);
    useEffect(() => {
        console.log("필터 조건이 바뀌어 데이터를 다시 불러옵니다.");
        setMessageNum(0);
        refresh();
        console.log(filteredMessage)
    }, [filteredMessage]);

    useEffect(() => {
        let keywordJoin = keywords.map((e) => e.keyword).join("|");
        let regex = new RegExp(keywordJoin);
        if (pickedUser.length === 0 ){
            setFilteredMessge(messageData.filter((e) => e.message.match(regex) && moment(e.date).isBetween(dateRange.start, dateRange.end, undefined, "[]")));
        } else {
            setFilteredMessge(messageData.filter((e) => e.message.match(regex) && moment(e.date).isBetween(dateRange.start, dateRange.end, undefined, "[]")&& pickedUser.indexOf(e.user) > -1));

        }

    }, [messageData, keywords, dateRange, pickedUser]);

    return (
        <Layout className="site-layout">
            <PageHeader className="site-page-header" title={keywords.length === 0 ? "전체" : "검색 결과"} subTitle={(pickedUser.length > 0 ? pickedUser.length : userPick.userList.length) + "명 / " + filteredMessage.length + "개의 내용이 표시됩니다."} />
            {messageData.length === 0 ? <Alert
      message="카카오톡에서 CSV, txt 파일을 다운로드 받아 등록하세요"
      description="맥에서 CSV파일은 PC카톡 채팅방 설정 > 저장공관 관리에서 다운받을 수 있습니다. 윈도우에서는 메뉴>대화내용 >대화 내보내기를 이용해서 txt파일을 받아주세요."
      type="info"
      showIcon
      style={{whiteSpace:'pre-wrap', margin:"16px"}}
    /> : ""}
            {messageData.length === 0 ? <Alert
      message="파일은 다른 사람에게 공유되지 않으니 걱정마세요."
      description="해당 파일은 서버에 업로드되지 않으며 브라우저가 열려있는 동안만 브라우저 캐시에 저장됩니다."
      type="info"
      showIcon
      style={{whiteSpace:'pre-wrap', margin:"16px"}}
    /> : ""}
            {/* <div onClick={refresh} >삭제</div> */}
            <div id="scrollableDiv" style={{ margin: "16px", maxHeight: "calc(100vh - 250px)", overflowY: "scroll" }}>
                <InfiniteScroll
                    dataLength={messageNum}
                    next={loadMoreData}
                    hasMore={true}
                    loader={filteredMessage.length === 0 ? "": <Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                    refreshFunction={refresh}
                >
                    <List
                        className="kakaoTalkDataArea"
                        itemLayout="vertical"
                        style={{ backgroundColor: "#FFFFFF" }}
                        dataSource={visibleMessage}
                        renderItem={(item) => (
                            <List.Item style={{ paddingLeft: "16px" }}>
                                <Skeleton avatar title={false} loading={false} active>
                                    <List.Item.Meta avatar={<Avatar style={{backgroundColor:getRandomColor(item.user)}}>{item.user.substr(0, 2)}</Avatar>} title={<a onClick={e => addPickedUser(item.user)}>{item.user} </a>} style={{ marginBottom: "0" }} description={<span>{item.date} {item.time}</span>} />
                                </Skeleton>
                                <div style={{ padding: "0 48px",whiteSpace:"pre-wrap" }}>{item.message}</div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
            <Footer style={{ textAlign: "center" }}>comanni ©2022 / 2022.03.15 업데이트 v0.0.3</Footer>
        </Layout>
    );
};
export default Comment;
