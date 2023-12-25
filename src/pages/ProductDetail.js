import styled from "styled-components";
import { Container, FlexBox, FlexBoxSB } from "../styles/Layout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../store";

import { SlBag } from "react-icons/sl"
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";


/* 
1. admin이 isLogin===true이면 [수정]버튼 보이게 하기 ( )
2. [수정] 버튼 클릭하면 상품 수정 페이지로 이동( )
상품 등록 페이지로 이동하되 기존 데이터는 남아있게
3. 할인가 표시하기 - 서버에서 받은 데이터 중에서 할인가 있으면 할인가 표시
*/


function ProductDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productName: '',
    productPrice: 0,
    discountRate: 0,
    discountPrice: 0,
    productSizes: [],
    productColors: [],
    productQuantity: 0,
    productExplanation: '',
    productExplanation1: '',
    productExplanation2: '',
  })
  const {productName, productPrice, discountRate, discountPrice, productSizes, productColors, productQuantity, productExplanation, productExplanation1, productExplanation2} = product;

  // 이미지 데이터 배열로 저장
  const [imgData, setImgData] = useState([]);

  /* db에 저장된 상품 데이터 불러오기(비동기) */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/productView', {
          productNumber: id
        })
        setImgData(response.data);
        setProduct(response.data[0]);
        sessionStorage.setItem("productNumber", response.data[0].productNumber);
        // setMajorCategory(response.data[0].categoryMajorCode);
        // setMinorCategory(response.data[0].categoryMinorCode);
      }
      catch(error) {
        console.log(error);
        if(product.length === 0) {
          console.log('데이터 없음');
        }
      }
    }
    fetchData();
  }, [id]);
  
  
  /* 이미지 경로 배열에 담기 */
  const [imgPathList, setImgPathList] = useState([]);
  useEffect(() => {
    const newImgPathList = imgData.map(item => 
      `/upload/${item.fileUploadPath}/${item.fileUuid}_${item.fileName}`
    );
    setImgPathList(newImgPathList);
  }, [imgData]); 
  // console.log('imgPathList', imgPathList);


  /* 선택한 옵션을 화면에 나타내기 */
  // 옵션 선택
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  
  const handleSelectedSize = e => {
    setSelectedSize(e.target.value);
  }
  
  const handleSelectedColor = e => {
    setSelectedColor(e.target.value);
  }

  // 선택된 옵션 보여주기
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log('selectedOptions', selectedOptions);

  const handleAddOption = () => {
    if (selectedColor && selectedSize) {
      let price = Number(discountRate !== null ? discountPrice : productPrice);
      const newOption = { 
        id: id + selectedSize + selectedColor, // 고유한 키 생성(옵션이 다르면 다른 상품으로 취급해야하기 때문)
        productNumber: id, // 상품의 원래 아이디
        img: imgPathList[0],
        name: productName,
        text: selectedSize + ", " + selectedColor,
        size: selectedSize, 
        color: selectedColor,
        quantity: 1, 
        sum: price,
        productPrice: productPrice,
        discountPrice: discountPrice,
        productSizes : productSizes,
        productColors : productColors,
        cartNumber: '',
      };
  
      const existingOptionIndex = selectedOptions.findIndex(option => 
        option.id === newOption.id
      );
  
      if (existingOptionIndex >= 0) {
        const newOptions = [...selectedOptions];
        alert("이미 선택된 옵션 입니다.");
        setSelectedOptions(newOptions);

        setSelectedSize("");
        setSelectedColor("");
      } else {
        setSelectedOptions([...selectedOptions, newOption]); // 새로운 옵션 추가

        setSelectedSize("");
        setSelectedColor("");
      }
    }
  };

  useEffect(() => {
    handleAddOption();
  }, [selectedColor]);
  /* handleAddOption내부 코드를 useEffect 내부로 옮겨도 될까? X
  -> useEffect는 React 컴포넌트의 생명주기 중 특정 시점에 동작하도록 설계된 Hook입니다. 일반적으로 useEffect는 데이터 fetching, 구독 설정, 수동으로 변경해야 하는 React 컴포넌트의 DOM 등 side effect를 수행할 때 사용합니다.

handleAddOption 함수의 경우, 특정 사용자의 액션(옵션 선택)에 의해 호출되는 이벤트 핸들러 함수입니다. 이를 useEffect 내부로 옮기는 것은 적절하지 않을 수 있습니다.

왜냐하면 useEffect는 컴포넌트 렌더링 후에 실행되는 함수이기 때문에, 렌더링이 여러 번 발생하거나, 의도치 않은 시점에 함수가 실행될 수 있기 때문입니다.

따라서, handleAddOption의 로직을 그대로 유지하고, 선택된 사이즈와 색상이 변경될 때마다 이 함수를 호출하도록 하는 것이 좋습니다. 사이즈와 색상이 변경될 때마다 handleAddOption 함수를 호출하려면, 이 두 상태를 useEffect의 의존성 배열에 추가하면 됩니다. */

  const minus = (optionIndex) => {
    const updatedOptions = [...selectedOptions];
    if(updatedOptions[optionIndex].quantity > 1) {
      updatedOptions[optionIndex].quantity -= 1;
      setSelectedOptions(updatedOptions);
    }
  };

  const plus = (optionIndex) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[optionIndex].quantity += 1;
    setSelectedOptions(updatedOptions);
  };

  const removeOption = (optionIndex) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions.splice(optionIndex, 1);
    setSelectedOptions(updatedOptions);
  };
  
  const calculateEachPrice = (optionIndex) => {
    let option = selectedOptions[optionIndex];
    let totalPrice = option.sum * option.quantity;
    return totalPrice;
  };

  // 총 상품 금액 계산하기
  // const calculateAllPrice = () => {
    
  // }


  const addCart = () => {
    if(selectedOptions.length > 0) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const isAlreadyInCart = selectedOptions.some(option => {
        return cart.find(cartItem => cartItem.id === option.id);
      });

      if(isAlreadyInCart) {
        alert("이미 장바구니에 있는 상품 입니다.");
      } else {
        // 모든 요청을 담을 배열
        const requests = selectedOptions.map(option => 
          axios.post('/addCart', {
            userNumber: sessionStorage.getItem("userNumber"),
            productNumber: id,
            cartCount: 12,
            selectedSize: option.size,
            selectedColor: option.color,
          })
        );
  
        // 모든 요청이 완료될 때까지 기다림
        Promise.all(requests)
          .then(responses => {
            axios.post('/userCart', {
              userNumber: sessionStorage.getItem("userNumber"),
            })
              .then(response => {
                console.log('userCart', response.data);
                // const cartNumbers = response.data.map(item => item.cartNumber);

                // 모든 요청이 성공적으로 완료된 후에 액션 디스패치
                const serverOptions = response.data;
                selectedOptions.forEach(option => {
                  const matchingOption = serverOptions.find(data =>
                    data.selectedSize === option.size &&
                    data.selectedColor === option.color
                  );

                  if(matchingOption) {
                    option.cartNumber = matchingOption.cartNumber;
                    dispatch(addToCart({...option, cartNumber: matchingOption.cartNumber}));
                  }
                });

                // 로컬 스토리지에 아이템 저장
                selectedOptions.forEach(option => {
                  cart.unshift(option);
                });
                localStorage.setItem('cart', JSON.stringify(cart));
                alert("장바구니에 상품이 담겼습니다.");
              })
              .catch(error => {
                console.log('userCart error', error);
              })
              })
          .catch(error => {
            console.log(error);
          });
      }
    } else {
      alert("옵션을 선택해 주세요.");
    }
  }

  return(
    <ProductDetailWrap>
      <Container>
        <CtgryWrap>
          <FlexBox>
            <div>대분류</div>
            <span></span>
            <div>소분류</div>
          </FlexBox>
          <div><h2>현재 카테고리</h2></div>
        </CtgryWrap>

        <FlexBox>
          <div className="left">
            <ThumbWrap className="detail_img_wrap">
              <div className="main_img">
                <img id="admin_thumb_img" src={`${imgPathList[0]}`} alt="thumbnail" />
              </div>
              <div className="next_img_wrap">
                {imgPathList.map((img, index) => (
                  <img src={`${img}`} key={index} alt="등록한 이미지"/>
                ))}
              </div>
            </ThumbWrap>
          </div>

          <div className="right">
            <InfoWrap className="detail_infos_wrap">
              <div><h3>{productName}</h3></div>
              <PriceWrap>
                {discountRate > 0 ? (
                  <>
                    <span className="dscnt_rate">{discountRate}%</span>
                    <span className="dscnt_price">{discountPrice}</span>
                    <span className="price">{productPrice}</span>
                  </>
                ) : (
                  <>
                    <span className="non_dscnt_price">{productPrice}</span>
                  </>
                )}
              </PriceWrap>

              <SelectBox className="select_box">
                <select
                  value={selectedSize || ""}
                  onChange={handleSelectedSize}
                >
                  <option value="">사이즈 선택</option>
                  {productSizes.map((size) => (
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

                <SelectedOptionBox>
                    <ul>
                      {selectedOptions.map((option, index) => (
                        <li key={index}>
                          <span id="option_text">{option.text}</span>
                          <div className="handle_quantity_box">
                            <button id="minus_btn" onClick={() => minus(index)}></button>
                            <span id="option_quantity">{option.quantity ? option.quantity : 1}</span>
                            <button id="plus_btn" onClick={() => plus(index)}></button>
                          </div>
                          <span id="option_cal_price">{calculateEachPrice(index)}원</span>
                          <div id="remove_btn_box">
                            <button id="remove_btn" onClick={() => removeOption(index)}></button>
                          </div>
                        </li>    
                      ))}
                    </ul>
                </SelectedOptionBox>
                <FlexBoxSB>
                  <div>총 상품 금액</div>
                  <div>계산 값</div>
                </FlexBoxSB>
              </SelectBox> {/* select_box */}

              <BuyBtnWrap className="btn_wrap">
                <button id="buy_btn">바로구매</button>
                <button id="add_cart_btn" onClick={addCart}><SlBag size={24}/></button>
                <button id="add_wish_btn"><IoIosHeartEmpty size={28} /></button>
              </BuyBtnWrap>


              {/* 아코디언 메뉴 참고 -> 간단하게 이미지 클릭하면 state를 변경시켜 해당 메뉴 스타일 display none 에서 블락으로 변경만 시켜주면 될것 같습니다 */}
              <div className="explanation">
                <p>
                  {productExplanation}
                  {/* 상품 설명입니다. 소재, 디자인 포인트, 활용 방법 등에 관해 설명하면 됩니다. 상품 설명입니다. 소재, 디자인 포인트, 활용 방법 등에 관해 설명하면 됩니다.상품 설명입니다. 소재, 디자인 포인트, 활용 방법 등에 관해 설명하면 됩니다.상품 설명입니다. 소재, 디자인 포인트, 활용 방법 등에 관해 설명하면 됩니다.상품 설명입니다. 소재, 디자인 포인트, 활용 방법 등에 관해 설명하면 됩니다.상품 설명입니다. 소재, 디자인 포인트, 활용 방법 등에 관해 설명하면 됩니다.상품 설명입니다. 소재, 디자인 포인트, 활용 방법 등에 관해 설명하면 됩니다. */}
                </p>
              </div>
              <div className="size_guide">
                <p>
                  {productExplanation1}
                  {/* 사이즈 가이드 설명 쓰세요<br />
                  상세 사이즈 표시하기 <br /> */}
                </p>
              </div>
              <div className="shipping_guide">
                <p>
                  {productExplanation2}
                  {/* 배송 및 환불 안내 <br />
                  배송은 어쩌구 저쩌구 <br />
                  환불은 이래이래 저래저래 */}
                </p>
              </div>
            </InfoWrap> {/* detail_infos_wrap */}
          </div> {/* right */}
        </FlexBox>

      </Container>
    </ProductDetailWrap>
  )
}

const ProductDetailWrap = styled.div`
width: 100%;
min-width: 1200px;
// background-color: orange;

  .left {
    width: 580px;
    height: 100%;
    margin-right: 20px;
    // background-color: yellowgreen;
  }
  
  .right {
    width: 400px;
    // background-color: yellow;
  }
`

const CtgryWrap = styled.div`

  /* CtgryWrap의 first-child는 FlexBox컴포넌트 */
  div:first-child { 
    line-height: 20px;
  }

  span {
    position: relative;
    width: 20px; 
    height: 20px;
  }

  span::after {
    position: absolute;
    left: 24%; top: 32%;
    content: '';
    width: 6px;
    height: 6px;
    border-top: 2px solid #aaa; 
    border-right: 2px solid #aaa; 
    transform: rotate(45deg); 
  }

  h2 {
    margin: 8px 0 20px;
  }
`

const ThumbWrap = styled.div`
  // width: 50%;
  // background-color: red;

  .main_img {
    width: 580px;
    height: 704px;
    margin-bottom: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .next_img_wrap {
    width: 100%;
    display: flex;
    // background-color: pink;

    img {
      width: 80px;
      height: 94px;
      margin-right: 10px;
      object-fit: cover;
      cursor: pointer;
    }
  }
`

const InfoWrap = styled.div`
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }
`

const PriceWrap = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 120px;

  .non_dscnt_price {
    line-height: 20px;
    font-size: 20px;
  }

  /* 할인가 스타일 적용 */
  .dscnt_rate {
    font-size: 20px;
    color: red;
  }

  .dscnt_price {
    font-size: 20px;
    margin: 0 8px;
  }

  .price {
    font-size: 14px;
    line-height: 20px;
    text-decoration: line-through;
    color: #aaa;
  }
`

const SelectBox = styled.div`
  margin-bottom: 40px;

  select {
    width: 400px;
    height: 28px;
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
    margin-bottom: 10px;

    &:last-child {
      border-bottom: 1px solid #eee;
    }

    li {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
      width: 400px;
      height: 40px;
      padding: 0 2px;
      // background: pink;

      #minus_btn,
      #plus_btn {
        width: 20px;
        height: 20px;
        font-size: 20px;
        line-height: 20px;
        background: none;
        border: 1px solid #ccc;
        border-radius: 2px;
        cursor: pointer;

        &:hover {
          background-color: #eee;
          transition: all 0.3s;
        }
      }

      #option_text {
        display: flex;
        align-items: center;
        min-width: 160px;
        // background-color: yellow;
      }

      .handle_quantity_box {
        display: flex;
        width: cal(20px + 20px + 32px);
      }

      #minus_btn {
        position: relative;

        &:before {
          position: absolute;
          top:50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 1px;
          content: '';
          background: #333;
        }
      }

      #option_quantity {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
      }

      #plus_btn {
        position: relative;

        &:before,
        &:after {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 1px;
          content: '';
          background: #333;
        }

        &:before {
          transform: translate(-50%, -50%);
        }

        &:after {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
        }
      }

      #option_cal_price {
        display: block; 
        width: 100px;
        text-align: right;
        // background: pink;
      }

      #remove_btn_box {
        display: flex;
        position: relative;
        align-items: center;
        width: 20px;
        height: 20px;

        #remove_btn {
          position: absolute;
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 2px;
          cursor: pointer;

          &:before,
          &:after {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1px;
            height: 10px;
            content: '';
            background: #333;
          }
  
          &:before {
            transform: translate(-50%, -50%) rotate(45deg);
          }
  
          &:after {
            transform: translate(-50%, -50%) rotate(-45deg);
          }
        } // #remove_btn
      } // #remove_btn_box
    } // li
  } // ul
`

const BuyBtnWrap = styled.div`
  display: flex;
  gap: 4px;

  #buy_btn,
  #add_cart_btn,
  #add_wish_btn {
    height: 60px;
    cursor: pointer;
  }
  

  #buy_btn {
    flex-grow: 2;
    font-size: 20px;
    color: #fff;
    background-color: #333;
    border: none;
  }

  #add_cart_btn {
    width: 60px;
    background: none;
    border: 1px solid #333;

    svg {
      color: #999;
    }
  }

  #add_wish_btn {
    position: relative;
    width: 60px;
    background: none;
    border: 1px solid #333;

    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #F82A2A;
    }
  }
`

export default ProductDetail;