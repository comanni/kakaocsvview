import { Space, Upload, Button, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { usePapaParse } from "react-papaparse";
import moment from "moment";
const UploadFile = ({ isUpload, setIsUpload, messageData, setMessageData }) => {
    const { readString } = usePapaParse();

    // indexed DB에 저장하여 페이지를 다시 접근하더라도 사용할 수 있도록 제공
    const writeIndexedDB = (data) => {
        let request = window.indexedDB.open("talkData");
        request.onsuccess = function (event) {
            let db = this.result;
            let transaction = db.transaction(["talk"], "readwrite");
            let objectStore = transaction.objectStore("talk");
            let objectClear = objectStore.clear();
            data.forEach((e) => {
                let request = objectStore.add(e);
            });
        };
    };
    const convertCsvToArray = (filename, data) => {
        let initialValue = { id: 0, date: "", time: "", user: "", message: "" };
        let yearReg = /[0-9]*년/;
        let monthReg = /[0-9]*월/;
        let dayReg = /[0-9]*일/;

        let messageArray = [];

        if (filename.indexOf(".txt") > -1) {
            console.log("txt 파일입니다.");
            let enteredText = data.split("\r\n");
            let nameFindRegex = /\[*\]/g;
            let messageLength = enteredText.length
            enteredText.reduce((acc, cur, idx) => {
                if (idx < 3) {
                    return acc;
                }
                console.log(cur);
                // console.log([...cur.matchAll(nameFindRegex)].length)
                // if (cur[0].indexOf)
                if (cur.indexOf("---------------") > -1 && cur.match(yearReg) !== null) {
                    if (idx !== 3) {messageArray.push(acc)}
                    let _month = monthReg.exec(cur)[0].replace("월", "")
                    let _day = dayReg.exec(cur)[0].replace("일", "")
                    let month = Number(_month) < 10 ? `0${_month}`:_month
                    let day = Number(_day) < 10 ? `0${_day}`:_day
                    acc = {
                        ...acc,
                        user:"",
                        time:"",
                        message:"",
                        date: yearReg.exec(cur)[0].slice(0, 4) + "-" + month + "-" + day
                    };
                    console.log(acc)
                    return acc
                } else if (cur.indexOf("님이 들어왔습니다.") > -1) {
                    return acc;
                }

                // 제대로된 형식인 경우
                
                else if ([...cur.matchAll(nameFindRegex)].length >= 2) {
                    let matchData = [...cur.matchAll(nameFindRegex)];

                    // 대화의 연속인 경우
                    if (acc.user === cur.slice(1, matchData[0].index)) {
                        acc.message += "\n" + cur.slice(matchData[1].index + 2);
                    } else {
                        if (acc.id !== 0 ){
                            messageArray.push(acc)
                        }
                        console.log(acc)
                        acc = {
                            ...acc,
                            id:acc.id+1,
                            user: cur.slice(1, matchData[0].index),
                            time: cur.slice(matchData[0].index + 3, matchData[1].index),
                            message: cur.slice(matchData[1].index + 2),
                        };
                    }
                } 
                // 이름/시간/내용의 형식이 아닌 경우 → 앞 문장에 붙이기
                else {
                    acc.message += "\n" + cur;
                }
                if (idx === messageLength - 1) {
                    messageArray.push(acc);
                }
                return acc;
            }, initialValue);
        } else if (filename.indexOf(".csv") > -1) {
            let messageSet = readString(data);
            // let messageArray = [];
            let messageLength = messageSet.length;

            messageSet.data.reduce((acc, cur, idx) => {
                // console.log(acc, idx)
                if (idx === 0) {
                    return acc;
                }
                if (cur[1] === acc.user) {
                    acc.message += "\n" + cur[2];
                } else if (acc.date !== "") {
                    messageArray.push(acc);
                    acc = {
                        id: acc.id + 1,
                        date: cur[0].split(" ")[0],
                        time: cur[0].split(" ")[1],
                        user: cur[1],
                        message: cur[2],
                    };
                } else {
                    acc = {
                        id: acc.id + 1,
                        date: cur[0].split(" ")[0],
                        time: cur[0].split(" ")[1],
                        user: cur[1],
                        message: cur[2],
                    };
                }
                if (idx === messageLength - 1) {
                    messageArray.push(acc);
                }
                return acc;
            }, initialValue);
        }

        setMessageData( messageArray);
        writeIndexedDB(messageArray)
    };

    const UploadArea = () => {
        const props = {
            beforeUpload: (file) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    convertCsvToArray(file.name, event.target.result);
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
                            {isUpload ? "CSV/TXT 파일 변경하기" : "CSV/TXT 파일 선택하기"}
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
