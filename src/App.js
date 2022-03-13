import { Layout,  } from "antd";
import { useState, useEffect } from "react";
import "antd/dist/antd.css";
import './App.css';
import moment from "moment";
import SideTab from "./component/SideTab";
import Comment from "./module/Comment"

function App() {
    const [isUpload, setIsUpload] = useState(false)
    const [messageData, setMessageData] = useState([])
    const [keywords, setKeywords] = useState([]);
    const [dateRange, setDateRange] = useState({start:moment('2022-01-01'), end:moment()})
    const [userPick, setUserPick] = useState({
      userList : [],
      pickedUser: [],
      selectedUserCnt: 0,
    })
    const sideTabProps = {
      isUpload, setIsUpload, messageData, setMessageData, keywords, setKeywords,dateRange, setDateRange, userPick, setUserPick
    }
    const commentProps = {
      messageData, keywords, dateRange, userPick, setUserPick
    }

    useEffect(()=> {
      if(!window.indexedDB){}
      else{
        let db;
        let request = window.indexedDB.open('talkData');
        request.onupgradeneeded = function(event){
          let db = event.target.result;
          let objectStore = db.createObjectStore('talk', {keyPath:'id'})
        }
        request.onerror = function(event){alert("db create failed")}
        request.onsuccess = function(event){db = request.result}

      }
    },[])
    return (
        <Layout style={{ minHeight: "100vh" }}>
          <SideTab {...sideTabProps}/>
          <Comment {...commentProps}  />
        </Layout>
    );
}

export default App;
