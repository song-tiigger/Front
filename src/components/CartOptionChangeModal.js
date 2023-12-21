import styled from "styled-components";
import { FlexBox, FlexBoxSB } from "../styles/Layout";
import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";


function CartOptionChangeModal({ isModalOpened, closeModal, cartList }) {

  console.log('modal cartList', cartList);
  
  const cart = useSelector((state) => state.cart);
  console.log('modal cart', cart);

  
  /* 선택한 옵션을 화면에 나타내기 */
  // 옵션 선택
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  
  const handleSelectedSize = e => {
    setSelectedSize(e.target.value);
    setSelectedColor('');
  }
  
  const handleSelectedColor = e => {
    setSelectedColor(e.target.value);
  }

  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // const minus = (optionIndex) => {
  //   const updatedOptions = [...selectedOptions];
  //   if(updatedOptions[optionIndex].quantity > 1) {
  //     updatedOptions[optionIndex].quantity -= 1;
  //     setSelectedOptions(updatedOptions);
  //   }
  // };

  // const plus = (optionIndex) => {
  //   const updatedOptions = [...selectedOptions];
  //   updatedOptions[optionIndex].quantity += 1;
  //   setSelectedOptions(updatedOptions);
  // };

  const quantityUpdate = () => {
    axios.post('/changeCount', {
      productQuantity: 4,
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const productColors = ['red', 'green', 'blue'];

  return(
    <ModalWrapper className={`${isModalOpened ? "open" : "close"}`}>
      <ModalBackGround>
        <div className="modal_content">
          <div>옵션 변경</div>
          <div className="close_modal_box"><button id="colse_modal_btn" onClick={closeModal}></button></div>
        

          <SelectBox className="select_box">
            {/* 사이즈, 색상 변경 */}
            <select
              value={selectedSize || ""}
              onChange={handleSelectedSize}
            >
              <option value="">사이즈 선택</option>
              {cart.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <select
              value={selectedColor || ""}
              onChange={handleSelectedColor}
              >
              <option value="">색상 선택</option>
              {selectedSize && productColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            {/* 수량 변경 */}
            {/* <button id="minus_btn" onClick={() => minus(index)}>-</button>
            <span id="option_quantity">{option.quantity ? option.quantity : 1}</span>
            <button id="plus_btn" onClick={() => plus(index)}>+</button> */}

            <FlexBox>
              <button onClick={closeModal}>취소</button>
              <button>적용</button>
            </FlexBox>

          </SelectBox> {/* select_box */}

          
        </div>
        
      </ModalBackGround>
    
    </ModalWrapper>
  )
}

const ModalWrapper = styled.div`

  &.open {
    display: block;
  }

  &.close {
    display: none;
  }
`

const ModalBackGround = styled.div`
  position: fixed;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(51, 51, 51, 0.4);

  .modal_content {
    position: absolute; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 320px;
    margin: 0 auto;
    background-color: #fff;
  }

  .close_modal_box {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
  }

  #colse_modal_btn {
    positon: absolute;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;

    &:before,
    &:after {
      position: absolute;
      top: 0;
      left: 50%;
      width: 1px;
      height: 40px;
      content: '';
      background: #333;
    }

    &:before {
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
    }





  }
`


const SelectBox = styled.div`
  margin-bottom: 40px;

  select {
    width: 360px;
    height: 40px;
    margin-bottom: 10px;
    padding: 0 10px;
    font-size: 12px;
    border: 1px solid #ccc;
    border-radius: none;

    &:first-child {
      margin-bottom: 4px;
    }
  }

`

const SelectedOptionBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 400px;
  height: auto;
  font-size: 14px;

  ul {
    
    li {
      display: flex;
      align-items: centery;
      width: 400px;
      height: 40px;
      padding-left: 10px;
      // border-bottom: 1px solid #ccc;
      background-color: orange;
      margin-bottom: 4px;

      #minus_btn,
      #plus_btn,
      #remove_btn {
        width: 20px;
        height: 20px;
        border-radius: none;
        cursor: pointer;
      }

      #option_text {
        display: flex;
        align-items: center;
        width: 200px;
        background-color: yellow;

      }

      #minus_btn {
        // margin-left: 120px;
      }

      #option_quantity {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
      }

      #plus_btn {
        // margin-right: 80px;
      }

      #option_cal_price {
        display: flex;
        align-items: center;
      }

      #remove_btn {
        margin-left: 20px;
        right: 0;
        border: none;
        background: none;
      }
    }
  }
`



export default CartOptionChangeModal;