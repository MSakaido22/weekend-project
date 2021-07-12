import React,{ useState } from 'react'
import { Navbar,Nav,Modal,Button,Dropdown,Form } from 'react-bootstrap';
import { CgLogOut } from 'react-icons/cg';
import { GrFacebook } from 'react-icons/gr';
import { RiAddBoxFill } from 'react-icons/ri';
import { RiFileListFill } from 'react-icons/ri';


export default function Header({userID=null,database=null,dbstorage=null,adminSignin=null,login=null,logout=null,username=""}) {
    const [modalShow, setModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [listModalShow, setListModalShow] = useState(false);
    const [orderLists, setOrderLists] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [total, setTotal] = useState(0);

    const adminHandler =()=>{
        if(username!=null){
            logout();
        }
        setModalShow(true)
    }
    const adminLoginHandler = () =>{
        var email = document.getElementById("email").value
        var password = document.getElementById("password").value
        adminSignin(email,password)
        setModalShow(false)
    }
    const handleOnSubmit = () =>{
        if(database){
            handleUpload();
        }
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
              <Modal.Title controlId="contained-modal-title-vcenter">
                Admin Login
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={adminLoginHandler} >Login</Button>
            </Modal.Footer>
          </Modal>
        );
      })

        function handleUpload(e) {
            var itemName = document.getElementById("item-name").value;
            var price = document.getElementById("item-price").value;
            var stocks = document.getElementById("item-stock").value;
            var input = document.getElementById('formFile');
            var refs= database.collection("items").doc();
            var itemID = refs.id;

            var file = input.files[0];
            const ref = dbstorage.ref(`/images/${file.name}`);
            const uploadTask = ref.put(file);
            uploadTask.on("state_changed", console.log, console.error, () => {
            ref
                .getDownloadURL()
                .then((url) => {
                    database.collection('items').add({
                        itemID: itemID,
                        itemName: itemName,
                        price : price,
                        stocks : stocks,
                        imgURL: url,
                    })
                    setAddModalShow(false)
                });
            });
            
            handleMultipleUploads(itemID);
        }
        const handleMultipleUploads = (itemID)=>{
            var inputScents = document.getElementById('formFileMultiple');
            var name;
            for(var i=0;i<inputScents.files.length;i++){
                var file = inputScents.files[i];
                name = file.name.split('.').slice(0, -1).join('.');

                const ref = dbstorage.ref(`/images/${file.name}`);
                const uploadTask = ref.put(file);
                console.log("uploadTask: ",uploadTask)
                uploadTask.on("state_changed",
                    function(snapshot) {
                    }, 
                    function(err) {
                    // Handle unsuccessful uploads
                    }, () => {
                    ref
                    .getDownloadURL()
                    .then((url) => {
                        console.log("fuckin name: ",file.name)
                        database.collection('scents').add({
                            scentName:name,
                            forItem: itemID,
                            imgURL: url,
                        })
                    });
                });
            }
        }
        const getLists = () =>{
            database
            .collection('customer_info')
            .limit(100)
            .onSnapshot(querySnapshot =>{
                const data = querySnapshot.docs.map(doc =>({
                    ...doc.data(),
                    id:doc.id,
                }));
                var newData =  data.filter(function(dt) {
                    return dt.userID === userID;
                  });
                  setUserInfo(newData);
            });
            database
            .collection('customer_order')
            .limit(100)
            .onSnapshot(querySnapshot =>{
                const data = querySnapshot.docs.map(doc =>({
                    ...doc.data(),
                    id:doc.id,
                }));
                var newData =  data.filter(function(dt) {
                    return dt.userID === userID;
                  });
                  setOrderLists(newData);
            });
            getTotal();
            setListModalShow(true);
        }
        const getTotal = () =>{
            var tot = 0;
            orderLists.map((list)=>{
                tot += list.order.price * list.order.qty;
            })
            setTotal(tot)
        }
      const OrderList = ((props)=> {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title controlId="contained-modal-title-vcenter">
                Order List
              </Modal.Title>
            </Modal.Header>
            <Modal.Body >
                {
                    orderLists.map((list,index)=>( 
                        <><h1 className="list-item-name">
                            Item No. {index+1}
                        </h1>
                        <Modal.Body key={userID}>
                            <Form.Group controlId="cust-name" className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" readOnly value={list.order.itemName}/>
                            </Form.Group>
                            <Form.Group controlId="cust-contact" className="mb-3">
                                <Form.Label>Item Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter name" readOnly value={list.order.price}/>
                            </Form.Group>
                            <Form.Group controlId="cust-address" className="mb-3">
                                <Form.Label>Item Quantity</Form.Label>
                            <Form.Control type="number" placeholder="Enter name" readOnly value={list.order.qty}/>
                            </Form.Group>  
                            <Form.Group controlId="cust-address" className="mb-3">
                                <Form.Label>Sub Total</Form.Label>
                            <Form.Control type="number" placeholder="Enter name" readOnly value={list.order.qty * list.order.price}/>
                            </Form.Group>  
                        </Modal.Body></>
                    ))
                }
                <Modal.Body>
                    <Form.Group controlId="total" className="mb-3">
                        <Form.Label>Total</Form.Label>
                    <Form.Control type="text" placeholder="0" readOnly value={total}/>
                    </Form.Group>
                </Modal.Body>
                {
                    userInfo.map((list)=>(
                        <><h1 className="list-item-name">
                            Customer Information
                        </h1>
                        <Modal.Body key={userID}>
                            <Form.Group controlId="cust-name" className="mb-3">
                                <Form.Label>Customer Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" readOnly value={list.cust_Name}/>
                            </Form.Group>
                            <Form.Group controlId="cust-contact" className="mb-3">
                                <Form.Label>Customer Contact</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" readOnly value={list.cust_Con}/>
                            </Form.Group>
                            <Form.Group controlId="cust-address" className="mb-3">
                                <Form.Label>Customer Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" readOnly value={list.cust_Add}/>
                            </Form.Group>  
                        </Modal.Body></>
                    ))
                }
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={()=>setListModalShow(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        );
      })
      const AddNewItem = ((props)=> {
        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title controlId="contained-modal-title-vcenter">
                New Item
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Item Image</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>Item Scents</Form.Label>
                    <Form.Control type="file" multiple />
                </Form.Group>
                <Form.Group controlId="item-name" className="mb-3">
                    <Form.Label>Item Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
                </Form.Group>
                <Form.Group controlId="item-price" className="mb-3">
                    <Form.Label>Item Price</Form.Label>
                <Form.Control  type="number" placeholder="0" min="0" />
                </Form.Group>
                <Form.Group controlId="item-stock" className="mb-3">
                    <Form.Label>Item Stocks</Form.Label>
                <Form.Control  type="number" placeholder="0" min="0" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleOnSubmit}>Save Item</Button>
            </Modal.Footer>
          </Modal>
        );
      })
      return (
        <>
            <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)}/>
            <AddNewItem show={addModalShow} onHide={() => setAddModalShow(false)}/>
            <OrderList show={listModalShow} onHide={() => setListModalShow(false)}/>
            <Navbar bg="dark" variant="dark" expand="lg">
            
            <Navbar.Brand href="#Home"><img alt="logo" className="main-icon" src="https://www.seekpng.com/png/full/133-1334437_rwby-ruby-rose-rwby-ruby-rose-transparent.png"></img>The Weekend Project</Navbar.Brand> 
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                 <Nav className="mr-auto">
                    <Nav.Link href="#Home">Home</Nav.Link>
                    <Nav.Link href="#Products">Products</Nav.Link>
                    <Nav.Link href="#About Us">About Us</Nav.Link>
                    <Nav.Link onClick={adminHandler}>Admin</Nav.Link>
                 </Nav>
                 <Navbar.Collapse className="justify-content-end">
                {
                    username !== "Login with Facebook"?
                    <>
                        <Navbar.Text>
                            Signed in as: &nbsp;
                        </Navbar.Text>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark" controlId="dropdown-basic">
                                {username ? username : "Admin"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item  onClick={logout}><CgLogOut></CgLogOut>Logout</Dropdown.Item>
                                {
                                    username ? null : 
                                    <>
                                        <Dropdown.Item  onClick={() => setAddModalShow(true)}><RiAddBoxFill></RiAddBoxFill>Add Item</Dropdown.Item>
                                        <Dropdown.Item  onClick={() => getLists()}><RiFileListFill></RiFileListFill>Order List</Dropdown.Item>
                                    </>
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                    :
                    <Button onClick={login}><GrFacebook className="facebook-logo"></GrFacebook>{username}</Button>
                }
            </Navbar.Collapse>
            </Navbar.Collapse>
            </Navbar>

        </>
    )
}
