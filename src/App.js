import './App.css';
import { initializeApp } from 'firebase/app';
import "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

const app = initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  const provider = new GoogleAuthProvider();

  const handleEvent = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(result.user);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
  const hadleSignedOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        error: '',
        success: false,
        photo: ''
      }
      setUser(signedOutUser);
    }).catch((error) => {

    });
  }
  const handleSubmit = (e) => {
    console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch(error => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if (!newUser && user.email && user.password) {
      const auth = getAuth();

      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log(res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });

    }
    e.preventDefault();
  }
  const handleBlur = (e) => {
    let isFormValid = true;
    if (e.target.name === 'email') {
      isFormValid = /^\S+@\S+\.\S+$/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      // const passHasNum = /\d(1)/.test(e.target.value);
      isFormValid = isPasswordValid;
    }
    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const updateUserName = name => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: { name }
    }).then(() => {
      console.log(name , "Updated profile");
    }).catch((error) => {
      
    });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={hadleSignedOut}>Sign Out</button>
          :
          <button onClick={handleEvent}>Sign In</button>
      }
      <button>Sign In With Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome {user.name}</p>
          <p>Your email : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id='' />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {
          newUser && <input name='name' type='text' onBlur={handleBlur} placeholder='Write Your Name' />
        }
        <br />
        <input type="text" name='email' onBlur={handleBlur} placeholder='Write Your E-mail' required />
        <br />
        <br />
        <input type="password" name='password' onBlur={handleBlur} placeholder='password' required /><br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In '} Successfully. </p>
      }
    </div>
  );
}

export default App;
