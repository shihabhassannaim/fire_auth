import './App.css';
import { initializeApp } from 'firebase/app';
import "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

const app = initializeApp(firebaseConfig);

function App() {
  const [user , setUser] = useState({
    isSignedIn : false , 
    name : '' , 
    email : '' ,
    photo : '' 
  });

  const provider = new GoogleAuthProvider();

  const handleEvent =()=>{
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
      const {displayName , photoURL , email} = result.user ;
      const signedInUser = {
        isSignedIn : true ,
        name : displayName , 
        email: email ,
        photo : photoURL 
      }
      setUser(signedInUser);
      console.log(result.user);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
}
const hadleSignedOut = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    const signedOutUser = {
      isSignedIn : false,
      name : '',
      email : '',
      photo : ''
    }
    setUser(signedOutUser);
  }).catch((error) => {

  });
}

return (
    <div className="App">
    {
      user.isSignedIn ?<button onClick={hadleSignedOut}>Sign Out</button> 
      :
      <button onClick={handleEvent}>Sign In</button>
    }
    {
      user.isSignedIn && <div>
        <p>Welcome {user.name}</p>
        <p>Your email : {user.email}</p>
      <img src={user.photo} alt="" />
      </div>
    }
    </div>
  );
}

export default App;
