

document.addEventListener("DOMContentLoaded", () => {
    const DOGSURL = "http://localhost:3000/dogs"
    const main = document.querySelector('main')
    const form = document.querySelector('form')

    function listDogs(){
        fetch(DOGSURL)
        .then(res => res.json())
        .then(dogs => dogs.forEach(dog => buildDog(dog)))
    }
    listDogs()

    
    function buildDog(dog){

        let div = document.createElement('div')
        div.id = dog.id

        let h2 = document.createElement('h2')
        h2.innerText = dog.name

        let pBreed = document.createElement('p')
        pBreed.innerText = dog.breed

        let img = document.createElement('img')
        img.src = dog.image

        let likeButton = document.createElement('button')
        likeButton.className = 'like-button'
        likeButton.innerText = 'Like'
        likeButton.addEventListener('click', (e) => likeDog(e, dog))

        let superButton = document.createElement('button')
        superButton.className = 'super-button'
        superButton.innerText = 'SUPER Like'
        superButton.addEventListener('click', (e) => superLike(e, dog))

        let pLikes = document.createElement('p')
        pLikes.className = 'likes-tag'
        pLikes.innerText = `Likes: ${dog.likes}`

        let pComments = document.createElement('p')
        pComments.innerText = 'Comments: '

        let ul = document.createElement('ul')
        ul.id = 'comment-ul'
        for(comment of dog.comments){
            let li = document.createElement('li')
            li.innerText = comment
            ul.append(li)
        }

        div.append(h2, pBreed, img, likeButton, superButton, pLikes, pComments, ul)
        main.appendChild(div)
        
        let label = document.createElement('label')
        label.innerText = 'Add Comment:'

        let commentInput = document.createElement('input')
        commentInput.placeholder = 'text here'
        commentInput.type = 'text'
        commentInput.name = 'comment'
        commentInput.value = ''

        let commentForm = document.createElement('form')

        let submitBtn = document.createElement('input')
        submitBtn.setAttribute('type', 'submit')
        
        commentForm.append(label, commentInput, submitBtn)
        commentForm.addEventListener('submit', (e) => postComment(e, dog))
        div.append(commentForm)
    }   

    function likeDog(e, dog){
        let pLikes = e.target.parentNode.querySelectorAll('p')[1]
        dog.likes+=1
        let dogLikes = dog.likes

        fetch(DOGSURL + `/${dog.id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({
                likes: dogLikes
            })
        })
        .then(res => res.json())
        .then(dog => {
            pLikes.innerHTML = `Likes: ${dog.likes}`
        })
    }

    function superLike(e, dog){
        let pLikes = e.target.parentNode.querySelectorAll('p')[1]
        let dogLikes = {
            likes: dog.likes+=10
        }

        fetch(DOGSURL + `/${dog.id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify(dogLikes)
        })
        .then(res => res.json())
        .then(dog => {
            pLikes.innerHTML = `Likes: ${dog.likes}`
        })
    }

    function postComment(e, dog){ 
        e.preventDefault()
        let ul = e.target.parentNode.querySelector('ul')
        
        let newComment = e.target.comment.value
        let array = dog.comments
        array.push(newComment)

        let data = {
            comments: array
        }
        fetch(DOGSURL + `/${dog.id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(dog => {
            ul.innerHTML = ''
            dog.comments.forEach(comment => {
                let newLi = document.createElement('li')
                newLi.innerText = comment
                ul.append(newLi)
            })
        })
    }
    
    
})