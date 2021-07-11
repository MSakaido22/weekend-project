import './App.css';
import React,{ useState , useEffect } from 'react'
//firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import Header from './components/Header';
import Body from './components/Body';

firebase.initializeApp({
  apiKey: "AIzaSyAbeoRowkEQNQVkyeYI2HAIhAfIuRLFMuE",
  authDomain: "weekend-project-47dca.firebaseapp.com",
  projectId: "weekend-project-47dca",
  storageBucket: "weekend-project-47dca.appspot.com",
  messagingSenderId: "746246306027",
  appId: "1:746246306027:web:eea222a6ee4e5ac41ce6ae"
});

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

function App() {
  const [user,setUser] = useState(()=> auth.currentUser);
  const [initializing,setInitializing] = useState(true);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user =>{
      if(user){
        setUser(user);
      }else{
        setUser(null);
      }
      if(initializing){
        setInitializing(false);
      }
    });

    return unsubscribe;
  },[initializing])
  
  const signInWithFacebook = async () => {
    const googleProvider = new firebase.auth.FacebookAuthProvider();
    auth.useDeviceLanguage();
    try{
      await auth.signInWithPopup(googleProvider);
    }catch(error){
      console.log(error);
    }
  };

  const adminSignin = async (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      setUser(userCredential.user);
      // ...
    })
    .catch((error) => {
      console.log(error);
    });
  };

const signOut = async () =>{
  try{
    await firebase.auth().signOut();
  }catch(error){
    console.log(error);
  }
}
console.log(user)
return (
    <>
    <div className="pageBG">
         <Header userID={user? user.uid : null} database={db} dbstorage={storage} adminSignin={adminSignin} login={signInWithFacebook} logout={signOut} username={user? user.displayName: "Login with Facebook"}></Header>
         <img src="cvr.jpg" style={{width: '100%'}}/>
         <img src="intr.png" style={{width: '100%'}}/>
         <img src="prdct.png" style={{width: '100%'}}/>
         <Body userID={user? user.uid : null} database={db} dbstorage={storage} username={user? user.displayName: "Login with Facebook"}></Body>
         <img src="about.png" style={{width: '100%'}}/>
    </div>
    </>
  );
}

export default App;