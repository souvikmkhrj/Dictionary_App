let input=document.querySelector('#input');
let searchBtn=document.querySelector('#search');
let apiKey='291d1caa-37a8-4e71-b5d6-46c146cdd4cb';
let notFound=document.querySelector('.not_found');
let defBox=document.querySelector('.def');
let audioBox=document.querySelector('.audio');
let loading=document.querySelector('.loading');

searchBtn.addEventListener('click',function(e){
    e.preventDefault();
    searchBtn.style.background ='red';
    //clear old data
    audioBox.innerHTML="";
    notFound.innerText="";
    defBox.innerText="";


    //get input data
    let word=input.value;
    //call API get data
    if(word===""){
        alert("Word is required")
        return;
    }
    getData(word);
    
});

async function getData(word){
    loading.style.display='block';
    // Ajax call
    const responce= await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`)
    const data= await responce.json();


    //if empty result
    if(!data.length){
        loading.style.display='none';
        notFound.innerText = 'No result found';
        searchBtn.style.background ='rgb(12, 64, 138)';
        return;
    }

    //if result is suggetions
    if(typeof data[0]==='string') {
        loading.style.display='none';
        let heading= document.createElement('h3');
        heading.innerText='Did you mean?'
        notFound.appendChild(heading);
        data.forEach(element=>{
            let suggetion =document.createElement('span');
            suggetion.classList.add('suggested')
            suggetion.innerText=element;
            notFound.appendChild(suggetion);
            return;
        })
    }


    //if click on suggestion
    document.querySelectorAll('.suggested').forEach(function(suggestedElement) {
        suggestedElement.addEventListener('click', function() {
          // Get the clicked suggestion's text
          let suggestedWord = suggestedElement.textContent;
          
          // Set the suggested word as the input value
          input.value = suggestedWord;
          
          // Trigger the search
          searchBtn.click();
        });
      });

    //If result found
    loading.style.display='none';
    //defination
    let defination=data[0].shortdef[0];
    defBox.innerText= defination;
    //sound
    let sound=data[0].hwi.prs[0].sound.audio;
    if (sound){
        renderSound(sound);
    }  
// console.log(data)
}


function renderSound(sound){
    // https://media.merriam-webster.com/audio/prons/[language_code]/[country_code]/[format]/[subdirectory]/[base filename].[format]
    let subdirectory=sound.charAt(0);
    let soundSrc= `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${sound}.mp3?key=${apiKey}`;
    let aud=document.createElement('audio');
    aud.src=soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}
