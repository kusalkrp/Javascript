const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");



let userMessage;
const API_KEY="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";
const inputInitHeight = chatInput.scrollHeight;

const createChatli = (message, className) =>{
    //Create a chat <Li> element with passed message and clannName
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-icons">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent=message;
        return chatLi;
}

const generateResponse = (incomingChatli) =>{

    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatli.querySelector("p");
    const requestOptions = {

        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
        
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content:userMessage }]
            
              
        })   
    }
    //send post request to API,get response
    fetch(API_URL,requestOptions).then(res =>res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Ooops!!Something went wrong,Please try again..";
    }).finally(() =>    chatbox.scrollTo(0,chatbox.scrollHeight));


}


const handleChat = () => {
    userMessage = chatInput.value.trim();
   if(!userMessage) return;
   chatInput.value="";
   chatInput.computedStyleMap.height = `${inputInitHeight}px`


   //Append the user's message to the chatbox
   chatbox.appendChild(createChatli(userMessage,"outgoing"));
   chatbox.scrollTo(0,chatbox.scrollHeight);

  setTimeout(() => {
    //Display "Replying.." message while waiing for the reponse
    const incomingChatli = createChatli("Replying...", "incoming")
    chatbox.appendChild(incomingChatli);
    chatbox.scrollTo(0,chatbox.scrollHeight);
    generateResponse(incomingChatli);



   },600);
}


chatInput.addEventListener("input",() =>{
    //Adjust the height of the input textarea based on its content
chatInput.computedStyleMap.height = `${inputInitHeight}px`
chatInput.computedStyleMap.height = `${chatInput.scrollHeight}px`
});
 
chatInput.addEventListener("keyup",() =>{
    //If Enter key is pressed without shift key and the windoww width is greater than 800px,handle the chat
  if(e.key ==="Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));


