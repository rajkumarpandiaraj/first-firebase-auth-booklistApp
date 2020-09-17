const loginFormContainer = document.querySelector('.login-form-container');
const signUpFormContainer = document.querySelector('.signup-form-container');
const appContainer = document.querySelector('.app-container');

const loginForm = document.querySelector('.login-form');
const signUpForm = document.querySelector('.signup-form');
const inputForm = document.querySelector('#form');



const logIn = document.querySelector('.login');
const logOut = document.querySelector('.logout');
const signUp = document.querySelector('.signup');

let userEmail = 'hlo';
const list = document.getElementById('table-body');


const setupUI = (user) =>{
    if(user){
        logIn.style.display = 'none';
        signUp.style.display = 'none';
        logOut.style.display = 'block';

        loginFormContainer.style.display = 'none';
        appContainer.style.display = 'block';
        signUpFormContainer.style.display = 'none';
    
    } else {
        logIn.style.display = 'block';
        signUp.style.display = 'block';
        logOut.style.display = 'none' ;

        loginFormContainer.style.display = 'block';
        appContainer.style.display = 'none';
        signUpFormContainer.style.display = 'none';
    
    }
}

auth.onAuthStateChanged(user =>{
    if(user){
        userEmail = `${user.email}`;
        setupUI(user);
        snapEvent(user.email);

    } else{
        setupUI();
    }
})

const renderBookToUI = (doc) =>{

        if(doc.data().title !== 'dummy'){
            const row = document.createElement('tr');
            row.setAttribute('id', doc.id);
            row.innerHTML = `<td>${doc.data().title}</td>
                            <td>${doc.data().author}</td>
                            <td>${doc.data().isbn}</td>
                            <td><i class="fa fa-trash delete"></i></td>`

            list.appendChild(row);

            const deleteBtn = document.querySelectorAll(".delete");
            deleteBtn.forEach(del =>{
            del.addEventListener('click', e =>{
                let id = e.target.parentElement.parentElement.getAttribute('id');
                db.collection(`${userEmail}`).doc(id).delete();
            })
        })
        }

        
}

const snapEvent = (user) =>{
    db.collection(`${user}`).onSnapshot(snapshot =>{
        let changes = snapshot.docChanges();
        changes.forEach(change =>{
            if(change.type === 'added'){
                renderBookToUI(change.doc);
            } else if(change.type === 'removed'){
                let td = document.querySelector(`#${change.doc.id}`) 
                td.remove();
            }
        })
    })
} 




//EventListeners
signUp.addEventListener('click', ()=>{
    loginFormContainer.style.display = 'none';
    appContainer.style.display = 'none';
    signUpFormContainer.style.display = 'block';
})

logIn.addEventListener('click', ()=>{
    loginFormContainer.style.display = 'block';
    appContainer.style.display = 'none';
    signUpFormContainer.style.display = 'none';
    
})

logOut.addEventListener('click', ()=>{
    list.innerHTML=''
    auth.signOut().then(()=>{
        console.log('userLogged Out');
    })
})

signUpForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = signUpForm['signup-email'].value;
    const password = signUpForm['signup-password'].value;

    console.log(email, password);

    auth.createUserWithEmailAndPassword(email, password)
    .then(cred =>{
        console.log(cred.user);
        db.collection(`${cred.user.email}`).add({
            title : 'dummy',
            author : 'dummy',
            isbn : 'dummy'
        }).then(() =>{ userEmail = `${cred.user.email}` })
        signUpForm['signup-email'].value = '';
        signUpForm['signup-password'].value = '';

    })
})

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
        loginForm['login-password'].value = '';
        loginForm['login-email'].value = '';
    })
})
inputForm.addEventListener('submit', e =>{
    e.preventDefault();
    if(form['title'].value === '' || form['author'].value === '' || form['isbn'].value ===''){
        alert('Kindly Enter The Required Fields');
    } else{
        db.collection(`${userEmail}`).add({
            title : inputForm['title'].value,
            author : inputForm['author'].value,
            isbn : inputForm['isbn'].value
        })
        inputForm['title'].value  = '';
        inputForm['author'].value = '';
        inputForm['isbn'].value = '';
    
    }
    
})
// db.collection(`${userEmail}`).onSnapshot(snapshot =>{
//     console.log(userEmail);
//     console.log(snapshot);
//     let changes = snapshot.docChanges();
//     console.log(changes);
//     changes.forEach(change =>{
//         if(change.type === 'added'){
//             console.log(change.doc.data());
//             renderBookToUI(change.doc);
//         } else if(change.type === 'removed'){
//             console.log('rem');
//             let td = document.querySelector(`#${change.doc.id}`) 
//             td.remove();
//         }
//     })
// })



