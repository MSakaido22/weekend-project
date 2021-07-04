import React,{ useState , useEffect } from 'react'
import { Form } from 'react-bootstrap';

export default function Scents({database=null,onClickHandler=null,itemId=null}) {
    const [items,setItems] = useState([]);
    
    useEffect(() =>{
        if(database){
            const unsubscribe = database
                .collection('scents')
                .limit(100)
                .onSnapshot(querySnapshot =>{
                
                const data = querySnapshot.docs.map(doc =>({
                    ...doc.data(),
                    id:doc.id,
                }));
                var newData =  data.filter(function(scent) {
                    return scent.forItem === itemId;
                });
                setItems(newData);
            })
            return unsubscribe;
        }
    },[database,itemId]);
    return (
        <div className="modal-scents modal-items">
            <Form.Label>Scents</Form.Label>
            <input type="text" id="item-scent-url" className="hidden"/> 
            <input type="text" id="item-scent-id" className="hidden"/> 
            <input defaultValue={itemId} type="text" id="item-id"className="hidden"/>
            <div className="item-scent-container">
                {
                    items.map(item=>(
                        <div className="item-scent" key={item.id} id={`item-scent-`+item.id}>
                            <img alt={item.itemName} onClick={()=>onClickHandler(item.id,item.scentName,item.imgURL)} className="item-scent-image" src={item.imgURL} />
                        </div>
                    ))
               }
            </div>
        </div>
    )
}
