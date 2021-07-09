
import React,{ useState , useEffect } from 'react'
import { FaEye,FaCartPlus,FaRegEdit,FaSave,FaShoppingCart,FaPaypal } from 'react-icons/fa';
import { Card,Button,Modal,Col,Image,Form } from 'react-bootstrap';
import Scents from './Scents';

export default function Body({database=null,dbstorage=null,username=null}) {
    const [modalShow, setModalShow] = useState(false);
    const [editItemModalShow, setEditItemModalShow] = useState(false);
    const [cartModalShow, setCartModalShow] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [items,setItems] = useState([]);
    const [orders,setOrders] = useState([]);
    
    useEffect(() =>{
        if(database){
            const unsubscribe = database
                .collection('items')
                .limit(100)
                .onSnapshot(querySnapshot =>{
                
                const data = querySnapshot.docs.map(doc =>({
                    ...doc.data(),
                    id:doc.id,
                }));
                setItems(data);
            })

            return unsubscribe;
        }
    },[database]);
    const editItemModalHandler = ((item)=>{
        setEditItemModalShow(true);
        setModalData(item)
    })

    const itemModalHandler = ((item)=>{
        setModalShow(true);
        setModalData(item)
    })
    const updateItem = ((item) =>{
      var price = document.getElementById("item-edit-price").value;
      var stocks = document.getElementById("item-edit-stocks").value;

        database.collection("items").where("itemID", "==",item.itemID )
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              doc.ref.update({price:price,stocks:stocks})
              setEditItemModalShow(false)
            });
      })
      // let userRef = dbstorage.ref(`/items/${item.id}`);
      // console.log(userRef)
      // userRef.child.update({'price':price,'stocks':stocks})
    });
    const addToCartHandler =((item)=>{
        if(username!=="Login with Facebook"){
            var variantURL = document.getElementById("item-scent-url").value;
            var scent = document.getElementById("item-scent-id").value;
            var qty = document.getElementById("order-quantity").value;
            if(scent && qty){
                //Add to cart
                setOrders([...orders,{
                    scent     : scent,
                    qty       : qty,
                    itemName  : item.itemName,
                    price     : item.price,
                    url       : variantURL
                }])
                setModalShow(false)
            }
            else{
               alert("Please Select Scent or Quantity")
            }
        }
        else{
            alert("Please Login First")
        }
    })
    const onClickHandler = (itemId,scentName,variantURL)=>{
        var x = document.getElementsByClassName("item-scent");
        [].forEach.call(x, function(el) {
          el.classList.remove("item-selected");
        });
        document.getElementById("item-scent-url").value = variantURL;
        document.getElementById("item-scent-id").value = scentName;
        document.getElementById(`item-scent-`+itemId).className  = "item-selected item-scent";

    }
    const MyVerticallyCenteredModal = ((props)=> {
        return (
           <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Item Description
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Col className="modal-image modal-items" xs={6} md={4}>
                    <Image className="modal-image-img" src={modalData.imgURL} rounded />
                </Col >
                <div className="modal-data modal-items">
                    <span className="modal-item-info"> <span className="modal-item-labels">Name:</span> <h4>{modalData.itemName}</h4></span>
                    <span className="modal-item-info"> <span className="modal-item-labels">Price:</span> <h4>{modalData.price}</h4></span>
                    <span className="modal-item-info"> <span className="modal-item-labels">Stocks:</span> <h4>{modalData.stocks}</h4> </span>
                </div>
                <div className="modal-order modal-items">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control id="order-quantity" type="number" placeholder="0" min="0" />
                </div>
                 <Scents database={database} onClickHandler={onClickHandler} itemId={modalData.itemID}></Scents>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={()=>addToCartHandler(modalData)}><FaCartPlus className="addtocart-icon"></FaCartPlus>Add to cart</Button>
            </Modal.Footer>
          </Modal>
        );
      });
      console.log("orders",orders)
      const EditItemsModal = ((props)=> {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Edit Item
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Col className="modal-image modal-items" xs={6} md={4}>
                    <Image className="modal-image-img" src={modalData.imgURL} rounded />
                </Col >
                <div className="modal-data edit-items">
                    <span className=""> <span className="edit-item-labels">Name:</span><h4>{modalData.itemName}</h4></span>
                    <span className=""> <span className="edit-item-labels">Price:<br/></span> 
                    <input id="item-edit-price" type="number" defaultValue={modalData.price}></input><br/></span>
                    <span className=""> <span className="edit-item-labels">Stocks:<br/></span> 
                    <input id="item-edit-stocks" type="number" defaultValue={modalData.stocks}></input></span>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={()=>updateItem(modalData)}><FaSave className="addtocart-icon"></FaSave>Save Changes</Button>
            </Modal.Footer>
          </Modal>
        );
      })
      const CashierHandler = ()=>{
        setCartModalShow(true);
      }
      const removeOrder = (itemName) =>{
        var newOrders =  orders.filter(function(order) {
          return order.itemName !== itemName;
        });
        setOrders(newOrders)
      }
      function handleUpload(e) {
          var cust_Email = document.getElementById("cust_Email").value;
          
          database.collection('customer_info').add({
              cust_Email: cust_Email,
          })
          setCartModalShow(false)
      }
      const CartModal = ((props)=> {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Your Cart
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
              orders.length > 0 ?
              orders.map((order)=>(
                <>
                  <Card style={{ width: '18rem' }} key={order.itemID}>
                    <Card.Img variant="top" src={order.url} />
                    <Card.Body>
                      <Card.Title>{order.itemName}<br/><span>({order.scent} scent)</span></Card.Title>
                      <Card.Text>
                        <span>Price: </span>{order.price}<br/>
                        <span>Quantity: </span>{order.qty}<br/>
                        <span>Total: </span>{order.qty * order.price}<br/>
                      </Card.Text>
                      <Button onClick={()=>removeOrder(order.itemName, order.itemID)} variant="primary">Remove Order</Button>
                    </Card.Body>
                  </Card>
                  
                    <Form.Group className="mb-3" controlId="cust_Email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" />
                    </Form.Group>
                  </>
                ))
                :
                <div>You currently have no item in the Cart.</div>
              } 
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleUpload}><FaPaypal className="addtocart-icon"></FaPaypal>Checkout</Button>
            </Modal.Footer>
          </Modal>
        );
      })
return (
        <>
            <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)}/>
            <EditItemsModal show={editItemModalShow} onHide={() => setEditItemModalShow(false)}/>
            <CartModal show={cartModalShow} onHide={() => setCartModalShow(false)}/>
            <div className="open-cashier" onClick={CashierHandler}>
                    <FaShoppingCart id="cart-icon"/>CART
            </div>
        {
            items.map(item=>(
                <Card style={{ width: '20rem' }} key={item.id}>
                <Card.Img style={{ width: '20rem' }} variant="top" src={item.imgURL} />
                <Card.Body>
                    <Card.Title>{item.itemName}</Card.Title>
                    <Card.Text>Php.{item.price}.00</Card.Text>
                    <Button className="item-buttons" variant="dark" onClick={()=>itemModalHandler(item)}><FaEye className="addtocart-icon"></FaEye>View Item</Button>
                    {username ? null : <Button className="item-buttons" variant="dark" onClick={()=>editItemModalHandler(item)}><FaRegEdit className="addtocart-icon"></FaRegEdit>Edit Item</Button>}
                </Card.Body>
                </Card>
            ))
        }
        </>
    )
}