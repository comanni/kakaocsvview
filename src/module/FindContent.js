import { Input, Space, Tag, Row, Button } from "antd";
import { useState } from "react";
const { Search } = Input;

const FindContent = ({ keywords, setKeywords }) => {

    const [ranNum, setRanNum] = useState(1);
    const [linkOnly, setLinkOnly] = useState(false)
    function onClose(e) {
        setKeywords((prev) => prev.filter((key) => key.keyword !== e));
    }
    function onSearch(newKeyword) {
        if (newKeyword !== "") {
            setKeywords((keyword) => [...keyword, { keyword: newKeyword, num: ranNum }]);
            setRanNum(ranNum + 1);
        }
    }
    function onPress(newKeyword) {
 
        if (newKeyword !== "" && keywords.findIndex((e) => e.keyword === newKeyword.target.value) === -1) {
            setKeywords((keyword) => [...keyword, { keyword: newKeyword.target.value, num: ranNum }]);
            setRanNum(ranNum + 1);
        }
    }
    function SearchTag({ tagName }) {
        console.log(tagName);
        return (
            <Tag closable onClose={(e) => onClose(tagName.keyword)}>
                {tagName.keyword}
            </Tag>
        );
    }

    function onLinkToggle() {
        if (!linkOnly) {setKeywords((prev) => (
            [...prev, { keyword: "http", num: ranNum }]
        ))} else {
            setKeywords((prev) => (
                prev.filter((key) => key.keyword !== "http")
            ))
        }
        setLinkOnly(!linkOnly)
    }

    return (
        <div>
            <Row style={{ padding: "10px" }}>
                <Search placeholder="input search text" onSearch={onSearch} onPressEnter={onPress} />
            </Row>
            <Space style={{ padding: "10px 5px" }}>
                {keywords.map((keyword) => (
                    <SearchTag tagName={keyword} key={keyword.num} />
                ))}
            </Space>
            <Row style={{ padding: "10px" }}>
                <Button block type={linkOnly? "primary": ""} onClick={onLinkToggle}>
                    링크 주소 골라보기
                </Button>
            </Row>
        </div>
    );
};

export default FindContent;
