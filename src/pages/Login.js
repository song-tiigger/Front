import styled from "styled-components";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlexBox, FlexBoxSB } from "../styles/Layout";
import { BtnBg, BtnBorder } from "../styles/ButtonStyle";

function Login() {
  // 상태값
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [IdMessage, SetIdMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [idMsgColor, setIdMsgColor] = useState({color: "#F82A2A"});
  const [pswMsgColor, setPswMsgColor] = useState({color: "#F82A2A"});

  const [isId, setIsId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  // 아이디 저장 체크박스 checked 관리
  const [rememberId, setRememberId] = useState(false);

  const navigate = useNavigate();

  //문자열에 공백이 있는 경우
  let blankReg = /[\s]/g;

  // 사용자 아이디 받기
  const userId = e => {
    setId(e.target.value);

    const idReg = /^[a-z0-9]{2,10}$/;
    if (!idReg.test(e.target.value)) {
      SetIdMessage("아이디는 2~10자의 영문 소문자, 숫자를 사용해 주세요.");
      setIdMsgColor({color: '#F82A2A'});
      if(blankReg.test(e.target.value) === true) {
        SetIdMessage("공백 없이 입력해 주세요.");
        setIdMsgColor({color: '#F82A2A'});
        setIsId(false);
      }
    } else {
      SetIdMessage("");
      setIsId(true);
    }
  }

 // 사용자 비밀번호 받기
  const userPassword = e => {
    setPassword(e.target.value);
    const passwordReg = /^[A-Za-z0-9]{4,8}$/;

    if (!passwordReg.test(e.target.value)) {
      setPasswordMessage("비밀번호는 4~8자의 영문 대/소문자, 숫자를 사용해 주세요.");
      setPswMsgColor({color: '#F82A2A'});
      if(blankReg.test(e.target.value) === true) {
        setPasswordMessage("공백 없이 입력해 주세요.");
        setPswMsgColor({color: '#F82A2A'});
        setIsPassword(false);
      }
    } else {
      setPasswordMessage("");
      setIsPassword(true);
    }
  }

  // 아이디 저장 체크 이벤트
  const handleOnCheck = e => {
    setRememberId(e.target.checked);
  }

  // 회원가입 페이지로 이동
  function goJoin() {
    navigate('/join');
  }

  // 아이디 찾기 페이지로 이동
  function goSearchId() {
    navigate('/search/id');
  }

  // 비밀번호 재설정 페이지로 이동
  function goResetPwChk() {
    navigate('/search/check/id');
  }

  // 로그인 버튼 클릭시 실행될 작업
  function SignIn(e) {

    if(id === "" || password === "") {
      alert("아이디와 비밀번호를 모두 입력해주세요");
    } 
    if(isId && isPassword !== true) {
      alert("입력한 정보를 다시 확인 해주세요.");
    }
    else {
      axios.post('/login', {
        userId: id,
        userPassword: password,
      })
        .then(response => {
          // alert(response.status + "로그인이 완료되었습니다.");
          console.log(response.data, id, password);
          sessionStorage.setItem("아이디", id);
          // sessionStorage.setItem("비밀번호", password);
          sessionStorage.setItem("userNumber", response.data.userNumber);
          document.location.href = '/';

          // 로그인 성공했을 때, 아이디 저장 체크true이면,세션스토리지에 아이디 저장
          setRememberId(e.target.checked);
          if(rememberId === true) {
            sessionStorage.setItem("아이디", id);
            sessionStorage.setItem("userNumber", response.data.userNumber);
            document.location.href = '/';
          }
        }).catch(error => {
          console.log(error.response, id, password, "로그인 실패");
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        });
    }
  } // SignIn()

  // 엔터키 누르면 로그인 실행(id, pw input에 둘 다 연결)
  const onEnterPress = e => {
    if(e.key === 'Enter') {
      SignIn(e);
    }
  }

  return(
    <LoginWrapper>
      <TitleWrap><h2>로그인</h2></TitleWrap>
      <FormWrap action="/login" method="POST">
        <InputWrap>
          <FlexBox>
            <Input type="text" name="userId" value={id} placeholder="아이디를 입력하세요" maxLength={8} onChange={userId} onKeyDown={onEnterPress}></Input>
          </FlexBox>
        </InputWrap>

        <InputWrap>
          <Input
            type="password" name="userPassword" value={password} placeholder="비밀번호를 입력하세요" maxLength={8} onChange={userPassword} onKeyDown={onEnterPress}></Input>
        </InputWrap>

        <FlexBoxSB>
          <div>
            <input type="checkbox" name="saveId" onChange={e => handleOnCheck(e)} checked={rememberId}></input> 아이디 저장
          </div>
          <FlexBox className="find_user_info">
            <div onClick={goSearchId}><p><Link to='search/id'>아이디 찾기</Link></p></div>
            <div><span>&nbsp;|&nbsp;</span></div>
            <div onClick={goResetPwChk}><p><Link to='/search/check/id'>비밀번호 재설정</Link></p></div>
          </FlexBox>
        </FlexBoxSB>

        <ErrMsgWrap>
          <div><ErrMsg style={idMsgColor}>{IdMessage}</ErrMsg></div>
          <div><ErrMsg style={pswMsgColor}>{passwordMessage}</ErrMsg></div>
        </ErrMsgWrap>

        <SbmtBtnWrap>
          <BtnBg type="submit" onClick={SignIn} id="login-submit-btn">로그인</BtnBg>
          <BtnBorder type="submit" onClick={goJoin}>회원가입</BtnBorder>
        </SbmtBtnWrap>
      </FormWrap>
    </LoginWrapper>
  )
}

const LoginWrapper = styled.div`
  width: 400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
`;

const TitleWrap = styled.div`
  margin-bottom: 30px;
  text-align: center;
`

const FormWrap = styled.div`
  display: flex;
  flex-direction: column;

  .find_user_info {
    color: #aaa;
  }
`;

const InputWrap = styled.div`
  height: 48px;
`

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding-left: 10px;
  border: 1px solid #aaa;
`

const ErrMsg = styled.span`
  font-size: 12px;
`

const ErrMsgWrap = styled.div`
  margin-top: 10px;
`

const SbmtBtnWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90px;
  margin-top: 6px;

  #login-submit-btn {
    height: 40px;
  }
` 

export default Login;