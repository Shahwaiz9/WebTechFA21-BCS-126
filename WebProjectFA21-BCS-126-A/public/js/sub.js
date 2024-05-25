let addingbtn=document.getElementById("addIngredientsBtn");
let inglist=document.querySelector('.ingredientList');
let ingdiv=document.querySelectorAll('.ingredeintDiv')[0];

addingbtn.addEventListener('click',function(){
    let newIng=ingdiv.cloneNode(true);
    let input= newIng.getElementsByTagName('input')[0];
    input.value='';
    inglist.appendChild(newIng);
})