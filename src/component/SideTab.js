import { Layout,Divider } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import Title from "antd/lib/typography/Title";
import FindContent from "../module/FindContent";
import FindDate from "../module/FindDate";
import UploadFile from "../module/UploadFile";
import FindUser from "../module/FindUser";
const { Sider } = Layout;


const DividerTitle = ({ title }) => {
    return (
        <Divider orientation="left" orientationMargin={10}>
            {title}
        </Divider>
    );
};
const SideTab = ({keywords, setKeywords, isUpload, setIsUpload, messageData, setMessageData, filteredMessage, setFilteredMessage, dateRange, setDateRange, userPick, setUserPick}) => {
    const uploadFileProps = {
        isUpload, setIsUpload, messageData, setMessageData,filteredMessage, setFilteredMessage
      }
    const SearchProps = {
        messageData,  keywords, setKeywords
      }
      const dateProps = {
        dateRange, setDateRange
      }
      const userProps = {
        userPick, setUserPick
      }
    return (
        <div>
            <Sider theme="light" style={{ overflow: "auto", height: "100vh", left: 0, top: 0, bottom: 0 }} width={260}>
                <div className="logo" style={{ padding: "24px 0 0 10px" }}>
                    <Title level={4}>
                        <CommentOutlined /> 카카오톡 벽타기 Helper
                    </Title>
                </div>
                <DividerTitle title={"파일 등록하기"} />
                <UploadFile {...uploadFileProps} />

                <DividerTitle title={"내용 검색하기"} />
                <FindContent {...SearchProps}/>

                <DividerTitle title={"기간 선택하기"} />
                <FindDate {...dateProps}/>

                <DividerTitle title={"참여자 선택하기"} />
                <FindUser {...userProps}/>
            </Sider>
        </div>
    );
};

export default SideTab;
