const { ipcRenderer, dialog } = require('electron');

let folder = {
    name: "",
    languages: new Set([]),
    type: "VIDEO",
}
const createFolderButton = document.getElementById('show-dialog-button');
const createFolderButton2 = document.getElementById('show-dialog-button2');

createFolderButton.addEventListener('click', () => {

  ipcRenderer.send('create-folder', folder);
});



let languageContainer = document.getElementById("languages")
let file = document.getElementById("file")
let folderName = document.getElementById("folderName")
let foldertype = document.getElementById("foldertype")

let languages = ["ar_ZA", "fi_FI", "ko_KR", "es_MX", "ar_EG", "fr_FR", "ms_MY", "es_ES", "ca_ES", "fr_CA", "nb_NO", "es_419", "da_DK", "de_DE", "fa_IR", "sv_SE", "nl_NL", "el_GR", "pl_PL", "th_TH", "en_AU", "he_IL", "pt_BR", "zh_TW", "en_CA", "hi_IN", "pt_PT", "zh_HK", "en_IN", "hu_HU", "ro_RO", "tr_TR", "en_NZ", "id_ID", "ru_RU", "uk_UA", "en_GB", "it_IT", "sr_YU", "vi_VN", "en_US", "ja_JP", "zh_CN" ]



function toggleLanguage(language) {

    if (folder.languages.has(language)) 
    {folder.languages.delete(language)}
    
    else 
    {folder.languages.add(language)}

    renderButtons()
}

function renderButtons(){

    languageContainer.innerHTML = null
    languages.forEach((language)=>{
        let button = document.createElement("button")
        button.innerText = language
        button.style= `margin:2px; ${folder.languages.has(language)? " background-color:black;color:#fff;": ' background-color:unset'}`
        if (folder.type == "VIDEO" || folder.type == "STATIC") {

            button.disabled = true
        }
        button.addEventListener("click", ()=>toggleLanguage(language))
        languageContainer.appendChild(button)
    })

    
    
}

renderButtons()






folderName.addEventListener("input", (e)=>{
    folder.name = folderName.value
})

foldertype.addEventListener("input", (e)=>{
    
    folder.type = foldertype.value
    renderButtons()
})