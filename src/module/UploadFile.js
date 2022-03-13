import { Space, Upload, Button, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { usePapaParse } from "react-papaparse";
import moment from "moment";
const UploadFile = ({ isUpload, setIsUpload, messageData, setMessageData }) => {
    const { readString } = usePapaParse();

    // indexed DB에 저장하여 페이지를 다시 접근하더라도 사용할 수 있도록 제공
    const writeIndexedDB = (data) => {
        let request = window.indexedDB.open("talkData")
        request.onsuccess = function(event){
            let db = this.result
            let transaction = db.transaction(['talk'], 'readwrite')
            let objectStore = transaction.objectStore('talk')
            let objectClear = objectStore.clear()
            data.forEach(e => {

                let request = objectStore.add(e)

            })
        }
    }
    const convertCsvToArray = (data) => {
        let messageSet = readString(data)
        let messageArray = [];
        let initialValue = {id:0,date:"", time:"", user:"", message:""}
        let messageLength = messageSet.length
        messageSet.data.reduce((acc, cur, idx) => {
            // console.log(acc, idx)
            if (idx === 0 ){ return acc}
            if (cur[1] === acc.user){
                acc.message += "\n" + cur[2]
            } else if (acc.date !== ""){
                messageArray.push(acc)
                acc = {
                    id:acc.id+1,
                    date:cur[0].split(" ")[0],
                    time:cur[0].split(" ")[1],
                    user:cur[1],
                    message:cur[2]
                }
            } else{
                acc = {
                    id:acc.id+1,
                    date:cur[0].split(" ")[0],
                    time:cur[0].split(" ")[1],
                    user:cur[1],
                    message:cur[2]
                }
            }
            if (idx === messageLength-1) {
                messageArray.push(acc)
            }
            return acc
        }, initialValue)

        setMessageData( messageArray);  
        writeIndexedDB(messageArray)
    };

    const UploadArea = () => {
        const props = {
            beforeUpload: (file) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    convertCsvToArray(event.target.result);
                };
                reader.readAsText(file);
                setIsUpload(true);

                return false;
            },
            maxCount: 1,
            showUploadList: false,
        };
        return (
            <Row justify="center">

            <Space align={"center"}>
                <Upload {...props}>
                    <Button block icon={<UploadOutlined />}>
                        {isUpload ? "CSV 파일 변경하기": "CSV 파일 선택하기"}
                    </Button>
                </Upload>
            </Space>
            </Row>
        );
    };
    return (
        <div>
            <UploadArea />

        </div>
    );
};

export default UploadFile;
